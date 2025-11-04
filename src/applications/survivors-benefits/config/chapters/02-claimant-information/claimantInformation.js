import React from 'react';
import {
  fullNameSchema,
  fullNameUI,
  titleUI,
  ssnUI,
  ssnSchema,
  dateOfBirthSchema,
  dateOfBirthUI,
  yesNoSchema,
  yesNoUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { claimantRelationshipOptions } from '../../../utils/labels';

const seriouslyDisabledDescription = (
  <>
    <va-additional-info
      trigger="What we consider a seriously disabled adult child"
      class="vads-u-margin-bottom--4"
    >
      <p>
        A child is seriously disabled if they developed a permanent physical or
        mental disability before they turned 18 years old. A seriously disabled
        child can’t support or care for themselves.
      </p>
    </va-additional-info>
  </>
);

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Claimant’s relationship to the Veteran'),
    claimantRelationship: radioUI({
      title: 'What is the claimant’s relationship to the Veteran?',
      labels: claimantRelationshipOptions,
      errorMessages: {
        required: 'Select what your relationship is to the Veteran',
      },
    }),
    seriouslyDisabled: {
      'ui:description': seriouslyDisabledDescription,
    },
    claimantFullName: fullNameUI(),
    claimantSocialSecurityNumber: ssnUI(),
    claimantDateOfBirth: dateOfBirthUI({
      monthSelect: false,
    }),
    claimantIsVeteran: yesNoUI({
      title: 'Is the claimant a Veteran?',
    }),
  },
  schema: {
    type: 'object',
    required: [
      'claimantRelationship',
      'claimantFullName',
      'claimantSocialSecurityNumber',
      'claimantIsVeteran',
      'claimantDateOfBirth',
    ],
    properties: {
      claimantRelationship: radioSchema(
        Object.keys(claimantRelationshipOptions),
      ),
      seriouslyDisabled: {
        type: 'object',
        properties: {},
      },
      claimantFullName: fullNameSchema,
      claimantSocialSecurityNumber: ssnSchema,
      claimantDateOfBirth: dateOfBirthSchema,
      claimantIsVeteran: yesNoSchema,
    },
  },
};
