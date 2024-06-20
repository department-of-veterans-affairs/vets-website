import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const Explainer = (
  <va-additional-info trigger="Why do I need to provide this information?">
    <p>
      We want to make sure we fully understand your financial situation. We ask
      for details about your real estate assets because it allows us to make a
      more informed decision on your request.
    </p>
    <br />
    <p>
      We won’t take collection action against real estate you own to resolve
      your debt.
    </p>
  </va-additional-info>
);

const RealEstateDescription = (
  <p className="vads-u-color--gray vads-u-margin--0">
    This includes properties with a mortage.
  </p>
);

const title = 'Do you currently own any property?';

export const uiSchema = {
  'ui:title': () => (
    <>
      <legend className="schemaform-block-title">
        <h3 className="vads-u-margin--0">Your real estate assets</h3>
      </legend>
    </>
  ),
  'ui:options': {
    hideOnReview: true,
  },
  questions: {
    hasRealEstate: yesNoUI({
      title,
      description: RealEstateDescription,
      enableAnalytics: true,
      uswds: true,
      required: () => true,
      errorMessages: {
        required: 'Please enter your real estate information.',
      },
    }),
  },
  'view:components': {
    'view:realEstateAdditionalInfo': {
      'ui:description': Explainer,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasRealEstate: yesNoSchema,
      },
    },
  },
  'view:components': {
    type: 'object',
    properties: {
      'view:realEstateAdditionalInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
