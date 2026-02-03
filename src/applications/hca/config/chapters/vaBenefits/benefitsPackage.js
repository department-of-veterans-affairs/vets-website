// @ts-check
import {
  titleUI,
  descriptionUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import HealthEnrollmentDescription from '../../../components/FormDescriptions/HealthEnrollmentDescription';
import RegistrationOnlyNote from '../../../components/FormDescriptions/RegistrationOnlyNote';
import { emptyObjectSchema } from '../../../definitions';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(
      content['benefits--reg-only-title'],
      content['benefits--reg-only-description'],
    ),
    ...descriptionUI(HealthEnrollmentDescription),
    'view:vaBenefitsPackage': radioUI({
      title: content['benefits--reg-only-label'],
      labels: {
        fullPackage: content['benefits--reg-only-full-package-label'],
        regOnly: content['benefits--reg-only-service-connected-label'],
      },
    }),
    'view:registrationOnlyNote': {
      ...descriptionUI(RegistrationOnlyNote),
    },
  },
  schema: {
    type: 'object',
    required: ['view:vaBenefitsPackage'],
    properties: {
      'view:vaBenefitsPackage': radioSchema(['fullPackage', 'regOnly']),
      'view:registrationOnlyNote': emptyObjectSchema,
    },
  },
};
