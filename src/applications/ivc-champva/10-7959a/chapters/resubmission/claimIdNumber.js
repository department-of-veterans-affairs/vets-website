import {
  descriptionUI,
  selectSchema,
  selectUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validFieldCharsOnly } from '../../../shared/validations';
import ClaimIdentificationInfo from '../../components/FormDescriptions/ClaimIdentificationInfo';
import { blankSchema } from '../../definitions';
import content from '../../locales/en/content.json';
import { personalizeTitleByRole } from '../../utils/helpers';

export const ID_NUMBER_OPTIONS = [
  content['resubmission-id-number--pdi-option'],
  content['resubmission-id-number--control-option'],
];

export default {
  uiSchema: {
    ...titleUI(
      ({ formData }) =>
        personalizeTitleByRole(
          formData,
          content['resubmission-id-number--page-title'],
        ),
      content['resubmission-id-number--page-desc'],
    ),
    pdiOrClaimNumber: selectUI(content['resubmission-id-number--select-label']),
    identifyingNumber: textUI({
      title: content['resubmission-id-number--input-label'],
      hint: content['resubmission-id-number--input-hint'],
    }),
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(errors, null, formData, 'identifyingNumber'),
    ],
    'view:addtlInfo': descriptionUI(ClaimIdentificationInfo),
  },
  schema: {
    type: 'object',
    required: ['pdiOrClaimNumber', 'identifyingNumber'],
    properties: {
      pdiOrClaimNumber: selectSchema(ID_NUMBER_OPTIONS),
      identifyingNumber: textSchema,
      'view:addtlInfo': blankSchema,
    },
  },
};
