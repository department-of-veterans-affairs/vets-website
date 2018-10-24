import React from 'react';
import { srSubstitute } from '../../all-claims/utils';
import { accountTitleLabels } from '../constants';
import { PaymentDescription, editNote } from '../helpers';

const PaymentView = response => {
  const {
    accountType = '',
    accountNumber = '',
    financialInstitutionRoutingNumber: routingNumber = '',
    financialInstitutionName: bankName = '',
  } = response;

  const mask = (string, unmaskedLength) => {
    // If no string is given, tell the screen reader users the account or routing number is blank
    if (!string) {
      return srSubstitute('', 'is blank');
    }
    const repeatCount =
      string.length > unmaskedLength ? string.length - unmaskedLength : 0;
    const maskedString = srSubstitute(
      `${'●'.repeat(repeatCount)}`,
      'ending with',
    );
    return (
      <span>
        {maskedString}
        {string.slice(-unmaskedLength)}
      </span>
    );
  };

  if (!accountType || !accountNumber || !routingNumber) {
    // should we also check bankName?
    return (
      <div>
        <p>
          <strong>
            We don’t have any bank account information for you in our system.
          </strong>
          <br />
          You can still complete this form, but we’ll need your payment
          information before we can pay you any compensation.
        </p>
        <p>
          <strong>You can update your payment information a few ways:</strong>
        </p>
        <ul>
          <li>
            Fill out and send us a Direct Deposit Enrollment form (VA Form
            24-0296).{' '}
            <a
              href="https://www.vba.va.gov/pubs/forms/vba-24-0296-are.pdf"
              target="_blank"
            >
              Download VA Form 24-0296
            </a>
            , <strong>or</strong>
          </li>
          <li>
            Go to eBenefits to add your payment information to your account.{' '}
            <a
              href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=direct-deposit-and-contact-information"
              target="_blank"
            >
              Go to eBenefits
            </a>
            , <strong>or</strong>
          </li>
          <li>
            Call Veterans Benefits Assistance at{' '}
            <a href="tel:1-800-827-1000">1-800-827-1000</a>, Monday – Friday,
            8:00 a.m. – 9:00 p.m. (ET).
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <PaymentDescription />
      <div className="blue-bar-block">
        <p>
          <strong>{accountTitleLabels[accountType.toUpperCase()]}</strong>
        </p>
        <p>Account number: {mask(accountNumber, 4)}</p>
        <p>Bank routing number: {mask(routingNumber, 4)}</p>
        <p>Bank name: {bankName || srSubstitute('', 'is blank')}</p>
      </div>
      {editNote('bank information')}
    </div>
  );
};

export default PaymentView;
