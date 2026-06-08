/**
 * PRACTICE: useRef
 *
 * Interview topics covered:
 *  - Accessing / focusing a DOM element
 *  - Storing a mutable value that does NOT trigger re-render
 *  - Tracking previous state value
 *  - Storing a timer ID (classic cleanup pattern)
 */

import { useState, useEffect, useRef } from "react";

// ─── 1. DOM access — auto-focus an input ─────────────────────────────────────
// ref.current points to the real DOM node after mount
export function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // direct DOM manipulation
  }, []);

  return (
    <div>
      <label>Auto-focused input: </label>
      <input ref={inputRef} placeholder="I'm focused on mount" />
    </div>
  );
}

// ─── 2. Previous value ───────────────────────────────────────────────────────
// Refs persist across renders WITHOUT causing a re-render when changed.
// This lets you "remember" the last value.
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; // runs AFTER the render, so ref holds the previous value
  });
  return ref.current;
}

export function PreviousValue() {
  const [count, setCount] = useState(0);
  const prev = usePrevious(count);

  return (
    <div>
      <p>Current: {count} | Previous: {prev ?? "—"}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}

// ─── 3. Storing a timer ID ───────────────────────────────────────────────────
// If you stored the ID in state, every setInterval/clearInterval would cause
// a re-render. A ref is the right tool here.
export function StopwatchWithRef() {
  const [time,    setTime]    = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef           = useRef(null); // mutable, no re-render on change

  const start = () => {
    if (running) return;
    setRunning(true);
    intervalRef.current = setInterval(() => setTime((t) => t + 1), 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const reset = () => {
    stop();
    setTime(0);
  };

  // Clean up on unmount
  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div>
      <p>Time: {time}s</p>
      <button onClick={start}  disabled={running}>Start</button>
      <button onClick={stop}   disabled={!running}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// ─── 4. Uncontrolled input (reading value on submit) ─────────────────────────
// Contrast with controlled inputs (useState). Sometimes you only need the
// value on submit — useRef avoids re-rendering on every keystroke.
export function UncontrolledForm() {
  const nameRef = useRef(null);
  const [submitted, setSubmitted] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(nameRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="" placeholder="Name (uncontrolled)" />
      <button type="submit">Submit</button>
      {submitted && <p>Submitted: {submitted}</p>}
    </form>
  );
}

// ─── Default export ───────────────────────────────────────────────────────────
export default function UseRefPractice() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>useRef Practice</h1>
      <hr />
      <AutoFocusInput />
      <hr />
      <PreviousValue />
      <hr />
      <StopwatchWithRef />
      <hr />
      <UncontrolledForm />
    </div>
  );
}
