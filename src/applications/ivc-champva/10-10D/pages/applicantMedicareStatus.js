import {
  titleUI,
  titleSchema,
  radioUI,
  radioSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AdditionalDocumentationAlert from '../components/AdditionalDocumentationAlert';
import { applicantWording } from '../helpers/wordingCustomization';

export const medicareStatusThirdPersonUiSchema = {
  applicants: {
    items: {
      'view:alert': {
        'ui:title': AdditionalDocumentationAlert,
      },
      ...titleUI(
        ({ formData }) => `${applicantWording(formData)} Medicare status`,
      ),

      applicantMedicareStatus: radioUI({
        title: 'Is this applicant enrolled in Medicare?',
        labels: {
          enrolled: 'Yes, this applicant is enrolled in medicare',
          over65Eligible:
            'No, this applicant is 65 or over, eligible, but not enrolled in Medicare',
          over65Ineligible:
            'No, this applicant is 65 or over and not eligible for Medicare',
          under65Ineligible:
            'No, this applicant is under 65 and not eligible for Medicare',
        },
      }),
    },
  },
};

export const medicareStatusFirstPersonUiSchema = {
  applicants: {
    items: {
      'view:alert': {
        'ui:title': AdditionalDocumentationAlert,
      },
      ...titleUI(
        ({ formData }) => `${applicantWording(formData)} Medicare status`,
      ),

      applicantMedicareStatus: radioUI({
        title: 'Are you enrolled in Medicare?',
        labels: {
          enrolled: "Yes, I'm enrolled in medicare",
          over65Eligible:
            "No, I'm 65 or over, eligible, but not enrolled in Medicare",
          over65Ineligible: "No, I'm 65 or over and not eligible for Medicare",
          under65Ineligible: "No, I'm under 65 and not eligible for Medicare",
        },
      }),
    },
  },
};

export const medicarePartChecboxGroupThirdPersonUiSchema = {
  applicants: {
    items: {
      'view:alert': {
        'ui:title': AdditionalDocumentationAlert,
      },
      ...titleUI(
        ({ formData }) =>
          `${applicantWording(formData)} Medicare status (continued)`,
      ),

      applicantMedicarePart: checkboxGroupUI({
        title: 'What parts of medicare is the applicant enrolled in?',
        hint: 'You can select more than one',
        description: 'Please select at least one option',
        tile: true,
        required: true,
        labels: {
          partA: {
            title: 'Part A',
            description: 'Applicant is enrolled in Medicare Part A',
          },
          partB: {
            title: 'Part B',
            description: 'Applicant is enrolled in Medicare Part A',
          },
          partD: {
            title: 'Part D',
            description: 'Applicant is enrolled in Medicare Part D',
          },
        },
        errorMessages: {
          required: 'Please select at least one option',
        },
      }),
    },
  },
};

export const medicarePartChecboxGroupFirstPersonUiSchema = {
  applicants: {
    items: {
      'view:alert': {
        'ui:title': AdditionalDocumentationAlert,
      },
      ...titleUI(
        ({ formData }) =>
          `${applicantWording(formData)} Medicare status (continued)`,
      ),

      applicantMedicarePart: checkboxGroupUI({
        title: 'What parts of medicare are you enrolled in?',
        hint: 'You can select more than one',
        description: 'Please select at least one option',
        tile: true,
        required: true,
        labels: {
          partA: {
            title: 'Part A',
            description: 'I am enrolled in Medicare Part A',
          },
          partB: {
            title: 'Part B',
            description: 'I am enrolled in Medicare Part A',
          },
          partD: {
            title: 'Part D',
            description: 'I am enrolled in Medicare Part D',
          },
        },
        errorMessages: {
          required: 'Please select at least one option',
        },
      }),
    },
  },
};

export const medicarePartCheckboxGroupSchema = {
  type: 'object',
  properties: {
    applicants: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          'view:alert': {
            type: 'object',
            properties: {},
          },
          titleSchema,
          applicantMedicarePart: checkboxGroupSchema([
            'partA',
            'partB',
            'partD',
          ]),
        },
      },
    },
  },
};

export const medicareStatusSchema = {
  type: 'object',
  properties: {
    applicants: {
      type: 'array',
      items: {
        type: 'object',
        required: ['applicantMedicareStatus'],
        properties: {
          'view:alert': {
            type: 'object',
            properties: {},
          },
          titleSchema,
          applicantMedicareStatus: radioSchema([
            'enrolled',
            'over65Eligible',
            'over65Ineligible',
            'under65Ineligible',
          ]),
        },
      },
    },
  },
};
