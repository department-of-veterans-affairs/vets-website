import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

export const directDepositWarning = (
  <div className="pension-dd-warning">
    The Department of Treasury requires all federal benefit payments be made by
    electronic funds transfer (EFT), also called direct deposit. If you don’t
    have a bank account, you must get your payment through Direct Express Debit
    MasterCard. To request a Direct Express Debit MasterCard you must apply at{' '}
    <a
      href="http://www.usdirectexpress.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      www.usdirectexpress.com
    </a>{' '}
    or by telephone at <a href="tel:8003331795">1-800-333-1795</a>. If you chose
    not to enroll, you must contact representatives handling waiver requests for
    the Department of Treasury at
    <a href="tel:8882242950">1-888-224-2950</a>. They will address any questions
    or concerns you may have and encourage your participation in EFT.
  </div>
);

export const activeDutyLabel = (
  <>
    <p>Montgomery GI Bill Active Duty (Chapter 30)</p>
    <AdditionalInfo triggerText="Learn more">
      <p>
        Our records indicate you may be eligible for this benefit because you
        served at least two years on active duty and were honorably discharged.
      </p>
      <a
        href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-active-duty/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {' '}
        Learn more about the Montgomery GI Bill Active Duty
      </a>
    </AdditionalInfo>
  </>
);

export const selectedReserveLabel = (
  <>
    <p>Montgomery GI Bill Selected Reserve (Chapter 1606)</p>
    <AdditionalInfo triggerText="Learn more">
      <p>
        Our records indicate you may be eligible for this benefit because you
        agreed to serve six years in the Selected Reserve.
      </p>
      <a
        href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-selected-reserve/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {' '}
        Learn more about the Montgomery GI Bill Selected Reserve
      </a>
    </AdditionalInfo>
  </>
);

export const unsureDescription = (
  <p>
    {' '}
    <strong>Note:</strong> After you submit this applicaiton, a VA
    representative will reach out to help via your preferred contact method.{' '}
  </p>
);
