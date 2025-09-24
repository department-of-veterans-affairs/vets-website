import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import PrimaryOfficialBenefitStatusTitle from '../components/PrimaryOfficialBenefitStatusTitle';
import PrimaryOfficialBenefitsDisclaimer from '../components/PrimaryOfficialBenefitsDisclaimer';
import BenefitsDisclaimerCustomReviewField from '../components/BenefitsDisclaimerCustomReviewField';

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
    'view:benefitsDisclaimer': {
      'ui:field': PrimaryOfficialBenefitsDisclaimer,
      'ui:reviewField': BenefitsDisclaimerCustomReviewField,
      'ui:options': {
        hideIf: formData =>
          !formData?.primaryOfficialBenefitStatus?.hasVaEducationBenefits,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formData.primaryOfficialBenefitStatus?.hasVaEducationBenefits) {
          return {
            ...formSchema,
            required: ['hasVaEducationBenefits', 'view:benefitsDisclaimer'],
          };
        }

        return {
          ...formSchema,
          required: ['hasVaEducationBenefits'],
        };
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    primaryOfficialBenefitStatus: {
      type: 'object',
      properties: {
        hasVaEducationBenefits: yesNoSchema,
        'view:benefitsDisclaimer': {
          type: 'boolean',
        },
      },
      required: ['hasVaEducationBenefits'],
    },
  },
};

export { uiSchema, schema };
