import React from 'react';
import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { SpecialMonthlyPensionEvidenceAlert } from '../../../components/FormAlerts';

const { specialMonthlyPension } = fullSchemaPensions.properties;

const Description = (
  <>
    <p>
      If you have certain health needs or disabilities, you may be eligible for
      additional pension. We call this special monthly pension (SMP).
    </p>
    <p>
      You may be eligible for SMP if you need the regular assistance of another
      person, have severe visual impairment, or are generally confined to your
      immediate premises.
    </p>
  </>
);

/** @type {PageSchema} */
export default {
  title: 'Special monthly pension',
  path: 'medical/history/monthly-pension',
  uiSchema: {
    ...titleUI('Special monthly pension', Description),
    specialMonthlyPension: yesNoUI({
      title: 'Are you claiming special monthly pension?',
      classNames: 'vads-u-margin-bottom--2',
    }),

    'view:warningAlert': {
      'ui:description': SpecialMonthlyPensionEvidenceAlert,
      'ui:options': {
        hideIf: formData => formData.specialMonthlyPension !== true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['specialMonthlyPension'],
    properties: {
      specialMonthlyPension,
      'view:warningAlert': {
        type: 'object',
        properties: {},
      },
    },
  },
};
