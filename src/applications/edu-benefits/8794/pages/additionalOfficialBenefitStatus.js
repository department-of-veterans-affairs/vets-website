import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AdditionalOfficialBenefitStatusTitle from '../components/AdditionalOfficialBenefitStatusTitle';
import AdditionalOfficialBenefitsDisclaimer from '../components/AdditionalOfficialBenefitsDisclaimer';

const uiSchema = {
  additionalOfficialBenefitStatus: {
    'ui:description': AdditionalOfficialBenefitStatusTitle,
    hasVaEducationBenefits: yesNoUI({
      title:
        'Is this individual in receipt of Department of Veterans Affairs Education benefits?',
      errorMessages: {
        required: 'Please provide a response',
      },
    }),
    'view:benefitsDisclaimer': {
      'ui:field': AdditionalOfficialBenefitsDisclaimer,
      'ui:options': {
        hideIf: (formData, index) => {
          if (formData['additional-certifying-official']) {
            return !formData['additional-certifying-official'][index]
              ?.additionalOfficialBenefitStatus?.hasVaEducationBenefits;
          }
          return !formData?.additionalOfficialBenefitStatus
            ?.hasVaEducationBenefits;
        },
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema, ui, index) => {
        const isAdding = !!formData['additional-certifying-official'];

        if (isAdding) {
          const addingBenefitStatus =
            formData['additional-certifying-official'][index]
              ?.additionalOfficialBenefitStatus;
          if (addingBenefitStatus?.hasVaEducationBenefits) {
            return {
              ...formSchema,
              required: ['hasVaEducationBenefits', 'view:benefitsDisclaimer'],
            };
          }
          return {
            ...formSchema,
            required: ['hasVaEducationBenefits'],
          };
        }

        const editingBenefitStatus = formData?.additionalOfficialBenefitStatus;
        if (editingBenefitStatus?.hasVaEducationBenefits) {
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
    additionalOfficialBenefitStatus: {
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
