import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';

const PAGE_TITLE = ({ formData }) => {
  const name = nameWording(formData, undefined, undefined, true);
  return privWrapper(`${name} Medicare Part D status`);
};

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE),
    applicantMedicareStatusD: yesNoUI(
      'Does the beneficiary have Medicare Part D information to provide or update at this time?',
    ),
  },
  schema: {
    type: 'object',
    required: ['applicantMedicareStatusD'],
    properties: {
      applicantMedicareStatusD: yesNoSchema,
    },
  },
};
