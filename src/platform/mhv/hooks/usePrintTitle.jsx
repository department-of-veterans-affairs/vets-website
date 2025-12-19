import { useEffect } from 'react';
import { updatePageTitle as updatePageTitleFn } from '../util/helpers';
import { formatBirthDateShort } from '../util/dateUtil';

const usePrintTitle = (
  baseTitle,
  userDetails,
  dob,
  updatePageTitle = updatePageTitleFn,
) => {
  useEffect(
    () => {
      const { first, last, suffix } = userDetails;
      const name = [first, last, suffix]
        .filter(part => part !== undefined && part !== null)
        .join(' ')
        .trim();

      let pageTitle = '';
      if (dob) {
        const formattedDob = formatBirthDateShort(dob);
        // eslint-disable-next-line no-irregular-whitespace
        pageTitle = `${name}${name ? '\u2003' : ''}​DOB:​${formattedDob}`;
      }

      const beforePrintHandler = () => {
        updatePageTitle(pageTitle);
      };

      const afterPrintHandler = () => {
        updatePageTitle(baseTitle);
      };

      window.addEventListener('beforeprint', beforePrintHandler);
      window.addEventListener('afterprint', afterPrintHandler);

      return () => {
        window.removeEventListener('beforeprint', beforePrintHandler);
        window.removeEventListener('afterprint', afterPrintHandler);
      };
    },
    [baseTitle, userDetails, dob, updatePageTitle],
  );
};

export default usePrintTitle;
