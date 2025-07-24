import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'; 
import io from 'socket.io-client'; 

import Header from '../components/Header';
import CodeEditor from '../components/CodeEditor';
import FeedbackPanel from '../components/FeedbackPanel';
import OutputPanel from '../components/OutputPanel';

const SOCKET_SERVER_URL = "http://localhost:3001";

const Session = () => {
  const { roomId } = useParams();
  const [code, setCode] = useState("# Welcome to your collaborative session!\n# Share the URL to invite others.\n\nprint('Hello, world!')");
  const [output, setOutput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  const pyodide = useRef(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);

  const socketRef = useRef(); 

  useEffect(() => {

    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.emit('join-room', roomId);

    socketRef.current.on('load-document', (document) => {
      setCode(document); // Load the code received from the server
    });

    socketRef.current.on('code-update', (newCode) => {
      setCode(newCode);
    });
    
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    const loadPyodide = async () => {
      pyodide.current = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/"
      });
      setIsPyodideLoading(false);
    };
    loadPyodide();
  }, []);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socketRef.current.emit('code-change', { roomId, newCode });
  };

  const handleRun = async () => {
    if (!pyodide.current) {
      return;
    }
    setIsRunning(true);
    setOutput('');
    try {
      pyodide.current.runPython(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `);
      await pyodide.current.loadPackagesFromImports(code);
      const result = pyodide.current.runPython(code);
      const stdout = pyodide.current.runPython("sys.stdout.getvalue()");
      if (result !== undefined) {
         setOutput(stdout + String(result));
      } else {
         setOutput(stdout);
      }
    } catch (error) {
      setOutput(String(error));
    }
    setIsRunning(false);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setFeedback('');
    try {
      const response = await fetch('http://localhost:3001/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        throw new Error('Failed to get feedback from the server.');
      }
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      setFeedback('Sorry, something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMsg('Link Copied!');
      setTimeout(() => setShareMsg(''), 1800);
    } catch {
      setShareMsg('Failed to copy');
      setTimeout(() => setShareMsg(''), 1800);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 font-sans">
      <Header onShare={handleShare} shareMsg={shareMsg} />
      <main className="flex-grow flex flex-col md:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col w-full md:w-3/5 gap-6">
          <div className="flex-grow h-64 md:h-[340px] lg:h-[400px]">
            <CodeEditor code={code} onCodeChange={handleCodeChange} />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRun}
              disabled={isRunning || isPyodideLoading}
              className="w-1/2 bg-green-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:bg-green-400 transition-colors disabled:bg-green-700 disabled:cursor-not-allowed tracking-wide"
            >
              {isPyodideLoading ? 'Loading Engine...' : (isRunning ? 'Running...' : 'Run Code')}
            </button>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-1/2 bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:bg-indigo-400 transition-colors disabled:bg-indigo-700 disabled:cursor-not-allowed tracking-wide"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
            </button>
          </div>
          <div className="h-48 md:h-56">
            <OutputPanel output={output} isRunning={isRunning} />
          </div>
        </div>
        <div className="w-full md:w-2/5 flex flex-col">
          <FeedbackPanel feedback={feedback} isLoading={isAnalyzing} />
        </div>
      </main>
    </div>
  );
};

export default Session;