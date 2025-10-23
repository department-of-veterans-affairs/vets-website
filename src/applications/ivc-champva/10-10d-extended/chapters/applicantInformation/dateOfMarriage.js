import {
  arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { applicantWording } from '../../../shared/utilities';
import MarriageDateDescription from '../../components/FormDescriptions/MarriageDateDescription';
import { blankSchema } from '../../definitions';
import { validateMarriageAfterDob } from '../../helpers/validations';
import content from '../../locales/en/content.json';

const PAGE_TITLE = content['applicants--marriage-date-title'];
const PAGE_DESC = content['applicants--marriage-date-description'];
const INPUT_LABEL = content['applicants--marriage-date-label'];

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `${applicantWording(formData)} ${PAGE_TITLE}`,
      PAGE_DESC,
      false,
    ),
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
