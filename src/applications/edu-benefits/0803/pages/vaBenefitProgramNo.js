// @ts-check
import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your VA education benefits'),
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
            <p className="vads-u-display--flex">
              <va-icon icon="close" size="3" class="vads-u-margin-right--1p5" />
              You have not previously applied for VA education benefits.
            </p>
          </va-card>
          <p>
            <strong>
              Based on your answer, you might not qualify for reimbursement
              right now.
            </strong>{' '}
            You’ll need to apply for at least one of these VA education benefits
            and be found eligible in order for your reimbursement to be
            processed.{' '}
          </p>
          <p>
            <a href="/todo">
              Application for VA Education Benefits Form 22-1990 (opens in a new
              tab)
            </a>
            , <strong>or</strong>{' '}
            <a href="/todo">
              Dependents’ Application for VA Education Benefits Form 22-5490
              (opens in a new tab)
            </a>
          </p>
          <p>
            If you’d still like to request reimbursement, you can continue with
            the form and apply for VA education benefits after completing this
            form.
          </p>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:vaBenefitProgramNo': { type: 'object', properties: {} },
    },
  },
};
