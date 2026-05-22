import mcpApp from '../mcp-server/app.js';
import playwrightApp from '../playwright/app.js';

const playwrightPort = Number(process.env.PORT) || 3000;
const mcpPort = Number(process.env.MCP_PORT) || 4000;

playwrightApp.listen(playwrightPort, () => {
  console.log(`Playwright app running on http://localhost:${playwrightPort}`);
});

mcpApp.listen(mcpPort, () => {
  console.log(`MCP server running on http://localhost:${mcpPort}`);
});
