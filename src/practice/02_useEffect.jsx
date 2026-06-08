/**
 * PRACTICE: useEffect
 *
 * Interview topics covered:
 *  - Effect with no dependency array   → runs after every render
 *  - Effect with []                    → runs once (componentDidMount equivalent)
 *  - Effect with [deps]                → runs when deps change
 *  - Cleanup function                  → componentWillUnmount equivalent
 *  - Fetching data inside useEffect
 *  - Avoiding the "stale closure" trap
 */

import { useState, useEffect } from "react";

// ─── 1. Document title synced to state ───────────────────────────────────────
// dep array = [count] → effect runs only when count changes
export function TitleUpdater() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]); // ← dependency array

  return (
    <div>
      <p>Count: {count} (check the browser tab title)</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}

// ─── 2. Cleanup — interval timer ─────────────────────────────────────────────
// The returned function is the *cleanup*. React calls it before the next effect
// run AND when the component unmounts. Forgetting cleanup → memory leak.
export function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((prev) => prev + 1); // functional updater avoids stale closure
    }, 1000);

    return () => clearInterval(id); // ← CLEANUP
  }, []); // empty array → set up once, tear down on unmount

  return <p>Elapsed: {seconds}s</p>;
}

// ─── 3. Cleanup — event listener ─────────────────────────────────────────────
export function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler); // cleanup
  }, []);

  return <p>Window width: {width}px</p>;
}

// ─── 4. Data fetching ────────────────────────────────────────────────────────
// Key interview points:
//   • useEffect cannot be async directly — wrap in an inner async fn
//   • Use an `ignore` flag or AbortController to handle race conditions
export function UserFetcher() {
  const [userId, setUserId]   = useState(1);
  const [user,   setUser]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let ignore = false; // prevents setting state on an unmounted component

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res  = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const data = await res.json();
        if (!ignore) setUser(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchUser();
    return () => { ignore = true; }; // cleanup: ignore stale responses
  }, [userId]); // re-fetch when userId changes

  return (
    <div>
      <label>
        User ID:{" "}
        <input
          type="number"
          value={userId}
          min={1}
          max={10}
          onChange={(e) => setUserId(Number(e.target.value))}
        />
      </label>
      {loading && <p>Loading…</p>}
      {error   && <p style={{ color: "red" }}>Error: {error}</p>}
      {user    && <pre>{JSON.stringify(user, null, 2)}</pre>}
    </div>
  );
}

// ─── Default export ───────────────────────────────────────────────────────────
export default function UseEffectPractice() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>useEffect Practice</h1>
      <hr />
      <TitleUpdater />
      <hr />
      <Timer />
      <hr />
      <WindowWidth />
      <hr />
      <UserFetcher />
    </div>
  );
}
