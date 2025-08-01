export class Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;

  constructor(role: 'user' | 'assistant', content: string) {
    this.id = crypto.randomUUID();
    this.role = role;
    this.content = content;
    this.timestamp = Date.now();
  }
}
