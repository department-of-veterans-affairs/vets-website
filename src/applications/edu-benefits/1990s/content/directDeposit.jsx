import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

export const directDepositAlert = () => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <div className="vads-u-padding-top--1p5" tabIndex="0">
    <p>
      <b>Note:</b> Any updates you make here to your bank account information
      won't change your existing accounts for VA education or health benefits.
    </p>
  </div>
);

export const bankInfoHelpText = (
  <AdditionalInfo triggerText="What if I don't have a bank account or don't want to use direct deposit?">
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
