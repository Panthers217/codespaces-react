/**
 * PRACTICE: Custom Hooks
 *
 * Interview topics covered:
 *  - What is a custom hook? (function starting with "use" that calls React hooks)
 *  - Why: reuse stateful logic across components without changing component tree
 *  - Common real-world custom hooks: useFetch, useLocalStorage, useToggle, useDebounce
 */

import { useState, useEffect, useCallback, useRef } from "react";

// ─── 1. useToggle ─────────────────────────────────────────────────────────────
export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

function ToggleDemo() {
  const [isOpen, toggleOpen] = useToggle(false);
  return (
    <div>
      <button onClick={toggleOpen}>{isOpen ? "Close" : "Open"} menu</button>
      {isOpen && <p>🍔 Menu is open!</p>}
    </div>
  );
}

// ─── 2. useLocalStorage ──────────────────────────────────────────────────────
// Syncs state with localStorage — survives page refresh.
export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(stored) : value;
        setStored(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.error(err);
      }
    },
    [key, stored]
  );

  return [stored, setValue];
}

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage("practice_name", "");
  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type your name (persists on refresh)"
      />
      <p>Stored name: <strong>{name || "—"}</strong></p>
    </div>
  );
}

// ─── 3. useDebounce ──────────────────────────────────────────────────────────
// Delays updating a value until the user stops typing for `delay` ms.
// Classic use-case: search input → avoid firing an API call on every keystroke.
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cancel if value changes before delay
  }, [value, delay]);

  return debounced;
}

function DebounceDemo() {
  const [input, setInput]   = useState("");
  const debounced           = useDebounce(input, 500);

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type fast — debounced below"
      />
      <p>Debounced (500ms): <strong>{debounced}</strong></p>
    </div>
  );
}

// ─── 4. useFetch ─────────────────────────────────────────────────────────────
// Generic data-fetching hook. Returns { data, loading, error }.
export function useFetch(url) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!url) return;
    let ignore = false;

    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => { if (!ignore) setData(json); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [url]);

  return { data, loading, error };
}

function FetchDemo() {
  const [id, setId] = useState(1);
  const { data, loading, error } = useFetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );

  return (
    <div>
      <label>Post ID: </label>
      <input type="number" value={id} min={1} max={100} onChange={(e) => setId(e.target.value)} />
      {loading && <p>Loading…</p>}
      {error   && <p style={{ color: "red" }}>Error: {error}</p>}
      {data    && <pre style={{ background: "#f0f0f0", padding: 8 }}>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

// ─── 5. usePrevious ──────────────────────────────────────────────────────────
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}

// ─── Default export ───────────────────────────────────────────────────────────
export default function CustomHooksPractice() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Custom Hooks Practice</h1>
      <hr />
      <h2>useToggle</h2>
      <ToggleDemo />
      <hr />
      <h2>useLocalStorage</h2>
      <LocalStorageDemo />
      <hr />
      <h2>useDebounce</h2>
      <DebounceDemo />
      <hr />
      <h2>useFetch</h2>
      <FetchDemo />
    </div>
  );
}
