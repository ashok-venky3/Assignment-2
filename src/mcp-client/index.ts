export interface McpContextPayload {
  userId: string;
  sessionId: string;
  data: Record<string, unknown>;
}

export class McpClient {
  constructor(private readonly baseUrl: string) {}

  private buildUrl(path: string) {
    return `${this.baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  }

  async health() {
    const response = await fetch(this.buildUrl('/health'));
    return response.json();
  }

  async sendContext(payload: McpContextPayload) {
    const response = await fetch(this.buildUrl('/context'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return response.json();
  }
}
