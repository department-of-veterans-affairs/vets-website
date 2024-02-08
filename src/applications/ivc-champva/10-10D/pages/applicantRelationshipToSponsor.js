import {
  titleUI,
  titleSchema,
  relationshipToVeteranSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AdditionalDocumentationAlert from '../components/AdditionalDocumentationAlert';
import { applicantWording } from '../helpers/wordingCustomization';

import { relationshipToVeteranUI } from '../components/customRelationshipPattern';

export const alertAndTitle = {
  'view:alert': {
    'ui:title': AdditionalDocumentationAlert,
  },
  ...titleUI(
    ({ formData }) => `${applicantWording(formData)} relationship to sponsor`,
  ),
};

export const relationshipToSponsorFirstPersonUiSchema = {
  applicants: {
    items: {
      ...alertAndTitle,
      applicantRelationshipToSponsor: {
        ...relationshipToVeteranUI({
          personTitle: 'Sponsor',
          labelHeaderLevel: '',
        }),
        'ui:required': () => true,
      },
    },
  },
};

export const relationshipToSponsorFirstPersonPastTenseUiSchema = {
  applicants: {
    items: {
      ...alertAndTitle,
      applicantRelationshipToSponsor: {
        ...relationshipToVeteranUI({
          personTitle: 'Sponsor',
          labelHeaderLevel: '',
          tense: 'past',
        }),
        'ui:required': () => true,
      },
    },
  },
};

export const relationshipToSponsorThirdPersonUiSchema = {
  applicants: {
    items: {
      ...alertAndTitle,
      applicantRelationshipToSponsor: {
        ...relationshipToVeteranUI({
          personTitle: 'Sponsor',
          labelHeaderLevel: '',
          relativeTitle: 'Applicant',
        }),
        'ui:required': () => true,
      },
    },
  },
};

export const relationshipToSponsorThirdPersonPastTenseUiSchema = {
  applicants: {
    items: {
      ...alertAndTitle,
      applicantRelationshipToSponsor: {
        ...relationshipToVeteranUI({
          personTitle: 'Sponsor',
          labelHeaderLevel: '',
          relativeTitle: 'Applicant',
          tense: 'past',
        }),
        'ui:required': () => true,
      },
    },
  },
};

export const relationshipToSponsorSchema = {
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
          applicantRelationshipToSponsor: relationshipToVeteranSchema,
        },
      },
    },
  },
};
