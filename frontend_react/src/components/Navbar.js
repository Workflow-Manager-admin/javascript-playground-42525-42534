import React from 'react';

// PUBLIC_INTERFACE
const Navbar = ({ theme, onToggleTheme, onShare }) => {
  return (
    <nav
      style={{
        width: "100%",
        background: "var(--bg-secondary)",
        padding: "0.75rem 2rem",
        borderBottom: `2px solid var(--border-color)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 62,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
      data-testid="navbar"
    >
      <div style={{ fontWeight: 700, fontSize: 22, color: "#1976d2", letterSpacing: 1.2 }}>
        <span>JS Playground</span>
      </div>
      <div>
        <button
          className="btn btn-accent"
          style={{
            marginRight: 16,
            backgroundColor: "var(--accent)",
            color: "#222",
            border: "none",
            borderRadius: 7,
            padding: "0.4em 1.2em",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={onShare}
          title="Share Code Snippet"
        >
          Share
        </button>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{
            background: "var(--button-bg)",
            color: "var(--button-text)",
            border: "none",
            borderRadius: 8,
            padding: "0.4em 1.2em",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
