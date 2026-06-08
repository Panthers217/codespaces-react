/**
 * PRACTICE: useMemo & useCallback
 *
 * Interview topics covered:
 *  - useMemo   → memoize an expensive COMPUTED VALUE
 *  - useCallback → memoize a FUNCTION reference
 *  - When to use them (and when NOT to — premature optimisation)
 *  - Preventing unnecessary child re-renders with React.memo + useCallback
 */

import { useState, useMemo, useCallback, memo } from "react";

// ─── Helper: simulate an expensive calculation ────────────────────────────────
function expensiveCalc(n) {
  console.log("Running expensive calculation…");
  let total = 0;
  for (let i = 0; i <= n; i++) total += i;
  return total;
}

// ─── 1. useMemo ──────────────────────────────────────────────────────────────
// Without useMemo, expensiveCalc() would re-run on EVERY render — even when
// `theme` changes and `number` stays the same.
export function MemoDemo() {
  const [number, setNumber] = useState(10);
  const [theme,  setTheme]  = useState("light");

  // Only recalculates when `number` changes
  const result = useMemo(() => expensiveCalc(number), [number]);

  return (
    <div style={{ background: theme === "dark" ? "#333" : "#fff", color: theme === "dark" ? "#fff" : "#000", padding: 16 }}>
      <h2>useMemo</h2>
      <p>Sum 0…{number} = <strong>{result}</strong></p>
      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(Number(e.target.value))}
      />
      <button onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
        Toggle theme (no recalc)
      </button>
    </div>
  );
}

// ─── 2. useCallback ──────────────────────────────────────────────────────────
// Every render creates a NEW function reference.
// Child wrapped in React.memo would still re-render because the prop (fn) changed.
// useCallback returns the SAME function reference unless deps change.

// Child component — memoized so it only re-renders when its props actually change
const Button = memo(function Button({ onClick, label }) {
  console.log(`<Button label="${label}"> rendered`);
  return <button onClick={onClick}>{label}</button>;
});

export function CallbackDemo() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  // This callback is stable — Button1 won't re-render when count2 changes
  const increment1 = useCallback(() => setCount1((c) => c + 1), []);
  const increment2 = useCallback(() => setCount2((c) => c + 1), []);

  return (
    <div>
      <h2>useCallback + React.memo</h2>
      <p>Counter 1: {count1}</p>
      <p>Counter 2: {count2}</p>
      {/* Open the console — only the clicked button re-renders */}
      <Button onClick={increment1} label="Increment 1" />
      <Button onClick={increment2} label="Increment 2" />
    </div>
  );
}

// ─── 3. useMemo for a derived list (filter + sort) ───────────────────────────
const NAMES = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"];

export function FilteredList() {
  const [query,  setQuery]  = useState("");
  const [sortAZ, setSortAZ] = useState(true);
  const [tick,   setTick]   = useState(0); // unrelated state to demo memoisation

  const filtered = useMemo(() => {
    console.log("Filtering/sorting…");
    const result = NAMES.filter((n) => n.toLowerCase().includes(query.toLowerCase()));
    return sortAZ ? [...result].sort() : [...result].sort().reverse();
  }, [query, sortAZ]); // does NOT recompute when `tick` changes

  return (
    <div>
      <h2>Filtered & sorted list (useMemo)</h2>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter names…" />
      <button onClick={() => setSortAZ((v) => !v)}>Sort: {sortAZ ? "A→Z" : "Z→A"}</button>
      <button onClick={() => setTick((t) => t + 1)}>Unrelated re-render ({tick})</button>
      <ul>
        {filtered.map((name) => <li key={name}>{name}</li>)}
      </ul>
    </div>
  );
}

// ─── Default export ───────────────────────────────────────────────────────────
export default function MemoCallbackPractice() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>useMemo &amp; useCallback Practice</h1>
      <hr />
      <MemoDemo />
      <hr />
      <CallbackDemo />
      <hr />
      <FilteredList />
    </div>
  );
}
