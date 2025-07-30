import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import './prism-custom.css';
import CodeEditor from './components/Editor';
import OutputPanel from './components/OutputPanel';
import Navbar from './components/Navbar';

const DEFAULT_CODE = `// Welcome to JS Playground!
// Write JavaScript code and see results in real time.

function greet(name) {
  return 'Hello, ' + name + '!';
}

const output = greet('world');
console.log(output);
document.body.innerHTML = "<h2 style='color: #1976d2'>" + output + "</h2>";
`;

const createRunnerHtml = code => `
<!doctype html>
<html>
  <body></body>
  <script>
    // Hook for capturing logs/errors
    (() => {
      var logs = [], _log = console.log, _err = console.error;
      function send(type, text) {
        try { parent.postMessage({type: type, text: text}, '*'); } catch(e){}
      }
      console.log = function(...args) {
        _log.apply(console, args);
        send('log', args.join(' '));
      };
      console.error = function(...args) {
        _err.apply(console, args);
        send('error', args.join(' '));
      };
      window.onerror = function(msg, src, line, col, err) {
        send('error', msg + ' @ Line: ' + line);
      };
    })();
    try {
      ${code}
    } catch(e) {
      console.error(e.message);
    }
  </script>
</html>
`;

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [code, setCode] = useState(() =>
    decodeURIComponent(window.location.hash.replace(/^#/, '')) || DEFAULT_CODE
  );
  const [runnerHtml, setRunnerHtml] = useState('');
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const iframeRef = useRef();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Update iframe runner on code change (debounced for performance)
  useEffect(() => {
    setRunnerHtml(createRunnerHtml(code));
    setError('');
    setLogs([]);
    // eslint-disable-next-line
  }, [code]);

  // Listen for logs/errors from iframe
  useEffect(() => {
    function onMsg(e) {
      if (!e.data) return;
      if (e.data.type === 'log')
        setLogs(prev => [...prev, { text: e.data.text }]);
      if (e.data.type === 'error')
        setLogs(prev => [...prev, { text: e.data.text, error: true }]);
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  // Snippet sharing
  const handleShare = () => {
    const hash = encodeURIComponent(code);
    window.location.hash = hash;
    if (navigator.clipboard)
      navigator.clipboard.writeText(window.location.href);
    alert("URL copied to clipboard! Share this link.");
  };

  // Clear console logs
  const handleClearConsole = useCallback(() => {
    setLogs([]);
    setError('');
  }, []);

  // Keyboard shortcut for running code: Ctrl+Enter
  useEffect(() => {
    const runOnCtrlEnter = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        setRunnerHtml(createRunnerHtml(code));
        setError('');
        setLogs([]);
      }
    };
    window.addEventListener('keydown', runOnCtrlEnter);
    return () => window.removeEventListener('keydown', runOnCtrlEnter);
  }, [code]);

  return (
    <div className="App" style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
        onShare={handleShare}
      />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        height: 'calc(100vh - 62px)',
        minHeight: 400,
      }}>
        {/* Editor Pane */}
        <div style={{
          width: '50%',
          minWidth: 300,
          borderRight: '2px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-primary)'
          }}>
            <strong style={{ color: "#1976d2", fontSize: 17 }}>Editor</strong>
            <span style={{ fontSize: 12, marginLeft: 13, color: '#888' }}>JS / HTML playground</span>
          </div>
          <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
            <CodeEditor code={code} onChange={setCode} theme={theme} />
          </div>
        </div>
        {/* Output Pane */}
        <div style={{ width: '50%', minWidth: 300, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
          <OutputPanel
            result={runnerHtml}
            logs={logs}
            error={error}
            onClearConsole={handleClearConsole}
          />
        </div>
      </div>
      {/* Footer hint for keyboard shortcut */}
      <footer style={{ width: '100%', padding: '0.5rem', textAlign: "center", color: "#424242AA", fontSize: 13 }}>
        Press <b>Ctrl+Enter</b> to re-run code ·{' '}
        <span style={{ color: "#1976d2" }}>Modern JS Playground &copy; 2024</span>
      </footer>
    </div>
  );
}

export default App;
