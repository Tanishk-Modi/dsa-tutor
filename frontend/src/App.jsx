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

  // Functino to run the user's code

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
    <div className="flex flex-col h-screen bg-gray-900 font-sans">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row gap-4 p-4">
        {/* Left side: Editor, Buttons, and Output */}
        <div className="flex flex-col w-full md:w-3/5 gap-4">
          <div className="flex-grow h-3/5">
            <CodeEditor code={code} setCode={setCode} />
          </div>
          <div className="flex items-stretch gap-4">
            <button
              onClick={handleRun}
              disabled={isRunning || isPyodideLoading}
              className="w-1/2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              {isPyodideLoading ? 'Loading Engine...' : (isRunning ? 'Running...' : 'Run Code')}
            </button>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-1/2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
            </button>
          </div>
          <div className="h-2/5">
            <OutputPanel output={output} isRunning={isRunning} />
          </div>
        </div>

        {/* Right side: Feedback Panel */}
        <div className="w-full md:w-2/5">
          <FeedbackPanel feedback={feedback} isLoading={isAnalyzing} />
        </div>
      </main>
    </div>
  );
}