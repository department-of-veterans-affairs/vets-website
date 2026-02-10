import { useEffect } from 'react';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

/**
 * Custom hook that focuses on the h1 element when loading completes.
 * Used by page containers to set focus after the loading spinner is removed.
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.isLoading - Primary loading state (e.g., listState === loadStates.FETCHING)
 * @param {boolean} [options.isLoadingAcceleratedData=false] - Optional accelerated data loading state
 */

const useFocusAfterLoading = ({
  isLoading,
  isLoadingAcceleratedData = false,
}) => {
  useEffect(
    () => {
      // Only focus h1 when not loading (h1 is in the DOM)
      if (!isLoadingAcceleratedData && !isLoading) {
        focusElement(document.querySelector('h1'));
      }
    },
    [isLoadingAcceleratedData, isLoading],
  );
};

export default useFocusAfterLoading;
