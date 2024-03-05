import React from 'react';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { LAST_YEAR } from '../../utils/constants';
import content from '../../locales/en/content.json';
import { TeraRedirectAlert } from '../FormAlerts/TeraRedirectAlert';

const ProcessDescription = () => (
  <>
    <FormTitle
      title={content['form-title']}
      subTitle={content['form-subtitle']}
    />

    <p>
      Use the Health Benefits Update Form (VA Form 10-10EZR) to update your
      personal, financial, and insurance information after you’re enrolled in VA
      health care.
    </p>

    <TeraRedirectAlert />

    <h2>What to know before you fill out this form</h2>

    <p>You can update this household financial information:</p>
    <ul>
      <li>Your marital status</li>
      <li>Dependent information</li>
      <li>
        Income information from {LAST_YEAR} for you, your spouse (if you’re
        married), and any dependents you may have
      </li>
      <li>You or your spouse’s deductible expenses from {LAST_YEAR}</li>
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
    </ul>
  </>
);

export default ProcessDescription;
