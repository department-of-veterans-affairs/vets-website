import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const MaritalStatusInfo = (
  <va-additional-info trigger="Why does my marital status matter?">
    <p>
      We want to make sure we understand your household’s financial situation.
    </p>
    <p>
      If you’re married, we also need to understand your spouse’s financial
      situation. This allows us to make a more informed decision on your
      request. &nbsp;&nbsp;&nbsp;&nbsp;
    </p>
  </va-additional-info>
);

const title = 'Are you married and living in the same household?';
export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your spouse information</h3>
      </legend>
    </>
  ),
  questions: {
    isMarried: yesNoUI({
      title,
      enableAnalytics: true,
      uswds: true,
      required: () => true,
      tile: true,
      descriptions: {
        Y: 'If you’re in a civil union or common law marriage that’s recognized by the state the union took place in, select Yes.',
        N: 'If you are unmarried, married but separated, divorced, annulled, or widowed, select No.',
      },
      errorMessages: {
        required: 'Please select your marital status.',
      },
    }),
  },
  'view:components': {
    'view:maritalStatus': {
      'ui:description': MaritalStatusInfo,
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        isMarried: yesNoSchema,
      },
    },
    'view:components': {
      type: 'object',
      properties: {
        'view:maritalStatus': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
