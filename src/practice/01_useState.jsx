/**
 * PRACTICE: useState
 *
 * Interview topics covered:
 *  - Basic state (counter, toggle)
 *  - State with objects / arrays
 *  - Why you must NOT mutate state directly
 *  - Functional updater form  (prev => ...)
 */

import { useState } from "react";

// ─── 1. Counter ──────────────────────────────────────────────────────────────
export function Counter() {
  const [count, setCount] = useState(0);

  // Functional updater guarantees you're working off the latest value.
  // Always prefer this when the new state depends on the old one.
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(0);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
      <button onClick={increment}>+</button>
    </div>
  );
}

// ─── 2. Toggle ───────────────────────────────────────────────────────────────
export function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div>
      <p>The light is {isOn ? "ON 💡" : "OFF 🌑"}</p>
      <button onClick={() => setIsOn((prev) => !prev)}>Toggle</button>
    </div>
  );
}

// ─── 3. Controlled form input ────────────────────────────────────────────────
// "Controlled component" = React state is the single source of truth for the input value.
export function ControlledInput() {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something…"
      />
      <p>You typed: {text}</p>
      <button onClick={() => setText("")}>Clear</button>
    </div>
  );
}

// ─── 4. State with an object ─────────────────────────────────────────────────
// RULE: always spread the previous object so you don't lose other fields.
export function UserForm() {
  const [user, setUser] = useState({ name: "", age: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value })); // computed property key
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input name="name" value={user.name} onChange={handleChange} placeholder="Name" />
      <input name="age"  value={user.age}  onChange={handleChange} placeholder="Age" />
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </form>
  );
}

// ─── 5. State with an array ──────────────────────────────────────────────────
// Never push/splice the array directly — create a new one.
export function TodoList() {
  const [todos, setTodos] = useState(["Buy groceries", "Walk the dog"]);
  const [input, setInput]   = useState("");

  const add    = () => {
    if (!input.trim()) return;
    setTodos((prev) => [...prev, input.trim()]);
    setInput("");
  };

  const remove = (index) =>
    setTodos((prev) => prev.filter((_, i) => i !== index));

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="New todo" />
      <button onClick={add}>Add</button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {todo} <button onClick={() => remove(i)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Default export: all examples on one page ────────────────────────────────
export default function UseStatePractice() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>useState Practice</h1>
      <hr />
      <Counter />
      <hr />
      <Toggle />
      <hr />
      <ControlledInput />
      <hr />
      <UserForm />
      <hr />
      <TodoList />
    </div>
  );
}
