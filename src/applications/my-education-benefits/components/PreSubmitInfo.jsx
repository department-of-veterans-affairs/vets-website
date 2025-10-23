import React from 'react';

const CustomPreSubmitInfo = () => {
  // Note text to be displayed with the privacy policy link
  const noteText = (
    <>
      <strong>Note:</strong> According to federal law, there are criminal
      penalties, including a fine and/or imprisonment for up to 5 years, for
      withholding information or for providing incorrect information (See 18
      U.S.C. 1001).{' '}
      <a
        href="https://www.va.gov/privacy-policy/"
        target="_blank"
        rel="noreferrer"
        aria-label="Privacy policy, will open in new tab"
      >
        Learn more about our privacy policy
      </a>
    </>
  );
  return <div className="vads-u-margin-bottom--1p5">{noteText}</div>;
};
export default CustomPreSubmitInfo;
