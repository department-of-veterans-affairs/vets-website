import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';
import { validFieldCharsOnly } from '../../../shared/validations';

const PAGE_TITLE = ({ formData }) => {
  const name = nameWording(formData, undefined, undefined, true);
  return privWrapper(`${name} Medicare Part B carrier`);
};

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE),
    applicantMedicarePartBCarrier: textUI({
      title: 'Name of insurance carrier',
      hint:
        'The insurance carrier may be listed as “Medicare Health Insurance” on the insurance card.',
    }),
    applicantMedicarePartBEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part B effective date',
      hint:
        'You may find the effective date on the front of the Medicare card near “Coverage starts” or “Effective date.”',
    }),
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(
          errors,
          null,
          formData,
          'applicantMedicarePartBCarrier',
        ),
    ],
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartBCarrier',
      'applicantMedicarePartBEffectiveDate',
    ],
    properties: {
      applicantMedicarePartBCarrier: textSchema,
      applicantMedicarePartBEffectiveDate: currentOrPastDateSchema,
    },
  },
};
