import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

/**
 * Custom hook that focuses on the h1 element when loading completes.
 * Used by page containers to set focus after the loading spinner is removed.
 *
 * Skips focusing h1 when deep-linking to a paginated page (page param in URL),
 * as RecordList will handle focusing the "Showing X to Y" element instead.
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.isLoading - Primary loading state (e.g., listState === loadStates.FETCHING)
 * @param {boolean} [options.isLoadingAcceleratedData=false] - Optional accelerated data loading state
 */

const useFocusAfterLoading = ({
  isLoading,
  isLoadingAcceleratedData = false,
}) => {
  const hasFocused = useRef(false);
  const location = useLocation();

  // Check if this is a deep-link to a paginated page
  const urlParams = new URLSearchParams(location.search);
  const isPaginationDeepLink = urlParams.has('page');

  useEffect(
    () => {
      // Reset the flag when loading starts again
      if (isLoading || isLoadingAcceleratedData) {
        hasFocused.current = false;
      }
    },
    [isLoading, isLoadingAcceleratedData],
  );

  useEffect(
    () => {
      // Skip focusing h1 on pagination deep-links - RecordList handles focus
      if (isPaginationDeepLink) {
        return;
      }

      // Only focus h1 once when loading completes (h1 is in the DOM)
      if (!isLoadingAcceleratedData && !isLoading && !hasFocused.current) {
        hasFocused.current = true;
        focusElement(document.querySelector('h1'));
      }
    },
    [isLoadingAcceleratedData, isLoading, isPaginationDeepLink],
  );
};

export default useFocusAfterLoading;
