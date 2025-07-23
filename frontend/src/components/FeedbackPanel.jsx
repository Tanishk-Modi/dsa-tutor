import React from 'react';

const FeedbackPanel = ({ feedback, isLoading }) => (
  <div className="bg-gray-900 h-full w-full rounded-lg p-4 text-white">
    <h2 className="text-lg font-semibold mb-2 text-gray-400">AI Feedback</h2>
    <div className="bg-gray-800 rounded-md p-4 h-[calc(100%-2rem)] overflow-y-auto">
      {isLoading ? (
        <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <span>Analyzing...</span>
        </div>
      ) : (
        <p className="text-gray-300 whitespace-pre-wrap font-mono text-sm">{feedback || "Click 'Analyze Code' to get feedback."}</p>
      )}
    </div>
  </div>
);

export default FeedbackPanel;