import React from 'react';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { LAST_YEAR } from '../../utils/constants';
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
        number, email address, and mailing address.
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
          href="https://www.va.gov/health-care/update-health-information/#what-supporting-documents-can-"
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
  </>
);

export default ProcessDescription;
