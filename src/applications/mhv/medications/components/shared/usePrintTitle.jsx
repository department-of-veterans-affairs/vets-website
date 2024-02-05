import { useEffect } from 'react';

const usePrintTitle = (
  baseTitle,
  userDetails,
  dob,
  dateFormat,
  updatePageTitle,
) => {
  useEffect(
    () => {
      const { first, last, middle, suffix } = userDetails;
      const name = first
        ? `${last}, ${first} ${middle} ${suffix}`
            .replace(/undefined/g, '')
            .trim()
        : 'Doe, John R., Jr.';
      const formattedDob = dateFormat(new Date(dob)) || 'March 15, 1982';

      const beforePrintHandler = () => {
        updatePageTitle(`${baseTitle} ${name} ${formattedDob}`);
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
    [baseTitle, userDetails, dob, dateFormat, updatePageTitle],
  );
};

export default usePrintTitle;
