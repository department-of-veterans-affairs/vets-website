import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';
import { validateChars } from '../../utils/validation';

const PAGE_TITLE = ({ formData }) => {
  const name = nameWording(formData, undefined, undefined, true);
  return privWrapper(`${name} Medicare Part D carrier`);
};

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE),
    applicantMedicarePartDCarrier: {
      ...textUI({
        title: 'Name of insurance carrier',
        hint: 'Your insurance carrier is your insurance company.',
        validations: [validateChars],
      }),
    },
    applicantMedicarePartDEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part D effective date',
      hint: 'This information is at the top of the card.',
    }),
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartDCarrier',
      'applicantMedicarePartDEffectiveDate',
    ],
    properties: {
      applicantMedicarePartDCarrier: textSchema,
      applicantMedicarePartDEffectiveDate: currentOrPastDateSchema,
    },
  },
};
