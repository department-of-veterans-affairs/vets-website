import { useEffect } from 'react';
import * as mhvExports from '@department-of-veterans-affairs/mhv/exports';

/**
 * Custom hook to set the page title using MHV's updatePageTitle function
 * @param {string} title the title to set
 * @param {Object} [options] - optional parameters for testing
 * @param {Function} [options.updatePageTitle] - custom updatePageTitle function for testing.
 */
export const usePageTitle = (title, options = {}) => {
  useEffect(
    () => {
      const updatePageTitleDefault = mhvExports.updatePageTitle;
      const updatePageTitle = options.updatePageTitle || updatePageTitleDefault;
      updatePageTitle(title);
    },
    [title, options.updatePageTitle],
  );
};
