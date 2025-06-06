import { useState, useEffect, useRef } from 'react';
import './App.css';
import { URL } from './constants';
import Answer from './components/Answer';
import Sidebar from './components/Sidebar';
import { FiMenu } from 'react-icons/fi';

function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(undefined);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('chat-history')) || [];
    setHistory(stored);
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [result]);

  const saveToHistory = (question, answer) => {
    const data = { question, answer };
    const updated = [...history, data];
    setHistory(updated);
    localStorage.setItem('chat-history', JSON.stringify(updated));
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResult(undefined);

    const payload = {
      contents: [
        {
          parts: [{ text: question }]
        }
      ]
    };

    try {
      let response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      response = await response.json();

      let dataString = response.candidates[0].content.parts[0].text;
      let dataArray = dataString.split('* ').map(item => item.trim());
      setResult(dataArray);
      saveToHistory(question, dataArray);
    } catch (error) {
      alert("Something went wrong while fetching the answer.");
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (item) => {
    setQuestion(item.question);
    setResult(item.answer);
    setSidebarOpen(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-5 h-screen bg-gradient-to-br from-zinc-900 to-black text-white font-sans relative'>
      {/* Sidebar toggle for mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className='absolute top-4 left-4 z-50 md:hidden text-2xl'
      >
        <FiMenu />
      </button>

      {/* Sidebar */}
      <div
        className={`md:col-span-1 fixed md:static top-0 left-0 h-full bg-zinc-900 border-r border-zinc-700 z-40 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar history={history} onSelect={handleHistorySelect} />
      </div>

      {/* Main Chat Section */}
      <div className='md:col-span-4 flex flex-col p-4 md:p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent'>Gemini Clone</h1>
          {/* Export button removed */}
        </div>

        <div className='flex-grow overflow-y-auto px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 shadow-inner space-y-3 transition-all duration-300 custom-scrollbar'>
          {loading && <p className="text-gray-400 animate-pulse">Thinking...</p>}
          <ul>
            {result && result.map((item, index) => (
              <li key={index} className='transition-all duration-200 hover:bg-zinc-700/50 p-2 rounded relative group'>
                <Answer ans={item} index={index} />
                <button
                  onClick={() => handleCopy(item)}
                  className='absolute top-2 right-2 text-xs bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded hidden group-hover:block transition'
                >Copy</button>
              </li>
            ))}
          </ul>
          <div ref={messageEndRef}></div>
        </div>

        {/* Input Bar */}
        <div className='mt-4 flex items-center gap-2 bg-zinc-800 border border-zinc-600 rounded-full px-4 py-2 shadow-xl hover:shadow-2xl transition-all'>
          <input
            type='text'
            className='flex-grow bg-transparent outline-none px-3 py-2 text-sm'
            placeholder='Ask me anything...'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
          />
          <button
            onClick={askQuestion}
            className='bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200'
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
