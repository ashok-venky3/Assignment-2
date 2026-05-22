import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createWorkbookPayload, inspectWorkbook } from '../excel-agent/index.js';

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const upload = multer({ dest: UPLOAD_DIR });

app.get('/', (req, res) => {
  res.json({ status: 'mcp server', version: '0.1.0', uptimeSeconds: process.uptime() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptimeSeconds: process.uptime() });
});

app.post('/context', (req, res) => {
  const payload = req.body;
  res.json({
    received: payload,
    timestamp: new Date().toISOString(),
    message: 'MCP context accepted'
  });
});

app.post('/excel/create', (req, res) => {
  const payload = req.body;
  if (!payload || !Array.isArray(payload.sheets)) {
    return res.status(400).json({ error: 'sheets array is required' });
  }

  const workbook = createWorkbookPayload(payload);
  res.json({
    message: 'excel created',
    sheetNames: workbook.sheetNames,
    workbookBase64: workbook.workbookBase64
  });
});

app.post('/excel/inspect', upload.single('file'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ error: 'file upload is required' });
  }

  const buffer = fs.readFileSync(req.file.path);
  const inspection = inspectWorkbook(buffer);
  res.json({ message: 'excel inspected', ...inspection });
});

app.get('/files', (req, res) => {
  const files = fs.readdirSync(UPLOAD_DIR).map((name) => ({ name, url: `/files/${encodeURIComponent(name)}` }));
  res.json({ files });
});

app.post('/files/upload', upload.array('files', 10), (req, res) => {
  const uploaded = (req.files as Express.Multer.File[]).map((file) => ({
    originalName: file.originalname,
    storedName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    url: `/files/${encodeURIComponent(file.filename)}`
  }));
  res.json({ message: 'files uploaded', files: uploaded });
});

app.get('/files/:name', (req, res) => {
  const safeName = path.basename(req.params.name);
  const filePath = path.join(UPLOAD_DIR, safeName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'file not found' });
  }
  res.download(filePath, safeName);
});

app.delete('/files/:name', (req, res) => {
  const safeName = path.basename(req.params.name);
  const filePath = path.join(UPLOAD_DIR, safeName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'file not found' });
  }
  fs.unlinkSync(filePath);
  res.json({ message: 'file deleted', name: safeName });
});

export default app;
