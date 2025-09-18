import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import phoneUI from '../../components/Phone';
import emailUI from '../../definitions/email';
import {
  applicantContactInfoSubheader,
  applicantContactInfoDescription,
  bottomPadding,
} from '../../utils/helpers';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export function uiSchema(
  contactInfoSubheader = applicantContactInfoSubheader,
  contactInfoDescription = applicantContactInfoDescription,
) {
  return {
    application: {
      claimant: {
        'view:contactInfoSubheader': {
          'ui:description': contactInfoSubheader,
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
        },
        phoneNumber: phoneUI('Phone number'),
        email: emailUI(),
        'view:contactInfoDescription': {
          'ui:description': contactInfoDescription,
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
        },
        'view:bottomPadding': {
          'ui:description': bottomPadding,
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
        },
      },
    },
  };
}

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        claimant: {
          type: 'object',
          required: ['email', 'phoneNumber'],
          properties: {
            'view:contactInfoSubheader': {
              type: 'object',
              properties: {},
            },
            phoneNumber: claimant.properties.phoneNumber,
            email: claimant.properties.email,
            'view:contactInfoDescription': {
              type: 'object',
              properties: {},
            },
            'view:bottomPadding': {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};
