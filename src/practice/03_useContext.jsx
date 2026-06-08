/**
 * PRACTICE: useContext + createContext
 *
 * Interview topics covered:
 *  - Why context exists (prop drilling problem)
 *  - createContext / Provider / useContext
 *  - Providing a default value
 *  - Common patterns: theme, auth, language
 */

import { createContext, useContext, useState } from "react";

// ─── 1. Theme Context ─────────────────────────────────────────────────────────

// Step 1: create the context (default value used when there is no Provider above)
const ThemeContext = createContext("light");

// Step 2: custom hook — best practice, keeps consumers clean
export function useTheme() {
  return useContext(ThemeContext);
}

// Step 3: provider component that owns the state
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  // Provide BOTH the value and the setter so consumers can act on it
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Step 4: deeply nested consumer — no props needed!
function ThemedCard() {
  const { theme, toggle } = useTheme();

  const styles = {
    background: theme === "dark" ? "#333" : "#f5f5f5",
    color:      theme === "dark" ? "#fff" : "#111",
    padding: 20,
    borderRadius: 8,
  };

  return (
    <div style={styles}>
      <p>Current theme: <strong>{theme}</strong></p>
      <button onClick={toggle}>Toggle theme</button>
    </div>
  );
}

// ─── 2. Auth Context ──────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login  = (name) => setUser({ name });
  const logout = ()      => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ padding: "8px 16px", background: "#0070f3", color: "#fff" }}>
      {user ? (
        <>
          <span>Welcome, {user.name}!</span>
          <button onClick={logout} style={{ marginLeft: 12 }}>Logout</button>
        </>
      ) : (
        <span>You are not logged in.</span>
      )}
    </nav>
  );
}

function LoginPage() {
  const { login } = useAuth();
  return (
    <div style={{ padding: 16 }}>
      <p>Not logged in.</p>
      <button onClick={() => login("Alice")}>Login as Alice</button>
    </div>
  );
}

function AuthDemo() {
  const { user } = useAuth();
  return (
    <div>
      <Navbar />
      {!user && <LoginPage />}
    </div>
  );
}

// ─── Default export ───────────────────────────────────────────────────────────
export default function UseContextPractice() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>useContext Practice</h1>
      <hr />
      <h2>Theme Context</h2>
      <ThemeProvider>
        <ThemedCard />
      </ThemeProvider>
      <hr />
      <h2>Auth Context</h2>
      <AuthProvider>
        <AuthDemo />
      </AuthProvider>
    </div>
  );
}
