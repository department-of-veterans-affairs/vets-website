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
      const { first, last, suffix } = userDetails;
      const name = first
        ? `${first} ${last} ${suffix}`.replace(/undefined/g, '').trim()
        : 'John Doe Jr.';
      const formattedDob = dob ? dateFormat(new Date(dob)) : 'None noted';

      const beforePrintHandler = () => {
        updatePageTitle(
          `${baseTitle} | ${name} | Date of birth: ${formattedDob}`,
        );
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
