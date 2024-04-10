import { ResearchItem, Bot } from "../botService";
import { ChatBubbleData } from "../../components/ChatBubble";
import { SearchResult, queryDatabase, promptAI } from "../pixelService";

const URL = "https://comptroller.defense.gov/Portals/45/documents/fmr/current";
const MINIMALQUALITY = 0.6;
const VectorModel = "0e3368e9-5000-4747-98a3-e60c03d2467e";
const AIModel = "001510f8-b86e-492e-a7f0-41299775e7d9";

class FMRResearch implements ResearchItem {
  volume: string;
  chapter: string;
  title: string;
  page: string;
  content: string;

  private constructor(volume: string, chapter: string, title: string, page: string, content: string) {
    this.volume = volume;
    this.chapter = chapter;
    this.title = title;
    this.page = page;
    this.content = content;
  }

  static parsePixel(pixel: SearchResult): FMRResearch {
    const [volume, chapter, ...titleparts] = pixel.Source.replace(".pdf", "").split("(")[0].trim().split("_");
    const title = titleparts.join(" ")
    const page = pixel.Divider;
    const content = pixel.Content;
    return new FMRResearch(volume, chapter, title, page, content);
  }

  formatToPrompt(): string {
    const source = `Volume ${this.volume}, Chapter ${this.chapter}: ${this.title}`;

    return "" +
      `Source: ${source}\n` +
      `Pages: ${this.page}\n` +
      `Contents: """${this.content}"""`;
  }

  formatToURL(): string {
    return `${URL}/${this.volume}/${this.volume}_${this.chapter}.pdf`
  }
}

class FMR extends Bot {
  constructor() {
    super("FMPRBot");
  }

  buildPrompt(user_prompt: string, research: FMRResearch[], history: ChatBubbleData[]): string {
    return "" +
      "Background: As an expert of the United States Financial Management Regulations " +
      "(FMR) policy, you may use research data compiled by your assistant researchers " +
      "labelled 'Context', if available, to answer the client's prompt labelled " +
      "'Client Prompt' below. Site all sources used from the research and respond with " +
      "only the answer to the 'Client Prompt' and nothing else. Do not pad with " +
      "labels.\n\n" +

      ( research.length > 0
        ? "Context:\n" +
            `${research.map(item => item.formatToPrompt()).join("\n")}` +
          "\n\n"
        : ""
      ) +

      ( history.length > 0
        ? "Conversation So Far:\n" +
            `${history.map<string>(item => item.promptHistory).join("\n")}` +
          "\n\n"
        : ""
      ) +

      `Client Prompt: ${user_prompt}`;
  }

  async doResearch(prompt: string): Promise<FMRResearch[]> {
    return queryDatabase(prompt, MINIMALQUALITY, VectorModel, 5)
      .then(results => results.map(FMRResearch.parsePixel))
  }

  async askModel(prompt: string): Promise<string> {
    return promptAI(prompt, AIModel);
  }
}

export const FMRBot: FMR = new FMR();
