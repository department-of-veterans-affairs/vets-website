import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

/**
 * Hook to handle incremental reveal of items with focus management
 * @param {Array} allItems - The full list of items to display
 * @param {number} initialCount - Initial number of items to show (default: 5)
 * @param {number} incrementSize - Number of items to show on each "show more" click (default: 5)
 * @returns {Object} - Object containing currentPageItems, remainingItems, shouldShowButton, nextBatchSize, onShowMoreClicked, and headingRefs
 */
export const useIncrementalReveal = (
  allItems,
  initialCount = 5,
  incrementSize = 5,
) => {
  const [itemsToShow, setItemsToShow] = useState(initialCount);
  const [focusIndex, setFocusIndex] = useState(null);
  const headingRefs = useRef({});

  const currentPageItems = useMemo(() => allItems.slice(0, itemsToShow), [
    allItems,
    itemsToShow,
  ]);

  const remainingItems = allItems.length - itemsToShow;
  const shouldShowButton = remainingItems > 0;
  const nextBatchSize = Math.min(remainingItems, incrementSize);

  const onShowMoreClicked = useCallback(
    () => {
      setItemsToShow(prevCount => {
        const newCount =
          prevCount + Math.min(allItems.length - prevCount, incrementSize);
        setFocusIndex(prevCount);
        return newCount;
      });
    },
    [allItems.length, incrementSize],
  );

  useEffect(
    () => {
      if (focusIndex !== null && headingRefs.current[focusIndex]) {
        headingRefs.current[focusIndex].focus();
        setFocusIndex(null);
      }
    },
    [focusIndex, currentPageItems.length],
  );

  return {
    currentPageItems,
    remainingItems,
    shouldShowButton,
    nextBatchSize,
    onShowMoreClicked,
    headingRefs,
  };
};
