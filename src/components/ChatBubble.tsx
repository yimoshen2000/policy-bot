export abstract class ChatBubbleData {
  getMessage: string;
  getColor: string;
  getDirection: boolean;

  constructor(message: string, color: string, direction: boolean) {
    this.getMessage = message;
    this.getColor = color;
    this.getDirection = direction;
  }

  Render(index: number): JSX.Element {
    return (
      <div key={index} className={`mt-4 px-4 ${this.getDirection ? "pl-8" : ""} ${!this.getDirection ? "pr-8" : ""}`}>
        <div className={`${this.getColor} p-4 rounded-2xl shadow-md`}>
          <p>{this.getMessage}</p>
        </div>
      </div>
    );
  }

  abstract get promptHistory(): string;
}

class UserBubble extends ChatBubbleData {
  constructor(message: string) { super(message, "bg-green-200", true); }

  get promptHistory(): string {
    return `Client: ${this.getMessage}`;
  }
}

class AIBubble extends ChatBubbleData {
  constructor(message: string) { super(message, "bg-white", false); }

  get promptHistory(): string {
    return `AI: ${this.getMessage}`;
  }
}

class ErrorBubble extends ChatBubbleData {
  constructor(message: string) { super(message, "bg-red-200", false); }

  get promptHistory(): string {
    return `Error: ${this.getMessage}`;
  }
}

export function userBubble(message: string): UserBubble {
  return new UserBubble(message);
}

export function aiBubble(message: string): AIBubble {
  return new AIBubble(message);
}

export function errorBubble(message: string): ErrorBubble {
  return new ErrorBubble(message);
}
