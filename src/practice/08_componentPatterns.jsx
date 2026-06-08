/**
 * PRACTICE: Component Patterns & React Essentials
 *
 * Interview topics covered:
 *  - Conditional rendering (&&, ternary, early return)
 *  - Lists & keys (why keys matter)
 *  - Lifting state up
 *  - Controlled vs uncontrolled components
 *  - Composition with children prop
 *  - Prop spreading & forwarding
 *  - Error boundaries (class component — still tested!)
 */

import { useState, Component } from "react";

// ─── 1. Conditional rendering ────────────────────────────────────────────────
export function ConditionalDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [count,      setCount]      = useState(0);

  return (
    <div>
      <h2>Conditional Rendering</h2>

      {/* Ternary — best when you need either/or */}
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}

      {/* && short-circuit — best for "show only if true" */}
      {count > 0 && <p>You clicked {count} times.</p>}

      {/* Avoid: 0 && ... renders "0" — use count > 0 not count */}

      <button onClick={() => setIsLoggedIn((v) => !v)}>
        {isLoggedIn ? "Logout" : "Login"}
      </button>
      <button onClick={() => setCount((c) => c + 1)}>Click me ({count})</button>
    </div>
  );
}

// ─── 2. Lists & keys ────────────────────────────────────────────────────────
// Keys must be STABLE, UNIQUE among siblings, and NOT the array index
// (index is ok only for static lists that will never reorder/filter).
const FRUITS = [
  { id: "a1", name: "Apple",  emoji: "🍎" },
  { id: "b2", name: "Banana", emoji: "🍌" },
  { id: "c3", name: "Cherry", emoji: "🍒" },
];

export function FruitList() {
  const [fruits, setFruits] = useState(FRUITS);

  const shuffle = () =>
    setFruits((prev) => [...prev].sort(() => Math.random() - 0.5));

  return (
    <div>
      <h2>Lists & Keys</h2>
      <ul>
        {fruits.map((fruit) => (
          <li key={fruit.id}> {/* stable id — NOT index */}
            {fruit.emoji} {fruit.name}
          </li>
        ))}
      </ul>
      <button onClick={shuffle}>Shuffle</button>
    </div>
  );
}

// ─── 3. Lifting state up ─────────────────────────────────────────────────────
// When two siblings need to share state, move state to their common parent.
function TemperatureInput({ scale, value, onChange }) {
  return (
    <label>
      {scale === "C" ? "Celsius" : "Fahrenheit"}:{" "}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function TemperatureConverter() {
  const [celsius, setCelsius] = useState("");

  const fahrenheit = celsius !== "" ? (celsius * 9) / 5 + 32 : "";

  const handleCelsiusChange    = (val) => setCelsius(val);
  const handleFahrenheitChange = (val) =>
    setCelsius(val !== "" ? ((val - 32) * 5) / 9 : "");

  return (
    <div>
      <h2>Lifting State Up</h2>
      <TemperatureInput scale="C" value={celsius}     onChange={handleCelsiusChange} />
      <br />
      <TemperatureInput scale="F" value={fahrenheit}  onChange={handleFahrenheitChange} />
      {celsius !== "" && (
        <p>
          {celsius}°C = {Number(fahrenheit).toFixed(2)}°F
        </p>
      )}
    </div>
  );
}

// ─── 4. Composition — children prop ──────────────────────────────────────────
// Prefer composition over deeply nesting props (avoids prop drilling).
function Card({ title, children }) {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 16, margin: 8 }}>
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      {children}
    </div>
  );
}

export function CompositionDemo() {
  return (
    <div>
      <h2>Composition & children</h2>
      <Card title="Card A">
        <p>Any content goes here — buttons, forms, other components.</p>
        <button>Click me</button>
      </Card>
      <Card title="Card B">
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </Card>
    </div>
  );
}

// ─── 5. Error Boundary (class component) ─────────────────────────────────────
// As of React 19 there's still no hook equivalent — class is required.
// Interviewers often ask "how do you handle render errors?"
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error, info) {
    console.error("Caught by ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "red", border: "1px solid red", padding: 8 }}>
          <strong>Something went wrong:</strong> {this.state.message}
        </div>
      );
    }
    return this.props.children;
  }
}

function BuggyComponent({ shouldThrow }) {
  if (shouldThrow) throw new Error("💥 I crashed!");
  return <p>I am healthy ✅</p>;
}

export function ErrorBoundaryDemo() {
  const [crash, setCrash] = useState(false);
  return (
    <div>
      <h2>Error Boundary</h2>
      <ErrorBoundary>
        <BuggyComponent shouldThrow={crash} />
      </ErrorBoundary>
      {/* Note: button is OUTSIDE the boundary so it still works after crash */}
      <button onClick={() => setCrash((v) => !v)}>
        {crash ? "Reset" : "Trigger crash"}
      </button>
    </div>
  );
}

// ─── Default export ───────────────────────────────────────────────────────────
export default function PatternsPractice() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>Component Patterns & Essentials</h1>
      <hr />
      <ConditionalDemo />
      <hr />
      <FruitList />
      <hr />
      <TemperatureConverter />
      <hr />
      <CompositionDemo />
      <hr />
      <ErrorBoundaryDemo />
    </div>
  );
}
