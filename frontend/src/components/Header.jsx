import React from 'react';

const Header = () => (
  <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-4 md:px-8 shadow-lg z-20">
    <div className="max-w-7xl mx-auto flex justify-center items-center">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-mono flex items-center gap-3">
        <span className="inline-block w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-lg font-bold shadow-md">AI</span>
        DSA Tutor
      </h1>
    </div>
  </header>
);

export default Header;