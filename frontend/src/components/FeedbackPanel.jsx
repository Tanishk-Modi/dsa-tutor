import React from 'react';

const FeedbackPanel = ({ feedback, isLoading }) => (
  <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 h-full w-full shadow-lg flex flex-col">
    <h2 className="text-lg font-bold mb-2 text-indigo-400 font-mono tracking-wide">AI Feedback</h2>
    <div className="bg-gray-800 rounded-xl p-4 h-[calc(100%-2rem)] overflow-y-auto flex-grow">
      {isLoading ? (
        <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <span>Analyzing...</span>
        </div>
      ) : (
        <p className="text-gray-200 whitespace-pre-wrap font-mono text-base">{feedback || "Click 'Analyze Code' to get feedback."}</p>
      )}
    </div>
  </div>
);

export default FeedbackPanel;