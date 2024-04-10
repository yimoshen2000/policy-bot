import { ResearchItem, Bot } from "../botService";
import { ChatBubbleData } from "../../components/ChatBubble";
import { SearchResult, queryDatabase, promptAI } from "../pixelService";

const URL = "https://files.fasab.gov/pdffiles";
const MINIMALQUALITY = 0.6;
const VectorModel = "5eaed3cc-73f2-4bac-b30d-7343e17bb1cc";
const AIModel = "001510f8-b86e-492e-a7f0-41299775e7d9";

class FASABResearch implements ResearchItem {
  filename: string;
  book: string;
  chapter: string;
  page: string;
  content: string;

  private constructor(filename: string, book: string, chapter: string, page: string, content: string) {
    this.filename = filename;
    this.book = book;
    this.chapter = chapter;
    this.page = page;
    this.content = content;
  }

  static parsePixel(pixel: SearchResult): FASABResearch {
    const [_, book_type, chapter_num, ...qualifier] = pixel.Source.replace(".pdf", "").split("_");
    const book = book_type === "sffas" ? "SFFAS" : "Technical Release";
    const chapter = `${chapter_num}${qualifier.length === 0 ? "" : " " + (qual => qual[0].toUpperCase() + qual.slice(1).toLowerCase()) (qualifier[0])}`;
    const page = pixel.Divider;
    const content = pixel.Content;
    return new FASABResearch(pixel.Source, book, chapter, page, content);
  }

  formatToPrompt(): string {
    const source = `${this.book} ${this.chapter}`;

    return "" +
      `Source: ${source}\n` +
      `Pages: ${this.page}\n` +
      `Contents: """${this.content}"""`;
  }

  formatToURL(): string {
    return `${URL}/${this.filename}`;
  }
}

class FASAB extends Bot {
  constructor() {
    super("FASABot");
  }

  buildPrompt(user_prompt: string, research: FASABResearch[], history: ChatBubbleData[]): string {
    return "" +
      "Background: As an expert of the United States Federal Financial Accounting " +
      "Standards, you may use research data compiled by your assistant researchers " +
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

  async doResearch(prompt: string): Promise<FASABResearch[]> {
    return queryDatabase(prompt, MINIMALQUALITY, VectorModel, 5)
      .then(results => results.map(FASABResearch.parsePixel))
  }

  async askModel(prompt: string): Promise<string> {
    return promptAI(prompt, AIModel);
  }
}

export const FASABot = new FASAB();
