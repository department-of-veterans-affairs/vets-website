import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { pick } from 'lodash';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import applicantDescription from 'platform/forms/components/ApplicantDescription';

import {
  fullMaidenNameUI,
  ssnDashesUI,
  veteranRelationshipDescription,
  spouseRelationshipDescription,
  childRelationshipDescription,
  otherRelationshipDescription,
} from '../../utils/helpers';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:description': applicantDescription,
  application: {
    claimant: {
      name: fullMaidenNameUI,
      ssn: ssnDashesUI,
      dateOfBirth: currentOrPastDateUI('Date of birth'),
      relationshipToVet: {
        'ui:title': 'Relationship to service member',
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            1: 'I am the service member/Veteran',
            2: 'Spouse or surviving spouse',
            3: 'Unmarried adult child',
            4: 'Other',
          },
          widgetProps: {
            1: { 'aria-describedby': 'veteran-relationship' },
            2: { 'aria-describedby': 'spouse-relationship' },
            3: { 'aria-describedby': 'child-relationship' },
            4: { 'aria-describedby': 'other-relationship' },
          },
          nestedContent: {
            1: veteranRelationshipDescription,
            2: spouseRelationshipDescription,
            3: childRelationshipDescription,
            4: otherRelationshipDescription,
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
        claimant: {
          type: 'object',
          required: ['name', 'ssn', 'dateOfBirth', 'relationshipToVet'],
          properties: pick(claimant.properties, [
            'name',
            'ssn',
            'dateOfBirth',
            'relationshipToVet',
          ]),
        },
      },
    },
  },
};
