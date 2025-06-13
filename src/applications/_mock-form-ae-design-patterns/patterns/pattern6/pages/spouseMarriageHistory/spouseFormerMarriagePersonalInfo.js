import React from 'react';
import {
  fullNameUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { DynamicSpouseNameTitle } from '../../helpers/dynamicSpouseNameTitles';

const infoAlert = (
  <va-alert
    status="info"
    disable-analytics="false"
    full-width="false"
    class="vads-u-margin-bottom--4"
  >
    <p className="vads-u-margin-y--0">
      We usually don’t need to contact a former spouse of a Veteran’s spouse. In
      the rare case where we need information from this person, we’ll contact
      you first.
    </p>
  </va-alert>
);

export const buildSpouseFormerMarriageUiSchema = () => ({
  infoAlert: {
    'ui:description': infoAlert,
  },
  'ui:title': DynamicSpouseNameTitle,
  spouseFormerSpouseFullName: {
    ...fullNameUI,
    first: {
      ...fullNameUI.first,
      'ui:title': 'First or given name',
    },
    middle: {
      ...fullNameUI.middle,
      'ui:title': 'Middle name',
    },
    last: {
      ...fullNameUI.last,
      'ui:title': 'Last or family name',
    },
    suffix: {
      ...fullNameUI.suffix,
      'ui:title': 'Suffix',
      'ui:options': {
        placeholder: 'Select',
        uswds: true,
      },
    },
  },
});

export const spouseFormerMarriageSchema = {
  type: 'object',
  required: ['spouseFormerSpouseFullName'],
  properties: {
    infoAlert: {
      type: 'object',
      properties: {},
    },
    spouseFormerSpouseFullName: fullNameSchema,
  },
};
