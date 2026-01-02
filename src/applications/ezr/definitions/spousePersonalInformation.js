import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import {
  arrayBuilderItemFirstPageTitleUI,
  fullNameUI,
  ssnUI,
  ssnSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateMarriageDate } from '../utils/validation';
import content from '../locales/en/content.json';

const { spouseFullName } = ezrSchema.properties;

/** @returns {PageSchema} */
const spousePersonalInformationPage = () => ({
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: content['household-spouse-information-title'],
      showEditExplanationText: false,
    }),
    spouseFullName: fullNameUI(
      title => `${content['household-spouse-name-prefix']} ${title}`,
    ),
    spouseSocialSecurityNumber: ssnUI(content['household-spouse-ssn-label']),
    spouseDateOfBirth: currentOrPastDateUI(
      content['household-spouse-dob-label'],
    ),
    dateOfMarriage: {
      ...currentOrPastDateUI(content['household-spouse-marriage-date-label']),
      'ui:validations': [validateMarriageDate],
    },
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
});
export default spousePersonalInformationPage;
