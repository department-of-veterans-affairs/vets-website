import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import PreparerRadioWidget from '../../components/PreparerRadioWidget';

const { applicant } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  application: {
    applicant: {
      applicantRelationshipToClaimant: {
        'ui:title':
          'Are you filling out this application for yourself or someone else?',
        'ui:widget': PreparerRadioWidget,
        'ui:options': {
          updateSchema: () => {
            return {
              enumNames: [
                'I’m filling it out for myself',
                'I’m filling it out for someone else',
              ],
            };
          },
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        applicant: {
          type: 'object',
          required: ['applicantRelationshipToClaimant'],
          properties: {
            applicantRelationshipToClaimant:
              applicant.properties.applicantRelationshipToClaimant,
          },
        },
      },
    },
  },
};
