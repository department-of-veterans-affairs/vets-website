import { useEffect } from 'react';

export const useCustomEventHandler = (ref, eventName, handler) => {
  useEffect(() => {
    const el = ref.current;
    el.addEventListener(eventName, handler);
    return () => el.removeEventListener(eventName, handler);
  }, [ref, eventName, handler]);
};
