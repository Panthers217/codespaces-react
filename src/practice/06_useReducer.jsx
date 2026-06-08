/**
 * PRACTICE: useReducer
 *
 * Interview topics covered:
 *  - When to use useReducer vs useState
 *    (complex state logic, multiple sub-values, next state depends on previous)
 *  - Reducer pattern: (state, action) => newState
 *  - Action objects with `type` and optional `payload`
 *  - Initializer function (lazy init)
 */

import { useReducer } from "react";

// ─── 1. Counter (simplest reducer) ───────────────────────────────────────────
const counterReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT": return { count: state.count + 1 };
    case "DECREMENT": return { count: state.count - 1 };
    case "RESET":     return { count: 0 };
    case "SET":       return { count: action.payload };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export function ReducerCounter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <h2>Counter: {state.count}</h2>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "SET", payload: 10 })}>Set to 10</button>
    </div>
  );
}

// ─── 2. Todo list — more realistic multi-action reducer ──────────────────────
const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: Date.now(), text: action.payload, completed: false },
        ],
      };
    case "TOGGLE":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t
        ),
      };
    case "DELETE":
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload),
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

const initialTodoState = {
  todos: [
    { id: 1, text: "Learn useReducer", completed: true },
    { id: 2, text: "Build a project",  completed: false },
  ],
  filter: "all", // "all" | "active" | "completed"
};

// Lazy initializer — receives the initial arg and transforms it.
// Useful for reading from localStorage, expensive init, etc.
function init(initial) {
  return initial; // here it's a no-op, but the pattern is the point
}

export function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState, init);
  const [input, setInput] = useReducer((_, v) => v, ""); // tiny inline reducer trick

  const handleAdd = () => {
    if (!input.trim()) return;
    dispatch({ type: "ADD", payload: input.trim() });
    setInput("");
  };

  const visible = state.todos.filter((t) => {
    if (state.filter === "active")    return !t.completed;
    if (state.filter === "completed") return  t.completed;
    return true;
  });

  return (
    <div>
      <h2>Todo App (useReducer)</h2>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="New task…"
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <div style={{ margin: "8px 0" }}>
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => dispatch({ type: "SET_FILTER", payload: f })}
            style={{ fontWeight: state.filter === f ? "bold" : "normal", marginRight: 4 }}
          >
            {f}
          </button>
        ))}
      </div>

      <ul>
        {visible.map((todo) => (
          <li key={todo.id} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: "TOGGLE", payload: todo.id })}
            />
            {todo.text}
            <button onClick={() => dispatch({ type: "DELETE", payload: todo.id })}>✕</button>
          </li>
        ))}
      </ul>
      <p>{state.todos.filter((t) => !t.completed).length} remaining</p>
    </div>
  );
}

// ─── Default export ───────────────────────────────────────────────────────────
export default function UseReducerPractice() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>useReducer Practice</h1>
      <hr />
      <ReducerCounter />
      <hr />
      <TodoApp />
    </div>
  );
}
