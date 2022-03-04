import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import environment from 'platform/utilities/environment';

const isProduction = environment.isProduction();

export const bankInfoDescriptionWithInfo = isProduction
  ? 'This is the bank account information we have on file for you. We’ll pay your housing stipend to this account.'
  : undefined;

export const bankInfoDescriptionWithoutInfo = isProduction
  ? 'We don’t have your bank information on file. Please provide your direct deposit information below. We’ll pay your housing stipend to this account.'
  : undefined;

export const bankInfoNote = (
  <div>
    <p>
      <strong>Note: </strong>
      Any updates you make here to your bank account information will apply to
      your other Veteran benefits, including compensation, pension, and
      education.
      {isProduction
        ? 'Updates here will not change accounts on file for your VA health benefits.'
        : 'Updates here won’t change accounts on file for your VA health benefits.'}
    </p>
  </div>
);

const gaBankInfoHelpText = () => {
  window.dataLayer.push({
    event: 'edu-0994--form-help-text-clicked',
    'help-text-label': 'What if I don’t have a bank account?',
  });
};

export const bankInfoHelpText = (
  <AdditionalInfo
    triggerText="What if I don’t have a bank account?"
    onClick={gaBankInfoHelpText}
  >
    {isProduction ? (
      <span>
        <p>
          The Department of Treasury requires all federal benefit payments be
          made by electronic funds transfer (EFT), also called direct deposit.
        </p>
        <p>
          If you don’t have a bank account, or don’t wish to provide your bank
          account information, you must receive your payment through Direct
          Express Debit MasterCard. To request a Direct Express Debit
          MasterCard, apply at{' '}
          <a
            href="https://www.usdirectexpress.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.usdirectexpress.com
          </a>{' '}
          or call{' '}
          <a className="help-phone-number-link" href="tel:1-800-333-1795">
            800-333-1795
          </a>
          .
        </p>
        <p>
          If you choose not to enroll, you’ll need to call the Department of
          Treasury at{' '}
          <a className="help-phone-number-link" href="tel:1-888-224-2950">
            888-224-2950
          </a>{' '}
          and speak to a representative handling waiver requests. They’ll
          encourage you to participate in EFT and address any questions or
          concerns you have.
        </p>
      </span>
    ) : (
      <span>
        <p>
          The{' '}
          <a href="https://www.usdirectexpress.com/">
            Veterans Benefits Banking Program (VBBP)
          </a>{' '}
          provides a list of Veteran-friendly banks and credit unions. They’ll
          work with you to set up an account, or help you qualify for an
          account, so you can use direct deposit. To get started, call one of
          the participating banks or credit unions listed on the VBBP website.
          Be sure to mention the Veterans Benefits Banking Program.
        </p>
        <p>
          Note: The Department of the Treasury requires us to make electronic
          payments. If you don’t want to use direct deposit, you’ll need to call
          the Department of the Treasury at{' '}
          <a className="help-phone-number-link" href="tel:1-888-224-2950">
            888-224-2950
          </a>{' '}
          . Ask to talk with a representative who handles waiver requests. They
          can answer any questions or concerns you may have.
        </p>
      </span>
    )}
  </AdditionalInfo>
);
