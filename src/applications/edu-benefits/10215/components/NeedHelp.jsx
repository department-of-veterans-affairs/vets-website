import React from 'react';

const NeedHelp = () => {
  return (
    <div className="vads-u-margin-top--6 need-help-container">
      <va-need-help>
        <div slot="content">
          <p>
            <strong>
              If you need help gathering your information or filling out your
              form,{' '}
            </strong>
            <a
              href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/elr.asp"
              target="_blank"
              rel="noreferrer noopener"
            >
              contact your Education Liaison Representative.
            </a>
          </p>
        </div>
      </va-need-help>
    </div>
  );
};

export default NeedHelp;
