import React from 'react';

const NeedHelp = () => {
  return (
    <div className="vads-u-margin-top--6 usa-width-two-thirds vads-u-padding-x--1">
      <va-need-help>
        <div slot="content">
          <p>
            <strong>
              If you need help gathering your information or filling out your
              form,{' '}
            </strong>
            <va-link
              text="contact your Education Liaison Representative"
              href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/elr.asp"
              external
            />
          </p>
        </div>
      </va-need-help>
    </div>
  );
};

export default NeedHelp;
