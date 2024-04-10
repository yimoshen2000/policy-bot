import ChatInput from '../components/ChatInput'
import { FMRBot } from "../services/Bots/FMR";
import { FASABot } from "../services/Bots/FASAB";
import { Bot } from "../services/botService";
import { useState, useRef, useEffect } from 'react';
import { ChatBubbleData, userBubble, aiBubble, errorBubble } from '../components/ChatBubble';

const bots: Bot[] = [FASABot, FMRBot];
const bot: Bot = bots[0];

export default function Home() {
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [bubbles, setBubbles] = useState<Array<ChatBubbleData>>([]);
  const [sendTerm, setSendTerm] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function handleSend(term: string) {
    if (!term) return;
    setIsLoaded(false);
    setSendTerm('');

    const bubbleBuilder: ChatBubbleData[] = [...bubbles, userBubble(term)];
    setBubbles([...bubbleBuilder]);

    try {
      const message = await bot.ask(term, bubbles);
      bubbleBuilder.push(aiBubble(message));

    } catch (err) {
      console.error(err);
      bubbleBuilder.push(errorBubble("Error processing that request."));

    } finally {
      setBubbles([...bubbleBuilder]);
      setIsLoaded(true);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bubbles]);

  return (
    <>
      <header className="sticky top-0 w-full p-4 z-50 bg-gray-200 shadow-md bg-opacity-10 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold"><a href="./">{bot.title}<span className="text-green-600 text-4xl">.</span></a></h1>
      </header>

      <main className="font-sans mb-20">
        <div className="max-w-screen-lg mx-auto">
          {bubbles.map((bubble, index) => bubble.Render(index))}
          {isLoaded === false && <div className="p-4">AI is thinking...</div>}
          <div ref={messagesEndRef}/>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full">
        <div className="max-w-screen-lg mx-auto">
          <ChatInput
            botName={bot.title}
            handleSend={handleSend}
            searchTerm={sendTerm}
            setSearchTerm={setSendTerm}
            isLoaded={isLoaded}
          />
        </div>
      </footer>
    </>
  );
}
