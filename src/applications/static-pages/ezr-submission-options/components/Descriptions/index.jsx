import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const PhoneDescription = () => {
  return (
    <p>
      Call our Health Eligibility Center at{' '}
      <va-telephone contact={CONTACTS['222_VETS']} /> and select 1 (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re available Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
      <dfn>
        <abbr title="Eastern Time">ET</abbr>
      </dfn>
      .
    </p>
  );
};

export const MailDescription = () => {
  return (
    <>
      <p>Fill out a Health Benefits Update Form (VA Form 10-10EZR).</p>
      <p>
        <va-link
          href="/find-forms/about-form-10-10ezr/"
          text="Get VA Form 10-10EZR to download"
        />
      </p>
      <p>
        Mail the completed form and any supporting documents to this address:
      </p>
      <p className="va-address-block">
        Health Eligibility Center
        <br role="presentation" />
        PO Box 5207
        <br role="presentation" />
        Janesville, WI 53547-5207
      </p>
    </>
  );
};

export const InPersonDescription = () => {
  return (
    <>
      <p>You can update your information in person at a VA health facility.</p>
      <p>
        <va-link
          href="/find-locations/"
          text="Find your nearest VA health facility"
        />
      </p>
    </>
  );
};

export const ModifiableHealthBenefitsInformation = ({ isEzrEnabled }) => {
  return (
    <>
      <h2>
        What information can I update with the Health Benefits Update Form?
      </h2>
      <p>
        You can use the Health Benefits Update Form (VA Form 10-10EZR) to review
        and update your household financial information.
      </p>
      <p>
        You can update this type of information:
        <ul>
          <li>Your marital status</li>
          <li>Dependent information</li>
          <li>
            Income information for you, your spouse (if you’re married), and any
            dependents you may have
          </li>
          <li>
            Deductible expenses for you or your spouse (expenses that you can
            subtract from your income)
          </li>
        </ul>
      </p>
      <p>
        You can also update this information:
        <ul>
          <li>
            <strong>Your personal information.</strong> This includes your phone
            number, email address, and mailing address.
          </li>
          <li>
            <strong>
              Insurance information for all health insurance companies that
              cover you.
            </strong>{' '}
            This includes coverage that you get through a spouse or significant
            other. This also includes Medicare, private insurance, or insurance
            from your employer.
          </li>
          <li>
            <strong>Military service history information.</strong> This includes
            details about exposure to any toxins or other hazards.
          </li>
        </ul>
      </p>
      <p>
        <strong>Note:</strong> You can also update your military service history
        information if any of your details have changed since you enrolled in VA
        health care.{' '}
        {isEzrEnabled
          ? 'You should know that at this time, you can update this information only using the PDF version of our form.'
          : 'And you can also answer more questions about your military service history that will help us determine if you may have had exposure to any toxins or other hazards.'}
      </p>
    </>
  );
};
