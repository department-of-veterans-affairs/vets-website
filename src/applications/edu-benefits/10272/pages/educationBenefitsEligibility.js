import React from 'react';

import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Your VA education benefits history'),
  'view:vaBenefitProgramNo': {
    'ui:description': (
      <div>
        <va-card background>
          <h4 className="vads-u-font-size--h3 vads-u-margin-top--0">
            Based on your responses, you may not be eligible{' '}
          </h4>
          <p>
            <strong>Your responses: </strong>
          </p>
          <p className="vads-u-display--flex vads-u-margin-bottom--0">
            <va-icon icon="close" size="3" class="vads-u-margin-right--0p5" />
            You have not previously applied for VA education benefits.
          </p>
        </va-card>

        <p>
          <strong>
            Based on your answer, you might not qualify for reimbursement right
            now.
          </strong>{' '}
          You’ll need to apply and be found eligible for the VA education
          benefit under which you want your reimbursement processed.
        </p>
        <p>
          <va-link
            text="Apply for VA education benefits using Form 22-1990"
            href="https://www.va.gov/education/apply-for-gi-bill-form-22-1990/introduction"
            external
          />
          , <strong>or</strong>
        </p>
        <p>
          <va-link
            text="Apply for VA education benefits as a dependent using Form 22-5490"
            href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490/introduction"
            external
          />
          , <strong>or</strong>
        </p>
        <p>
          <va-link
            text="Apply to use transferred education benefits using Form 22-1990e"
            href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/transferred-gi-bill-benefits/apply-form-22-1990e/introduction"
            external
          />
        </p>

        <p className="vads-u-margin-y--5">
          <va-link-action
            href="https://www.va.gov/education/"
            text="Exit request for reimbursement"
            type="primary"
          />
        </p>

        <p className="vads-u-margin-y--4">
          If you’d still like to request reimbursement, you can continue with
          your request.
        </p>
      </div>
    ),
  },
};

const schema = {
  type: 'object',
  properties: {
    'view:vaBenefitProgramNo': {
      type: 'object',
      properties: {},
    },
  },
};

export { schema, uiSchema };
