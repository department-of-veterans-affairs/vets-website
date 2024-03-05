import { useEffect, useRef, useState } from 'react';
import { isProductionOfTestProdEnv } from '../utils/helpers';

export const useFilterBtn = (afterResults = false) => {
  const [isCleared, setIsCleared] = useState(false);
  const inputRef = useRef({});
  useEffect(
    () => {
      let timer;
      if (isCleared && inputRef.current.Public && !afterResults) {
        timer = setTimeout(() => {
          inputRef.current.Public?.focus();
        }, 1500);
      }
      if (
        isCleared &&
        afterResults &&
        !isProductionOfTestProdEnv() &&
        inputRef.current.Schools
      ) {
        timer = setTimeout(() => {
          inputRef.current.Schools.focus();
        }, 1500);
      }
      return () => clearTimeout(timer);
    },
    [isCleared, afterResults],
  );
  const focusOnFirstInput = (id, el) => {
    inputRef.current[id] = el;
  };
  return { focusOnFirstInput, isCleared, setIsCleared };
};
