import React from 'react';

export default function NeedHelp() {
  return (
    <div className="usa-width-two-thirds medium-8 columns print-full-width">
      <va-need-help>
        <div slot="content">
          <p>
            <strong>
              If you need help gathering your information or filling out your
              form,
            </strong>{' '}
            <va-link
              external
              href="https://www.benefits.va.gov/gibill/resources/education_resources/school_certifying_officials/elr.asp"
              text="contact your Education Liaison Representative."
            />
          </p>
        </div>
      </va-need-help>
    </div>
  );
}
