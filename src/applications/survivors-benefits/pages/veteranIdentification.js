import { merge } from 'lodash';
import {
  ssnOrVaFileNumberNoHintSchema,
  ssnOrVaFileNumberNoHintUI,
  serviceNumberSchema,
  serviceNumberUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Veteran’s identification information',
      'You must enter a Social Security number or VA file number',
    ),
    veteranSocialSecurityNumber: merge({}, ssnOrVaFileNumberNoHintUI(), {
      vaFileNumber: {
        'ui:title': 'VA file number (if known)',
      },
    }),
    veteranServiceNumber: serviceNumberUI('Service number'),
  },
  schema: {
    type: 'object',
    required: ['veteranSocialSecurityNumber'],
    properties: {
      veteranSocialSecurityNumber: ssnOrVaFileNumberNoHintSchema,
      veteranServiceNumber: serviceNumberSchema,
    },
  },
};
