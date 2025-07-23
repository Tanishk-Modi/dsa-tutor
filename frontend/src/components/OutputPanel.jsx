import React from 'react';

const OutputPanel = ({ output, isRunning }) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 h-full text-gray-100 font-mono text-base shadow-lg flex flex-col">
      <h3 className="text-lg font-bold mb-2 text-indigo-400 font-mono tracking-wide">Output</h3>
      <pre className="whitespace-pre-wrap overflow-y-auto flex-grow text-gray-300">
        {isRunning ? (
          <span className="text-gray-500">Running...</span>
        ) : (
          output || <span className="text-gray-600">Click "Run" to see code output.</span>
        )}
      </pre>
    </div>
  );
};

export default OutputPanel;