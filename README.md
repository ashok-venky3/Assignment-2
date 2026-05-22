# AI Assignment 2

This workspace includes:

- `src/mcp-server` — a simple Express-based MCP-style server with health and context endpoints.
- `src/playwright` — a local Playwright app server serving a demo page and an API endpoint.
- `tests/playwright` — Playwright tests that validate the demo app.

## Commands

- `npm install` — install dependencies
- `npm run build` — compile TypeScript to `dist`
- `npm run start:mcp` — start the MCP server on port `4000`
- `npm run start:playwright` — start the Playwright app server on port `3000`
- `npm run start:all` — start both the MCP and Playwright app servers together
- `npm run test:playwright` — build and run Playwright tests

## REST Assured MCP tests

A Java REST Assured test module is available at `rest-assured`.

- `cd rest-assured && mvn test` — run MCP API tests against `http://localhost:4000`

## File server MCP

The MCP server now supports file operations:

- `GET /files` — list uploaded files
- `POST /files/upload` — upload files with multipart form data using field name `files`
- `GET /files/:name` — download a stored file
- `DELETE /files/:name` — remove a stored file

Uploaded files are stored in the `uploads/` directory at project root.

## Excel agent

The MCP server now exposes Excel agent endpoints for workbook creation and inspection:

- `POST /excel/create` — create an Excel workbook from JSON sheet data; returns `workbookBase64`
- `POST /excel/inspect` — inspect an uploaded Excel file and return sheet metadata

The Excel agent implementation lives in `src/excel-agent`.

## MCP Client

- `src/mcp-client/index.ts` — a small MCP client wrapper for `health()` and `sendContext()` requests.

## Notes

- `npm run dev:mcp` and `npm run dev:playwright` run the servers directly from TypeScript using `ts-node-dev`.
- `npm run prepare` installs Playwright browsers.
