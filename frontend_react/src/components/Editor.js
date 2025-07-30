import React, { forwardRef } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript.min.js';
import 'prismjs/themes/prism.css';

// PUBLIC_INTERFACE
const CodeEditor = forwardRef(({ code, onChange, theme }, ref) => {
  return (
    <div style={{ height: "100%", background: theme === "dark" ? "#282c34" : "#fbfbfb", borderRight: '1px solid var(--border-color)' }}>
      <Editor
        value={code}
        onValueChange={onChange}
        highlight={code =>
          Prism.highlight(code, Prism.languages.javascript, "javascript")
        }
        padding={16}
        ref={ref}
        style={{
          fontFamily: '"Fira Mono", "Consolas", "Menlo", "monospace"',
          fontSize: 15,
          outline: "none",
          minHeight: '100%',
          color: theme === "dark" ? "#f8f8f2" : "#222",
          background: "transparent",
        }}
      />
    </div>
  );
});

export default CodeEditor;
