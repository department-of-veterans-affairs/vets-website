import React from 'react';

const NeedHelp = () => {
  return (
    <div className="help-talk">
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
        If you need help with your application or have questions about
        enrollment or eligibility,{' '}
        <va-link
          href="https://ask.va.gov/"
          external
          text="submit a request with Ask VA"
        />
        .
      </p>
    </div>
  );
};

export default NeedHelp;
