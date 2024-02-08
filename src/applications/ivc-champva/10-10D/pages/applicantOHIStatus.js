import {
  titleUI,
  titleSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AdditionalDocumentationAlert from '../components/AdditionalDocumentationAlert';
import { applicantWording } from '../helpers/wordingCustomization';

export const ohiStatusThirdPersonUiSchema = {
  applicants: {
    items: {
      'view:alert': {
        'ui:title': AdditionalDocumentationAlert,
      },
      ...titleUI(
        ({ formData }) =>
          `${applicantWording(formData)} other health insurance status`,
      ),
      applicantHasOhi: yesNoUI({
        title:
          'Does this applicant have other health insurance (that is not Medicare)?',
        labels: {
          Y: 'Yes, this applicant has other health insurance',
          N: "No, this applicant doesn't have other health insurance",
        },
      }),
    },
  },
};

export const ohiStatusFirstPersonUiSchema = {
  applicants: {
    items: {
      'view:alert': {
        'ui:title': AdditionalDocumentationAlert,
      },
      ...titleUI(
        ({ formData }) =>
          `${applicantWording(formData)} other health insurance status`,
      ),
      applicantHasOhi: yesNoUI({
        title:
          'Does this applicant have other health insurance (that is not Medicare)?',
        labels: {
          Y: 'Yes, I have other health insurance',
          N: "No, I don't have other health insurance",
        },
      }),
    },
  },
};

export const ohiStatusSchema = {
  type: 'object',
  properties: {
    applicants: {
      type: 'array',
      items: {
        type: 'object',
        required: ['applicantHasOhi'],
        properties: {
          'view:alert': {
            type: 'object',
            properties: {},
          },
          titleSchema,
          applicantHasOhi: yesNoSchema,
        },
      },
    },
  },
};
