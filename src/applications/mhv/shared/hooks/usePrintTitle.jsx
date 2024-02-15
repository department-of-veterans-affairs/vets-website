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
      let name = `${first} ${last}`.replace(/undefined/g, '').trim();
      if (suffix) name += ` ${suffix}`;
      const pageTitle = `${baseTitle} | ${name} | ${dateFormat(new Date(dob))}`;

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
    [baseTitle, userDetails, dob, dateFormat, updatePageTitle],
  );
};

export default usePrintTitle;
