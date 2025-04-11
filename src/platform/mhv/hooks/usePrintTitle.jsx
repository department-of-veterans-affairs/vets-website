import { useEffect } from 'react';
import { formatDateShort } from '../../utilities/date';

const usePrintTitle = (baseTitle, userDetails, dob, updatePageTitle) => {
  useEffect(() => {
    const { first, last, suffix } = userDetails;
    const name = [first, last, suffix]
      .filter(part => part !== undefined && part !== null)
      .join(' ')
      .trim();
    // eslint-disable-next-line no-irregular-whitespace
    const pageTitle = `${name}${name ? '\u2003' : ''}​DOB:​${formatDateShort(
      new Date(dob),
    )}`;

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
  }, [baseTitle, userDetails, dob, updatePageTitle]);
};

export default usePrintTitle;
