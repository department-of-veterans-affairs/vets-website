import merge from 'lodash/merge';
import {
  dateOfBirthUI,
  dateOfBirthSchema,
  ssnUI,
  ssnSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  generateSpouseLabel,
  generateSpouseTitle,
  requiresSpouseInfo,
} from './helpers';
import { showMultiplePageResponse } from '../../../helpers';

/** @type {PageSchema} */
export default {
  title: 'Spouse Information',
  path: 'household/current-marriage/spouse-information',
  depends: formData =>
    showMultiplePageResponse() && requiresSpouseInfo(formData),
  uiSchema: {
    ...titleUI(generateSpouseTitle('information')),
    spouseDateOfBirth: merge({}, dateOfBirthUI({ dataDogHidden: true }), {
      'ui:title': '',
      'ui:options': {
        updateSchema: formData =>
          generateSpouseLabel(formData, 'date of birth'),
      },
    }),
    spouseSocialSecurityNumber: merge({}, ssnUI(), {
      'ui:title': '',
      'ui:options': {
        updateSchema: formData =>
          generateSpouseLabel(formData, 'Social Security number'),
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['spouseDateOfBirth', 'spouseSocialSecurityNumber'],
    properties: {
      spouseDateOfBirth: dateOfBirthSchema,
      spouseSocialSecurityNumber: ssnSchema,
    },
  },
};
