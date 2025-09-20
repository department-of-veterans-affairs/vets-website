import React from 'react';

const NeedHelp = () => {
  return (
    <div className="vads-u-margin-top--6 need-help-container">
      <va-need-help>
        <div slot="content">
          <p>
            <strong>If you have questions while filling out the form, </strong>
            please contact{' '}
            <a
              href="mailto:principles.excellence@va.gov"
              target="_blank"
              rel="noreferrer"
            >
              principles.excellence@va.gov
            </a>
            .
          </p>
        </div>
      </va-need-help>
    </div>
  );
};

export default NeedHelp;
