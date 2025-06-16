import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const LivingSituationDescription = (
  <va-additional-info
    trigger="Why we ask for this information"
    class="vads-u-margin-top--2 vads-u-margin-bottom--3"
    uswds
  >
    <div>
      <p className="vads-u-margin-top--0">
        [Language should be specific to the form and should cover the questions
        asked on both this page and the following page, if that applies to the
        given form.]
      </p>
    </div>
  </va-additional-info>
);

export default {
  title: 'Living Situation',
  path: 'living-situation',
  depends: formData => formData?.maritalStatus === 'MARRIED',
  uiSchema: {
    ...titleUI('Living situation'),
    'view:livingSituationDescription': {
      'ui:description': LivingSituationDescription,
    },
    currentlyLiveWithSpouse: {
      'ui:title': 'Do you currently live with your spouse?',
      'ui:widget': 'yesNo',
    },
    liveWithSpousePreviousYear: {
      'ui:title':
        'Did you live with your spouse for any part of the previous year?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['currentlyLiveWithSpouse', 'liveWithSpousePreviousYear'],
    properties: {
      'view:livingSituationDescription': {
        type: 'object',
        properties: {},
      },
      currentlyLiveWithSpouse: { type: 'boolean' },
      liveWithSpousePreviousYear: { type: 'boolean' },
    },
  },
};
