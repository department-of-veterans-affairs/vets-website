import {
  titleUI,
  descriptionUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';
import ProofOfMedicareAlert from '../../components/FormAlerts/ProofOfMedicareAlert';

export default {
  uiSchema: {
    ...descriptionUI(ProofOfMedicareAlert),
    'view:partADenialNotice': {
      ...titleUI(({ formData }) =>
        privWrapper(`${nameWording(formData)} Medicare status`),
      ),
      applicantMedicarePartADenialNotice: {
        ...yesNoUI({
          title:
            'Does the beneficiary have a notice of disallowance, denial, or other proof of ineligibility for Medicare Part A?',
          hint:
            'Depending on your response, you may need to submit additional documents.',
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:partADenialNotice': {
        type: 'object',
        required: ['applicantMedicarePartADenialNotice'],
        properties: {
          applicantMedicarePartADenialNotice: yesNoSchema,
        },
      },
    },
  },
};
