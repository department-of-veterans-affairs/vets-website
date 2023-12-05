import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import get from 'platform/utilities/data/get';

import { formatName } from '../../utils/helpers';

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
          updateSchema: formData => {
            const nameData = get('application.claimant.name', formData);
            const applicantName = nameData ? formatName(nameData) : null;

            return {
              enumNames: [
                applicantName || 'Myself',
                'Someone else, such as a preparer',
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
