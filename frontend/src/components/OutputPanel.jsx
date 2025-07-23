import React from 'react';

const OutputPanel = ({ output, isRunning }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full text-white font-mono text-sm">
      <h3 className="text-lg font-sans font-semibold mb-2 text-gray-400">Output</h3>
      <pre className="whitespace-pre-wrap overflow-y-auto h-[calc(100%-2rem)]">
        {isRunning ? (
          <span className="text-gray-500">Running...</span>
        ) : (
          output || <span className="text-gray-500">Click "Run" to see code output.</span>
        )}
      </pre>
    </div>
  );
};

export default OutputPanel;