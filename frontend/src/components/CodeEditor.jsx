import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, setCode }) => {
  function handleEditorChange(value, event) {
    setCode(value);
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
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor;