import React from 'react';

const NeedHelp = () => {
  return (
    <div className="usa-width-two-thirds medium-8 columns print-full-width">
      <va-need-help>
        <div slot="content">
          <p>
            If you need help filling out this form, contact Education Call
            Center +1-888-442-4551 or submit a request with{' '}
            <va-link
              external
              text="Ask VA"
              href="https://www.va.gov/contact-us/ask-va/introduction"
            />
            .
          </p>
        </div>
      </va-need-help>
    </div>
  );
};

export default NeedHelp;
