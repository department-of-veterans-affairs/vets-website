import {
  ssnOrVaFileNumberNoHintSchema,
  ssnOrVaFileNumberNoHintUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getVeteranIdentityInfoPageTitle } from '../helpers';

/** @type {PageSchema} */
export default {
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
