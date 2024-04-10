import { ChatBubbleData } from "../components/ChatBubble";

export interface ResearchItem {
  formatToPrompt(): string;
  formatToURL(): string;
}

export abstract class Bot {
  title: string;
  constructor(title: string) {
    this.title = title;
  }

  abstract buildPrompt(user_prompt: string, research: ResearchItem[], history: ChatBubbleData[]): string;
  abstract doResearch(prompt: string): Promise<ResearchItem[]>;
  abstract askModel(prompt: string): Promise<string>;

  async ask(user_prompt: string, history: ChatBubbleData[]): Promise<string> {
    const research = await this.doResearch(user_prompt);
    const prompt = this.buildPrompt(user_prompt, research, history);
    return this.askModel(prompt);
  }
}
