import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  getIdentityInfoPageTitle,
  getVeteranIdentityInfoPageTitle,
} from '../helpers';

/** @type {PageSchema} */
export const nonVeteranIdInfoPage = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => getIdentityInfoPageTitle(formData),
      'You must enter either a Social Security number or VA File number',
    ),
    nonVeteranId: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      nonVeteranId: ssnOrVaFileNumberNoHintSchema,
    },
  },
};

/** @type {PageSchema} */
export const veteranIdInfoPage = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => getVeteranIdentityInfoPageTitle(formData),
      'You must enter either a Social Security number or VA File number',
    ),
    veteranId: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranId: ssnOrVaFileNumberNoHintSchema,
    },
  },
};
