import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import environment from 'platform/utilities/environment';

export const directDepositDescription = () => {
  return (
    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    <div tabIndex="0">
      <p>
        We make payments only through direct deposit, also called electronic
        funds transfer (EFT). If you’re approved for the Rogers STEM
        Scholarship, we’ll need to know where to deposit the funds.
      </p>
      <img
        src={
          environment.isProduction()
            ? 'https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/img/direct-deposit-check-guide.svg'
            : 'https://staging-va-gov-assets.s3-us-gov-west-1.amazonaws.com/img/direct-deposit-check-guide.svg'
        }
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
  <VaAdditionalInfo
    trigger="What if I don't have a bank account or don't want to use direct deposit?"
    onClick={gaBankInfoHelpText}
    uswds
  >
    <div>
      <p>
        The{' '}
        <a href="https://veteransbenefitsbanking.org/">
          Veterans Benefits Banking Program (VBBP)
        </a>{' '}
        provides a list of Veteran-friendly banks and credit unions. They’ll
        work with you to set up an account, or help you qualify for an account,
        so you can use direct deposit. To get started, call one of the
        participating banks or credit unions listed on the VBBP website. Be sure
        to mention the Veterans Benefits Banking Program.
      </p>
      <p>
        Note: The Department of the Treasury requires us to make electronic
        payments. If you don’t want to use direct deposit, you’ll need to call
        the Department of the Treasury at{' '}
        <va-telephone className="help-phone-number-link" contact="8003331795" />
        . Ask to talk with a representative who handles waiver requests. They
        can answer any questions or concerns you may have.
      </p>
    </div>
  </VaAdditionalInfo>
);
