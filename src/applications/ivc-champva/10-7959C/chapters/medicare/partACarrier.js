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
  return privWrapper(`${name} Medicare Part A carrier`);
};

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE),
    applicantMedicarePartACarrier: textUI({
      title: 'Name of insurance carrier',
      hint:
        'The insurance carrier may be listed as “Medicare Health Insurance” on the insurance card.',
    }),
    applicantMedicarePartAEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part A effective date',
      hint:
        'You may find the effective date on the front of the Medicare card near “Coverage starts” or “Effective date.”',
    }),
    'ui:validations': [
      (errors, formData) =>
        validFieldCharsOnly(
          errors,
          null,
          formData,
          'applicantMedicarePartACarrier',
        ),
    ],
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartACarrier',
      'applicantMedicarePartAEffectiveDate',
    ],
    properties: {
      applicantMedicarePartACarrier: textSchema,
      applicantMedicarePartAEffectiveDate: currentOrPastDateSchema,
    },
  },
};
