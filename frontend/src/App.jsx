import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import FeedbackPanel from './components/FeedbackPanel';
import OutputPanel from './components/OutputPanel'; 

export default function App() {
  const [code, setCode] = useState("print('Hello, world!')");
  const [feedback, setFeedback] = useState('');
  const [output, setOutput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRunning, setIsRunning] = useState(false); 

  const pyodide = useRef(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);

  // Initialize Pyodide
  useEffect(() => {
    const loadPyodide = async () => {
      console.log("Loading Pyodide...");
      pyodide.current = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/"
      });
      console.log("Pyodide loaded successfully.");
      setIsPyodideLoading(false);
    };
    loadPyodide();
  }, []);

  const handleAnalyze = () => {
    // Add more here
  };

  // Function to run the user's code

  const handleRun = async () => {
    if (!pyodide.current) {
      console.error("Pyodide is not loaded yet.");
      return;
    }
    setIsRunning(true);
    setOutput('');
    try {
      // Capture print statements
      pyodide.current.runPython(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `);
      // Run code
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 font-sans">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col w-full md:w-3/5 gap-6">
          <div className="flex-grow h-64 md:h-[340px] lg:h-[400px]">
            <CodeEditor code={code} setCode={setCode} />
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
}