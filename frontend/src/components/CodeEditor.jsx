import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, setCode }) => {
  function handleEditorChange(value, event) {
    setCode(value);
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden h-full shadow-lg">
      <Editor
        height="100%"
        language="python"
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        options={{
          fontSize: 15,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          fontFamily: 'Fira Mono, Menlo, monospace',
          lineNumbers: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor;