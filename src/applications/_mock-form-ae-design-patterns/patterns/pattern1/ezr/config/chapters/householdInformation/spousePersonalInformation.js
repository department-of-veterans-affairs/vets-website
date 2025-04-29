import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import {
  titleUI,
  fullNameUI,
  ssnUI,
  ssnSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../../../../shared/locales/en/content.json';

const { spouseFullName } = ezrSchema.properties;

export default {
  uiSchema: {
    ...titleUI(content['household-spouse-information-title']),
    spouseFullName: fullNameUI(
      title => `${content['household-spouse-name-prefix']} ${title}`,
    ),
    spouseSocialSecurityNumber: ssnUI(content['household-spouse-ssn-label']),
    spouseDateOfBirth: currentOrPastDateUI(
      content['household-spouse-dob-label'],
    ),
    dateOfMarriage: currentOrPastDateUI(
      content['household-spouse-marriage-date-label'],
    ),
  },
  schema: {
    type: 'object',
    required: [
      'spouseSocialSecurityNumber',
      'spouseDateOfBirth',
      'dateOfMarriage',
    ],
    properties: {
      spouseFullName,
      spouseSocialSecurityNumber: ssnSchema,
      spouseDateOfBirth: currentOrPastDateSchema,
      dateOfMarriage: currentOrPastDateSchema,
    },
  },
};
