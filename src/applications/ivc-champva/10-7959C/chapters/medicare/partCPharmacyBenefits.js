import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';

export default {
  uiSchema: {
    ...titleUI(({ formData }) =>
      privWrapper(`${nameWording(formData)} Medicare pharmacy benefits`),
    ),
    applicantHasPharmacyBenefits: {
      ...yesNoUI({
        title:
          'Does the beneficiary’s Medicare Part C (Advantage Plan) provide pharmacy benefits?',
        hint: 'This information is on the front of the card.',
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['applicantHasPharmacyBenefits'],
    properties: {
      applicantHasPharmacyBenefits: yesNoSchema,
    },
  },
};
