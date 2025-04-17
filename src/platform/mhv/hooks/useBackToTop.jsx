import { useState, useEffect, useRef } from 'react';

export const useBackToTop = location => {
  const [isHidden, setIsHidden] = useState(true);
  const [height, setHeight] = useState(0);
  const measuredRef = useRef();

  const { current } = measuredRef;

  useEffect(() => {
    if (!current) return () => {};

    let isMounted = true;

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        if (isMounted && height !== current.offsetHeight) {
          setHeight(current.offsetHeight);
        }
      });
    });

    resizeObserver.observe(current);

    return () => {
      isMounted = false;
      resizeObserver.disconnect();
    };
  }, [current, height]);

  useEffect(() => {
    if (height) {
      // small screen (mobile)
      if (window.innerWidth <= 481 && height > window.innerHeight * 4) {
        setIsHidden(false);
      }
      // medium screen (desktop/tablet)
      else if (window.innerWidth > 481 && height > window.innerHeight * 2) {
        setIsHidden(false);
      }
      // default to hidden
      else {
        setIsHidden(true);
      }
    }
  }, [height, location]);

  return { isHidden, measuredRef };
};
