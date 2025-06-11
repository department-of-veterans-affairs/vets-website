import React from 'react';
import {
  titleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { spouseMarriageHistoryOptions } from './marriageHistoryConfig';

const SpousePreviousMarriagesDescription = (
  <va-additional-info
    trigger="Why we ask this information"
    class="vads-u-margin-top--2 vads-u-margin-bottom--3"
    uswds
  >
    <div>
      <p className="vads-u-margin-top--0">
        [Language should be specific to the form and explain why VA needs to
        know about your spouse’s previous marriages.]
      </p>
    </div>
  </va-additional-info>
);

export default {
  uiSchema: {
    ...titleUI('Has your spouse been married before?'),
    'view:completedSpouseFormerMarriage': arrayBuilderYesNoUI(
      spouseMarriageHistoryOptions,
      {
        title: 'Has your spouse been married before?',
        hint: '',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Does your spouse have any other previous marriages?',
        hint:
          'You’ll need to include all of their past marriages, even ones that ended in divorce, annulment, or death.',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
        labelHeaderLevel: 'p',
      },
    ),
    'view:spousePreviousMarriagesInfo': {
      'ui:description': SpousePreviousMarriagesDescription,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:completedSpouseFormerMarriage': arrayBuilderYesNoSchema,
      'view:spousePreviousMarriagesInfo': {
        type: 'object',
        properties: {},
      },
    },
    required: ['view:completedSpouseFormerMarriage'],
  },
};
