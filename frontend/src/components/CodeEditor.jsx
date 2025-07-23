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
        options={{  }}
      />
    </div>
  );
};

export default CodeEditor;