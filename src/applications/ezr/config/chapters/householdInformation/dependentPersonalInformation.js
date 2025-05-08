import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import VaSelectField from '@department-of-veterans-affairs/platform-forms-system/web-component-fields/VaSelectField';
import {
  fullNameUI,
  ssnUI,
  ssnSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { validateDependentDate } from '../../../utils/validation';
import content from '../../../locales/en/content.json';

const {
  dependents: { items: dependent },
} = ezrSchema.properties;
const { fullName, dependentRelation } = dependent.properties;

export default {
  uiSchema: {
    fullName: fullNameUI(
      title => `${content['household-dependent-name-prefix']} ${title}`,
    ),
    dependentRelation: {
      'ui:title': content['household-dependent-relationship-label'],
      'ui:webComponentField': VaSelectField,
    },
    socialSecurityNumber: ssnUI(content['household-dependent-ssn-label']),
    dateOfBirth: currentOrPastDateUI(content['household-dependent-dob-label']),
    becameDependent: {
      ...currentOrPastDateUI(content['household-dependent-became-label']),
      'ui:validations': [validateDependentDate],
    },
  },
  schema: {
    type: 'object',
    required: [
      'dependentRelation',
      'socialSecurityNumber',
      'dateOfBirth',
      'becameDependent',
    ],
    properties: {
      fullName,
      dependentRelation,
      socialSecurityNumber: ssnSchema,
      dateOfBirth: currentOrPastDateSchema,
      becameDependent: currentOrPastDateSchema,
    },
  },
};
