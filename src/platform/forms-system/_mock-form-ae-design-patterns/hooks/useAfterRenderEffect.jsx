import { useEffect, useRef } from 'react';

const useAfterRenderEffect = (func, deps = []) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useAfterRenderEffect;
