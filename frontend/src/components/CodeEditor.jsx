import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, onCodeChange }) => {
  function handleEditorChange(value, event) {
    onCodeChange(value);
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden h-full">
      <Editor
        height="100%"
        language="python"
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          
          // --- Aesthetic ---
          fontFamily: "'Fire Code'", 
          fontLigatures: true, 
          cursorStyle: 'line', // 'line', 'block', 'underline'
          renderLineHighlight: 'gutter', // 'none', 'gutter', 'line', 'all'
          smoothScrolling: true,
          padding: {
            top: 16,
            bottom: 16
          },
          
          // --- Functional ---
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          mouseWheelZoom: true,
          formatOnPaste: true,
          formatOnType: true,
          folding: true, 
          minimap: {
            enabled: true 
          }
        }}
      />
    </div>
  );
};

export default CodeEditor;