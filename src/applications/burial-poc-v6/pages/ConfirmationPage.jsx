import React from 'react';
import { Page } from '@department-of-veterans-affairs/va-forms-system-core';
import { useFormikContext } from 'formik';

const SAMPLE_GUID = '20d0c3c3-7456-47cf-9a81-f0ada8dfb089';
const DATE_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short',
};
const benefitsLabels = {
  burialAllowance: 'Burial allowance',
  plotAllowance: 'Plot allowance',
  transportation: 'Transportation',
};

export default function ConfirmationPage(props) {
  const { values } = useFormikContext();

  const benefits = {
    burialAllowance: values?.benefitsSelection?.burialAllowance,
    plotAllowance: values?.benefitsSelection?.plotAllowance,
    transportation: values?.benefitsSelection?.transportation,
  };

  return (
    <>
      <Page {...props} hidePreviousButton>
        <div>
          <div className="print-only">
            <img
              src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
              alt="VA logo"
              width="300"
            />
          </div>
          <p>
            We process claims in the order we receive them. Please print this
            page for your records.
          </p>
          <p>We may contact you for more information or documents.</p>
          <div className="inset">
            <h3 className="vads-u-margin-top--0">
              Burial Benefit Claim{' '}
              <span className="additional">(Form 21P-530)</span>
            </h3>
            <span>
              for {values?.claimantFullName?.first}{' '}
              {values?.claimantFullName?.middle}{' '}
              {values?.claimantFullName?.last}{' '}
              {values?.claimantFullName?.suffix}
            </span>
            <ul className="claim-list">
              <li>
                <h4>Confirmation number</h4>
                <span>{SAMPLE_GUID}</span>
              </li>
              <li>
                <h4>Date submitted</h4>
                <span>
                  {new Date().toLocaleDateString('en-US', DATE_OPTIONS)}
                </span>
              </li>
              <li>
                <h4>Deceased Veteran</h4>
                <span>
                  {values?.veteranFullName?.first}{' '}
                  {values?.veteranFullName?.middle}{' '}
                  {values?.veteranFullName?.last}{' '}
                  {values?.veteranFullName?.suffix}
                </span>
              </li>
              <li>
                <h4>Benefits claimed</h4>
                <ul>
                  {Object.entries(benefits)
                    .filter(([, propertyValue]) => propertyValue)
                    .map(([propertyName]) => (
                      <li key={propertyName}>{benefitsLabels[propertyName]}</li>
                    ))}
                </ul>
              </li>
              <li>
                <h4>Your claim was sent to</h4>
                <address className="schemaform-address-view">
                  <p>Attention: Milwaukee Pension Center</p>
                  <p>P.O. Box 5192</p>
                  <p>Janesville, WI 53547-5192</p>
                </address>
              </li>
            </ul>
            <va-button onClick={window.print} text="Print for your records" />
          </div>
        </div>
      </Page>
    </>
  );
}
