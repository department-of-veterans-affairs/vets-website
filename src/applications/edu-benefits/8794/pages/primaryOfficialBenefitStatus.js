import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import PrimaryOfficialBenefitStatusTitle from '../components/PrimaryOfficialBenefitStatusTitle';

const uiSchema = {
  primaryOfficialBenefitStatus: {
    'ui:description': PrimaryOfficialBenefitStatusTitle,
    hasVaEducationBenefits: yesNoUI({
      title:
        'Is this individual in receipt of Department of Veterans Affairs Education benefits?',
      errorMessages: {
        required: 'Please provide a response',
      },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    primaryOfficialBenefitStatus: {
      type: 'object',
      properties: {
        hasVaEducationBenefits: yesNoSchema,
      },
      required: ['hasVaEducationBenefits'],
    },
  },
};

export { uiSchema, schema };
