import merge from 'lodash/merge';
import {
  dateOfBirthSchema,
  dateOfBirthUI,
  ssnSchema,
  ssnUI,
  titleUI,
  vaFileNumberSchema,
  vaFileNumberUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import { createSpouseLabelSelector, requiresSpouseInfo } from './helpers';
import { showMultiplePageResponse } from '../../../helpers';
import createHouseholdMemberTitle from '../../../components/DisclosureTitle';

const { spouseIsVeteran } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  title: 'Spouse information',
  path: 'household/spouse-info',
  depends: formData =>
    !showMultiplePageResponse() && requiresSpouseInfo(formData),
  uiSchema: {
    ...titleUI(createHouseholdMemberTitle('spouseFullName', 'information')),
    spouseDateOfBirth: merge({}, dateOfBirthUI({ dataDogHidden: true }), {
      'ui:title': '',
      'ui:options': {
        updateSchema: createSpouseLabelSelector(
          spouseName =>
            `${spouseName.first} ${spouseName.last}’s date of birth`,
        ),
      },
    }),
    spouseSocialSecurityNumber: merge({}, ssnUI(), {
      'ui:title': '',
      'ui:options': {
        updateSchema: createSpouseLabelSelector(
          spouseName =>
            `${spouseName.first} ${spouseName.last}’s Social Security number`,
        ),
      },
    }),
    spouseIsVeteran: yesNoUI({
      updateSchema: createSpouseLabelSelector(
        spouseName =>
          `Is ${spouseName.first} ${spouseName.last} also a Veteran?`,
      ),
    }),
    spouseVaFileNumber: {
      ...vaFileNumberUI(
        'Enter their VA file number if it does not match their SSN',
      ),
      'ui:options': {
        expandUnder: 'spouseIsVeteran',
      },
    },
    'view:liveWithSpouse': yesNoUI({
      updateSchema: createSpouseLabelSelector(
        spouseName =>
          `Do you live with ${spouseName.first} ${spouseName.last}?`,
      ),
    }),
  }, // uiSchema
  schema: {
    type: 'object',
    required: [
      'spouseDateOfBirth',
      'spouseSocialSecurityNumber',
      'spouseIsVeteran',
      'view:liveWithSpouse',
    ],
    properties: {
      spouseDateOfBirth: dateOfBirthSchema,
      spouseSocialSecurityNumber: ssnSchema,
      spouseIsVeteran,
      spouseVaFileNumber: vaFileNumberSchema,
      'view:liveWithSpouse': yesNoSchema,
    },
  },
};
