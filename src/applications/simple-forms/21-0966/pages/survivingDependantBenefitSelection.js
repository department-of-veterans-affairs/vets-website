import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/components';
import React from 'react';
import GroupCheckboxWidget from '../../shared/components/GroupCheckboxWidget';
import { benefitSelectionTitle } from '../config/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    benefitSelection: {
      'ui:widget': GroupCheckboxWidget,
      'ui:errorMessages': {
        required: 'Select the benefit listed',
      },
      'ui:title': '',
      'ui:options': {
        labels: ['Survivors'],
        updateSchema: formData => benefitSelectionTitle({ formData }),
      },
    },
    additionalInfo: {
      'ui:title': '',
      'ui:widget': VaAdditionalInfo,
      'ui:description': (
        <va-additional-info trigger="What's an intent to file?">
          An intent to file request lets us know that you’re planning to file a
          claim. An intent to file reserves a potential effective date for when
          you could start getting benefits while you prepare your claim and
          gather supporting documents.
        </va-additional-info>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      benefitSelection: {
        type: 'string',
      },
      additionalInfo: {
        type: 'object',
        properties: {},
      },
    },
    required: ['benefitSelection'],
  },
};
