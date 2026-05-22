import express from 'express';
import path from 'path';

const app = express();
const staticRoot = path.join(process.cwd(), 'src', 'playwright', 'static');
app.use(express.static(staticRoot));

app.get('/api/echo', (req, res) => {
  res.json({ message: 'Playwright server is ready', timestamp: new Date().toISOString() });
});

export default app;
