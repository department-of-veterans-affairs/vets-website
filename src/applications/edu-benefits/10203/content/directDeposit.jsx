import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

export const directDepositDescription = () => {
  return (
    /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
    <div tabIndex="0">
      <p>
        We make payments only through direct deposit, also called electronic
        funds transfer (EFT). If you’re approved for the Rogers STEM
        Scholarship, we’ll need to know where to deposit the funds.
      </p>
      <img
        src="/img/direct-deposit-check-guide.png"
        alt="On a personal check, find your bank’s 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."
      />
    </div>
  );
};

const gaBankInfoHelpText = () => {
  window.dataLayer.push({
    event: 'edu-10203--form-help-text-clicked',
    'help-text-label': 'What if I don’t have a bank account?',
  });
};

export const directDepositAlert = () => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <div className="vads-u-padding-top--1p5" tabIndex="0">
    <p>
      <b>Note:</b> Any bank account information you enter here will apply to
      your other Veteran benefits, including compensation, pension, and Benefits
      for Certain Children with Disabilities (Chapter 18) payments.
    </p>
    <p>
      Information entered here won’t change your existing accounts for VA
      education or health benefits.
    </p>
  </div>
);

export const bankInfoHelpText = (
  <AdditionalInfo
    triggerText="What if I don't have a bank account or don't want to use direct deposit?"
    onClick={gaBankInfoHelpText}
  >
    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
    <div tabIndex="0">
      <p>
        The Department of the Treasury requires all federal benefit payments be
        made by electronic funds transfer (EFT), also called direct deposit.
      </p>
      <p>
        If you don’t have a bank account, or don’t wish to provide your bank
        account information, you must receive your payment through Direct
        Express Debit MasterCard. To request a Direct Express Debit MasterCard:
        <ul>
          <li>
            Apply at{' '}
            <a
              aria-label="www.usdirectexpress.com, opening in new tab"
              href="https://www.usdirectexpress.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {' '}
              www.usdirectexpress.com
            </a>{' '}
            <b>or</b>
          </li>
          <li>
            {' '}
            Call{' '}
            <a className="help-phone-number-link" href="tel:1-800-333-1795">
              800-333-1795
            </a>
          </li>
        </ul>
      </p>
      <p>
        If you choose not to enroll, you’ll need to call the Department of the
        Treasury at{' '}
        <a className="help-phone-number-link" href="tel:1-888-224-2950">
          888-224-2950
        </a>{' '}
        and speak to a representative handling waiver requests. They’ll
        encourage you to participate in EFT and address any questions or
        concerns you have.
      </p>
    </div>
  </AdditionalInfo>
);
