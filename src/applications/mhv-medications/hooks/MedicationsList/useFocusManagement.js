import { useEffect, useRef } from 'react';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

/**
 * Manages focus and scroll behavior for the medications list page.
 *
 * Handles three focus scenarios:
 * 1. On initial load: focuses the h1 element, or scrolls to previous position if returning from the prescription details page
 * 2. When filter returns no results: focuses the "no matches" message (#no-matches-msg)
 * 3. After filtering/sorting (not on first load): focuses and scrolls to the results count (#showingRx)
 *
 * @param {Object} inputs - State used to determine focus/scroll behavior.
 * @param {boolean} inputs.isLoading - Whether the prescriptions list is currently loading
 * @param {Array<Object>} inputs.filteredList - The current filtered list of prescriptions
 * @param {boolean} inputs.noFilterMatches - Whether no medications match the current filter
 * @param {boolean} inputs.isReturningFromDetailsPage - Whether returning from the prescription details page
 * @param {React.RefObject} inputs.scrollLocation - Ref to the element to scroll to when returning from the prescription details page
 * @param {boolean} inputs.showingFocusedAlert - Whether an alert that manages its own focus is currently shown
 */
export const useFocusManagement = ({
  isLoading,
  filteredList,
  noFilterMatches,
  isReturningFromDetailsPage,
  scrollLocation,
  showingFocusedAlert,
}) => {
  const isFirstLoad = useRef(true);

  // Focus h1 or scroll to previous location on load
  useEffect(
    () => {
      if (!isLoading) {
        if (
          isReturningFromDetailsPage &&
          scrollLocation?.current?.scrollIntoView
        ) {
          scrollLocation?.current?.scrollIntoView();
        } else if (!showingFocusedAlert) {
          // Focus the h1 element on initial load, unless an alert that manages its own focus is showing.
          focusElement(document.querySelector('h1'));
        }
      }
    },
    [
      showingFocusedAlert,
      isLoading,
      isReturningFromDetailsPage,
      scrollLocation,
    ],
  );

  // Focus "no matches" message or scroll to results after filter/sort
  useEffect(
    () => {
      if (isLoading) {
        return;
      }

      if (noFilterMatches) {
        focusElement(document.getElementById('no-matches-msg'));
        return;
      }

      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      } else {
        const showingRx = document.getElementById('showingRx');
        if (showingRx) {
          focusElement(showingRx);
          showingRx.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
      }
    },
    [filteredList, isLoading, noFilterMatches],
  );
};
