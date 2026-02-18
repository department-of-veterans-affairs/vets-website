import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { applicantWording } from '../../../shared/utilities';
import MarriageDateDescription from '../../components/FormDescriptions/MarriageDateDescription';
import { blankSchema } from '../../definitions';
import { validateMarriageAfterDob } from '../../utils/validations';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicants--marriage-date-title'];
const PAGE_DESC = content['applicants--marriage-date-description'];
const INPUT_LABEL = content['applicants--marriage-date-label'];

const PAGE_TITLE = ({ formData }) =>
  `${applicantWording(formData)} ${TITLE_TEXT}`;

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(PAGE_TITLE, PAGE_DESC, false),
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
