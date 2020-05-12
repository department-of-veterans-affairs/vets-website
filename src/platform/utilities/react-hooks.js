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
 */
export const usePrevious = value => {
  const valueRef = useRef();
  useEffect(
    () => {
      valueRef.current = value;
    },
    // only run this useEffect hook if `value` changes
    [value],
  );
  // this returns _before_ the `useEffect` call completes, so this will return
  // whatever was stored in `ref.current` _before_ this function's `useEffect`
  // callback runs
  return valueRef.current;
};
