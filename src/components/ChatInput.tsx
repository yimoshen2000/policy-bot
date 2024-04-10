export default function ChatInput({ botName, searchTerm, setSearchTerm, handleSend, isLoaded }: {
  botName: string,
  searchTerm: string,
  setSearchTerm: (term: string) => void,
  handleSend: (term: string) => Promise<void>,
  isLoaded: boolean
}) {

  async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      return handleSend(searchTerm);
    }
  }

  return (
    <div className="w-full">
      <div className="flex p-4">
        <input
          placeholder={`Message ${botName}...`} type='text' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}
          disabled={!isLoaded}
          onKeyDown={handleKeyDown}
          className="form-input block w-full px-4 py-3 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-r-0 border-solid border-gray-300 rounded-l-2xl focus:text-gray-700 focus:bg-white focus:border-green-600 focus:outline-none"
        />
        <button
          onClick={() => handleSend(searchTerm)}
          disabled={!isLoaded}
          className={`px-4 py-2 ${isLoaded ? "bg-green-500" : "bg-gray-500"} text-white font-bold border border-solid border-gray-300 rounded-r-2xl ${isLoaded ? "hover:bg-green-700" : ""} focus:outline-none focus:border-green-600 transition ease-in-out`}>
          Send
        </button>
      </div>
    </div>
  );
}
