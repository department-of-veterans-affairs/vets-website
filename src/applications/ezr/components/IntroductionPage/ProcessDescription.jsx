import React from 'react';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { LAST_YEAR } from '../../utils/constants';
import { APP_URLS } from '../../utils/appUrls';
import { CONTACTS } from '../../utils/imports';
import content from '../../locales/en/content.json';

const ProcessDescription = () => (
  <>
    <FormTitle
      title={content['form-title']}
      subTitle={content['form-subtitle']}
    />

    <p>
      Use the Health Benefits Update Form (VA Form 10-10EZR) to update your
      personal, financial, insurance, or military service history information
      after you’re enrolled in VA health care.
    </p>

    <h2>What to know before you fill out this form</h2>

    <p>You can update this type of information:</p>
    <ul>
      <li>Your marital status</li>
      <li>Dependent information</li>
      <li>
        Income information from {LAST_YEAR} for you, your spouse (if you’re
        married), and any dependents you may have
      </li>
      <li>
        Deductible expenses from {LAST_YEAR} for you or your spouse (expenses
        that you can subtract from your income)
      </li>
    </ul>

    <p>
      We’ll use this information to determine if you’ll need to pay a copay for
      non-service-connected care or prescription medicines. We’ll also determine
      if you’re eligible for travel pay reimbursement.
    </p>

    <p>You can also update this information:</p>
    <ul>
      <li>
        <strong>Your personal information.</strong> This includes your phone
        number, email address, mailing address, emergency contact and next of
        kin information.
      </li>
      <li>
        <strong>
          Insurance information for all health insurance companies that cover
          you.
        </strong>{' '}
        This includes coverage that you get through a spouse or significant
        other. This also includes Medicare, private insurance, or insurance from
        your employer.
      </li>
      <li>
        <strong>Military service history information.</strong> This includes
        details about exposure to any toxins or other hazards. And you can also
        submit supporting documents with more information about this exposure.{' '}
        <a
          href="/health-care/update-health-information/#what-supporting-documents-can-"
          target="_blank"
          rel="noreferrer"
        >
          Learn more about the supporting documents you can submit
        </a>
      </li>
    </ul>
    <p>
      <strong>Note:</strong> You can provide more information about your
      military service history and we’ll determine if you may have had exposure
      to any toxins or other hazards. We’ll also determine if we’ll place you in
      a higher priority group. This may affect how much (if anything) you’ll
      have to pay toward the cost of your care.
    </p>
    <h3>About VA dental care</h3>
    <p>
      If you qualify for VA dental care benefits, you may be able to get some or
      all of your dental care through VA. Or if you don’t qualify for VA dental
      care, you can buy dental insurance at a reduced cost through the VA Dental
      Insurance Program (VADIP).
    </p>
    <p>
      <va-link
        href="/health-care/about-va-health-benefits/dental-care/dental-insurance/"
        text="Learn more about VA Dental Insurance Program (VADIP)"
      />
    </p>
    <p>
      To find out about your VA dental care benefits eligibility, call our
      Health Eligibility Center at{' '}
      <va-telephone contact={CONTACTS['222_VETS']} /> (
      <va-telephone contact={CONTACTS['711']} tty />
      ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m.{' '}
      <dfn>
        <abbr title="Eastern Time">ET</abbr>
      </dfn>
      . You can also visit your local VA facility to learn more.
    </p>
    <p>
      <va-link
        href={APP_URLS.facilities}
        text="Find your nearest VA facility"
      />
    </p>
  </>
);

export default ProcessDescription;
