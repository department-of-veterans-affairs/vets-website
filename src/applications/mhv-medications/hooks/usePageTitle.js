import { useEffect } from 'react';
import * as mhvExports from '@department-of-veterans-affairs/mhv/exports';

/**
 * Custom hook to set the page title using MHV's updatePageTitle function
 * @param {string} title - The page title
 * @param {object} [options] - Optional parameters for testing
 * @param {function} [options.updatePageTitle] - Custom updatePageTitle function for testing
 * @returns {void}
 */
export const usePageTitle = (
  title,
  { updatePageTitle: customUpdatePageTitle } = {},
) => {
  useEffect(
    () => {
      const updatePageTitleDefault = mhvExports.updatePageTitle;
      const updatePageTitle = customUpdatePageTitle || updatePageTitleDefault;
      updatePageTitle(title);
    },
    [title, customUpdatePageTitle],
  );
};
