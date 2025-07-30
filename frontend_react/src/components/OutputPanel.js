import React, { useRef, useEffect } from 'react';

// PUBLIC_INTERFACE
const OutputPanel = ({ result, logs, error, onClearConsole }) => {
  const logEndRef = useRef();

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, error]);

  return (
    <div style={{
      height: "100%",
      background: "var(--bg-primary)",
      color: "var(--text-primary)",
      display: "flex",
      flexDirection: "column",
      borderLeft: '1px solid var(--border-color)'
    }}>
      <div style={{
        padding: "1rem 1.5rem",
        borderBottom: `1px solid var(--border-color)`,
        background: "var(--bg-secondary)"
      }}>
        <strong style={{ fontSize: 17, color: "#1976d2" }}>Output</strong>
      </div>
      <div style={{ flex: 2, overflow: "auto", padding: "1rem" }}>
        <iframe
          title="output"
          sandbox="allow-scripts"
          style={{
            width: '100%',
            height: 140,
            border: '1.5px solid var(--border-color)',
            borderRadius: 6,
            background: "#fafafe",
            marginBottom: 16
          }}
          srcDoc={result}
        />
        <div
          style={{
            marginBottom: 10,
            fontWeight: 600,
            color: "#424242",
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
        >
          Console
          <button
            onClick={onClearConsole}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#424242',
              cursor: 'pointer',
              fontSize: 13,
              padding: '2px 7px',
              borderRadius: 4
            }}
            title="Clear Console"
          >
            🧹
          </button>
        </div>
        <div
          style={{
            minHeight: 70,
            maxHeight: 220,
            overflow: "auto",
            background: "#1112",
            borderRadius: 4,
            padding: '0.7em 1em',
            fontFamily: 'monospace',
            fontSize: 13,
            color: error ? "#c62828" : "#111"
          }}
          data-testid="console-output"
        >
          {logs.map((log, idx) => (
            <div key={idx} style={{ color: !!log.error ? "#c62828" : "#333" }}>
              {log.text}
            </div>
          ))}
          {!!error && <div style={{ color: "#c62828" }}>{error}</div>}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};

export default OutputPanel;
