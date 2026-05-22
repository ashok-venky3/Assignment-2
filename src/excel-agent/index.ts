import * as XLSX from 'xlsx';

export interface ExcelSheetData {
  name: string;
  data: Array<Array<unknown>>;
}

export interface ExcelCreateRequest {
  sheets: ExcelSheetData[];
}

export interface ExcelSheetSummary {
  name: string;
  rowCount: number;
  columnCount: number;
  sampleRows: Array<Array<unknown>>;
}

export interface ExcelInspection {
  sheetNames: string[];
  sheets: ExcelSheetSummary[];
}

export function createWorkbookPayload(payload: ExcelCreateRequest) {
  const workbook = XLSX.utils.book_new();
  const sheetNames: string[] = [];

  for (const sheet of payload.sheets) {
    const worksheet = XLSX.utils.aoa_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    sheetNames.push(sheet.name);
  }

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  const workbookBase64 = buffer.toString('base64');

  return { buffer, workbookBase64, sheetNames };
}

export function inspectWorkbook(buffer: Buffer): ExcelInspection {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetNames = workbook.SheetNames;

  const sheets = sheetNames.map((name: string) => {
    const worksheet = workbook.Sheets[name];
    const rows = XLSX.utils.sheet_to_json<Array<unknown>>(worksheet, { header: 1, raw: true });
    const sampleRows = rows.slice(0, 5);
    const rowCount = rows.length;
    const columnCount = rows.reduce((max: number, row: unknown) => Math.max(max, Array.isArray(row) ? row.length : 0), 0);
    return { name, rowCount, columnCount, sampleRows };
  });

  return { sheetNames, sheets };
}
