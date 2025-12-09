import {
  titleUI,
  textUI,
  textSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';

export default {
  uiSchema: {
    ...titleUI(({ formData }) =>
      privWrapper(
        `${nameWording(formData)} Medicare Part C carrier and effective date`,
      ),
    ),
    applicantMedicarePartCCarrier: textUI({
      title: 'Name of insurance carrier',
      hint: 'This is the name of the insurance company.',
    }),
    applicantMedicarePartCEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part C effective date',
      hint:
        'This information is on the front of the Medicare card near “Effective date” or “Issue date.” If it’s not there, it may be on the plan’s online portal or enrollment documents.',
    }),
  },
  schema: {
    type: 'object',
    required: [
      'applicantMedicarePartCCarrier',
      'applicantMedicarePartCEffectiveDate',
    ],
    properties: {
      applicantMedicarePartCCarrier: textSchema,
      applicantMedicarePartCEffectiveDate: currentOrPastDateSchema,
    },
  },
};
