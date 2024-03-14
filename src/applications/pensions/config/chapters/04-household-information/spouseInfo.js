import merge from 'lodash/merge';

import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  ssnSchema,
  ssnUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import { createSpouseLabelSelector } from '../../../helpers';

import createHouseholdMemberTitle from '../../../components/DisclosureTitle';

const {
  spouseVaFileNumber,
  liveWithSpouse,
  spouseIsVeteran,
} = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(createHouseholdMemberTitle('spouseFullName', 'information')),
    spouseDateOfBirth: merge({}, currentOrPastDateUI, {
      'ui:options': {
        updateSchema: createSpouseLabelSelector(
          spouseName =>
            `${spouseName.first} ${spouseName.last}’s date of birth`,
        ),
      },
    }),
    spouseSocialSecurityNumber: merge({}, ssnUI, {
      'ui:title': '',
      'ui:options': {
        updateSchema: createSpouseLabelSelector(
          spouseName =>
            `${spouseName.first} ${spouseName.last}’s Social Security number`,
        ),
      },
    }),
    spouseIsVeteran: {
      'ui:widget': 'yesNo',
      'ui:options': {
        updateSchema: createSpouseLabelSelector(
          spouseName =>
            `Is ${spouseName.first} ${spouseName.last} also a Veteran?`,
        ),
        yesNoReverse: true,
        labels: {
          Y: 'No',
          N: 'Yes',
        },
      },
    },
    spouseVaFileNumber: {
      'ui:title': 'Enter their VA file number if it does not match their SSN',
      'ui:options': {
        expandUnder: 'spouseIsVeteran',
      },
      'ui:errorMessages': {
        pattern: 'Your VA file number must be 8 or 9 digits',
      },
    },
    'view:liveWithSpouse': {
      'ui:widget': 'yesNo',
      'ui:options': {
        updateSchema: createSpouseLabelSelector(
          spouseName =>
            `Do you live with ${spouseName.first} ${spouseName.last}?`,
        ),
      },
    },
  },
  schema: {
    type: 'object',
    required: [
      'spouseDateOfBirth',
      'spouseSocialSecurityNumber',
      'spouseIsVeteran',
      'view:liveWithSpouse',
    ],
    properties: {
      spouseDateOfBirth: currentOrPastDateSchema,
      spouseSocialSecurityNumber: ssnSchema,
      spouseIsVeteran,
      spouseVaFileNumber,
      'view:liveWithSpouse': liveWithSpouse,
    },
  },
};
