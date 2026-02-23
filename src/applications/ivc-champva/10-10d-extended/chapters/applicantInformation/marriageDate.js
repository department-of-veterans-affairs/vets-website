import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import MarriageDateDescription from '../../components/FormDescriptions/MarriageDateDescription';
import { blankSchema } from '../../definitions';
import { arrayTitleWithNameUI } from '../../utils/titles';
import { validateMarriageAfterDob } from '../../utils/validations';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicants--marriage-date-title'];
const PAGE_DESC = content['applicants--marriage-date-description'];
const INPUT_LABEL = content['applicants--marriage-date-label'];

export default {
  uiSchema: {
    ...arrayTitleWithNameUI(TITLE_TEXT, PAGE_DESC),
    dateOfMarriageToSponsor: currentOrPastDateUI(INPUT_LABEL),
    'view:addtlInfo': { ...descriptionUI(MarriageDateDescription) },
    'ui:validations': [validateMarriageAfterDob],
  },
  schema: {
    type: 'object',
    required: ['dateOfMarriageToSponsor'],
    properties: {
      dateOfMarriageToSponsor: currentOrPastDateSchema,
      'view:addtlInfo': blankSchema,
    },
  },
};
