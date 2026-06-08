/**
 * React Interview Practice — entry point
 *
 * All practice files live in  src/practice/
 * Open src/practice/index.jsx and uncomment the topic you want to study.
 * Then render <PracticeHub /> from App.jsx to see it in the browser.
 *
 * Topics:
 *  01 useState            — state primitives, objects, arrays
 *  02 useEffect           — side effects, cleanup, data fetching
 *  03 useContext          — context API, theme & auth patterns
 *  04 useRef              — DOM refs, mutable values, previous state
 *  05 useMemo/useCallback — memoisation, React.memo
 *  06 useReducer          — reducer pattern, complex state
 *  07 Custom Hooks        — useFetch, useDebounce, useLocalStorage, useToggle
 *  08 Component Patterns  — conditional rendering, lists, lifting state,
 *                           composition, error boundaries
 */
export function practice(name = "there") {
  return `Hello, ${name}! Let's ace that React interview.`;
}
