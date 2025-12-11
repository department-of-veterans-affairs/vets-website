import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';

const PAGE_TITLE = ({ formData }) => {
  const name = nameWording(formData, undefined, undefined, true);
  return privWrapper(`${name} Medicare pharmacy benefits`);
};

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE),
    applicantMedicarePharmacyBenefits: yesNoUI({
      title: 'Does the beneficiary’s Medicare plan provide parmacy benefits?',
      hint: 'You can find this information on the front of your Medicare card.',
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantMedicarePharmacyBenefits'],
    properties: {
      applicantMedicarePharmacyBenefits: yesNoSchema,
    },
  },
};
