import { useEffect } from 'react';
import useFirstMountState from './useFirstMountState';

const useUpdateEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
    return null;
  }, deps);
};

export default useUpdateEffect;
