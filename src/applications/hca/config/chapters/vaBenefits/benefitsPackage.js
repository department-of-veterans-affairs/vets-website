import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import RegistrationOnlyDescription from '../../../components/FormDescriptions/RegistrationOnlyDescription';
import HealthEnrollmentDescription from '../../../components/FormDescriptions/HealthEnrollmentDescription';
import { emptyObjectSchema } from '../../../definitions';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(
      content['benefits--reg-only-title'],
      RegistrationOnlyDescription,
    ),
    'view:vaBenefitsPackage': {
      'ui:title': content['benefits--reg-only-label'],
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          fullPackage: content['benefits--reg-only-full-package-label'],
          regOnly: content['benefits--reg-only-service-connected-label'],
          notSure: content['benefits--reg-only-not-sure-label'],
        },
      },
    },
    'view:healthEnrollmentDescription': {
      ...descriptionUI(HealthEnrollmentDescription),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:vaBenefitsPackage': {
        type: 'string',
        enum: ['fullPackage', 'regOnly', 'notSure'],
      },
      'view:healthEnrollmentDescription': emptyObjectSchema,
    },
  },
};
