// @ts-check
import React from 'react';
import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Your VA education benefits'),
  ...descriptionUI(
    <div>
      <va-card background>
        <h4
          className="vads-u-font-size--h3 vads-u-margin-top--0"
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex="0"
          role="alert"
          aria-live="assertive"
        >
          Based on your responses, you may not be eligible{' '}
        </h4>
        <p>
          <strong>Your responses: </strong>
        </p>
        <p className="vads-u-display--flex">
          <va-icon icon="close" size="3" class="vads-u-margin-right--1p5" />
          You have not previously applied and been found eligible for the VA
          education benefit you want to use
        </p>
      </va-card>
      <p>
        <strong>
          Based on your answer, you might not qualify for reimbursement right
          now.
        </strong>{' '}
        You’ll need to apply and be found eligible for the VA education benefit
        under which you want your reimbursement processed.
      </p>
      <p>
        <va-link
          external
          href="https://www.va.gov/education/apply-for-gi-bill-form-22-1990/introduction"
          text="Apply for VA education benefits using Form 22-1990"
        />
        , <strong>or</strong>{' '}
      </p>
      <p>
        <va-link
          external
          href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490/introduction"
          text="Apply for VA education benefits as a dependent using Form 22-5490"
        />
        , <strong>or</strong>{' '}
      </p>
      <p>
        <va-link
          external
          href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/transferred-gi-bill-benefits/apply-form-22-1990e/introduction"
          text="Apply to use transferred education benefits using Form 22-1990e"
        />
      </p>
      <p>
        If you’d still like to request reimbursement, you can continue with the
        form and apply for VA education benefits after completing this form.
      </p>
    </div>,
  ),
};
const schema = {
  type: 'object',
  properties: {},
};

export { schema, uiSchema };
