import { useEffect, useRef } from 'react';

/**
 * While not included with React, this hook is described in the React Hooks
 * documentation:
 * https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 *
 * as well as on usehooks.com:
 * https://usehooks.com/usePrevious/
 *
 * This post does a deeper dive for those who are new to hooks:
 * https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/
 *
 * @param {*} nextValue - The value to return the next time this hook is run
 * @returns {*} - The value that was passed to this hook the previous time that
 * it was run. Or `undefined` if the hook is being run for the first time.
 */
export const usePrevious = nextValue => {
  const previousValue = useRef();
  useEffect(
    () => {
      previousValue.current = nextValue;
    },
    // only run this useEffect hook if `nextValue` changes
    [nextValue],
  );
  // This returns _before_ the `useEffect` call completes, so this will return
  // whatever was stored in `previousValue.current` _before_ this function's
  // `useEffect` callback runs
  return previousValue.current;
};
