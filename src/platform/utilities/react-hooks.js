import { useEffect, useRef, useState } from 'react';
import localStorage from 'platform/utilities/storage/localStorage';

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

/**
 * This hook is meant to be used in non-authenticated parts of the site for staggered release of new features.
 * As a flipper cannot be used in such environments, this will allow a specified percentage of users the new feature.
 * It will persist this determination in localStorage for repeat visits.
 *
 * @param {number} displayThreshold - the percentage of visitors to offer the new feature to.
 * @param {string} storageKey - the string name of the localStorage key
 * @returns {boolean} - Whether to include a visitor in participation in a new feature, based on
 * percentage of visitors or previously persisted determination
 * */
export const useStaggeredFeatureRelease = (displayThreshold, storageKey) => {
  const [restriction, setRestriction] = useState(null);

  useEffect(() => {
    let restrictVar = localStorage.getItem(storageKey);
    if (!restrictVar) {
      restrictVar = Math.random().toFixed(2) * 100;
      localStorage.setItem(storageKey, restrictVar.toString());
    }
    setRestriction(restrictVar);
  }, [storageKey]);

  return Number.parseInt(restriction, 10) <= displayThreshold;
};
