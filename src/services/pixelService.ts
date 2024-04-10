import { Env } from '@semoss/sdk';
import { Insight } from '@semoss/sdk';

if (import.meta.env.MODE !== 'production') {
    Env.update({
        MODULE: import.meta.env.VITE_MODULE || '',
        ACCESS_KEY: import.meta.env.VITE_ACCESS_KEY || '',
        SECRET_KEY: import.meta.env.VITE_SECRET_KEY || '',
        APP: import.meta.env.VITE_APP || '',
    });
}

export interface PixelOutput {
  Score: number;
  Source: string;
  Divider: string;
  Part: string;
  Content: string;
  Tokens: number;
  Modality: string;
}

export interface SearchResult extends PixelOutput{
  id: number;
}

const INSIGHT = new Insight();

export async function queryDatabase(prompt: string, quality: number, model: string, limit: number): Promise<SearchResult[]> {
  // NOTE: this sanitizes backslashes, double quotes, and single quotes
  const cleaned = prompt.replace(/\\/g, "\\\\") // escape backslashes
                        .replace(/"/g, "\\\"")  // escape double quotes
                        .replace(/'/g, "\\'");  // escape single quotes

  const raw = await INSIGHT.actions.run(
    `VectorDatabaseQuery(engine="${model}", command="${cleaned}", limit=${limit})`
  );

  return raw.pixelReturn
    .flatMap<PixelOutput>( pixel =>
      { const output = pixel.output as string | PixelOutput[];

        // if the query is a string, it failed but was not explicitly thrown
        if (typeof output === "string") {
          return [];
        }

        return output;
      })
    .flatMap<SearchResult>( (output, index) =>
      { if (output.Score > quality) return [];
        return [{
          id: index,
          ...output
        }];
      });
}

export async function promptAI(prompt: string, model: string): Promise<string> {
  return INSIGHT.actions.askModel(model, prompt)
    .then(response => response.output.response);
}
