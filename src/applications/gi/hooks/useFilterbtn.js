import { useEffect, useRef, useState } from 'react';
import { isProductionOrTestProdEnv } from '../utils/helpers';

export const useFilterBtn = (afterResults = false) => {
  const [isCleared, setIsCleared] = useState(false);
  const [loading, setIsloading] = useState(false);
  const inputRef = useRef({});
  useEffect(
    () => {
      let timer;

      const setLoadingAndFocus = ref => {
        setIsloading(true);
        timer = setTimeout(() => {
          setIsloading(false);
          ref.focus();
        }, 2600);
      };
      if (isCleared && !afterResults && inputRef.current.Public) {
        setLoadingAndFocus(inputRef.current.Public);
      }

      if (
        isCleared &&
        afterResults &&
        isProductionOrTestProdEnv() &&
        inputRef.current.Schools
      ) {
        setLoadingAndFocus(inputRef.current.Schools);
      }
      return () => clearTimeout(timer);
    },
    [isCleared, afterResults],
  );
  const focusOnFirstInput = (id, el) => {
    inputRef.current[id] = el;
  };
  return { focusOnFirstInput, isCleared, setIsCleared, loading };
};
