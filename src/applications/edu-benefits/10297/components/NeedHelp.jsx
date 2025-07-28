import React from 'react';

const NeedHelp = () => {
  return (
    <div className="vads-u-margin-top--4 need-help-container">
      <va-need-help>
        <div slot="content">
          <p>
            If you need help with your application or have questions about
            enrollment or eligibility, submit a request with{' '}
            <va-link external text="Ask VA" href="https://ask.va.gov/" />
          </p>
        </div>
      </va-need-help>
    </div>
  );
};

export default NeedHelp;
