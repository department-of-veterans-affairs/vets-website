import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getIdentityInfoPageTitle } from '../helpers';

/** @type {PageSchema} */
export const identificationInformationPage = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => getIdentityInfoPageTitle(formData),
      'You must enter either a Social Security number or VA File number',
    ),
    idNumber: ssnOrVaFileNumberNoHintUI(),
  },
  schema: {
    type: 'object',
    properties: {
      idNumber: ssnOrVaFileNumberNoHintSchema,
    },
  },
};
