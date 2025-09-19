import React from 'react';
import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const applicantRelationshipToVeteran = {
  uiSchema: {
    'ui:title': 'Relationship to Veteran',
    relationshipToVeteran: {
      'ui:title': 'What is your relationship to the Veteran?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          familyMember: 'Family member',
          funeralHomeRep: 'Representative of a funeral home',
          personalRepresentative: 'Personal representative',
          other: 'Other',
        },
      },
    },
    relationshipDescription: {
      ...textUI({
        title: 'Describe your relationship to the Veteran',
      }),
      'ui:required': formData => formData?.relationshipToVeteran === 'other',
      'ui:options': {
        hideIf: formData => formData?.relationshipToVeteran !== 'other',
      },
    },
    'view:personalRepInfo': {
      'ui:field': () => (
        <va-additional-info trigger="How we define Personal Representative">
          <p>
            A personal representative is a person who has authority to act on
            behalf of a Veteran, or is legally responsible for a Veteran.
            Documentation should be submitted with this form to establish a
            person’s status as a personal representative. You don’t have to
            submit documentation as a personal representative if you are a
            family member of the Veteran.
          </p>
        </va-additional-info>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      relationshipToVeteran: {
        type: 'string',
        enum: [
          'familyMember',
          'funeralHomeRep',
          'personalRepresentative',
          'other',
        ],
        enumNames: [
          'Family member',
          'Representative of a funeral home',
          'Personal representative',
          'Other',
        ],
      },
      relationshipDescription: {
        ...textSchema,
        maxLength: 100,
      },
      'view:personalRepInfo': {
        type: 'object',
        properties: {},
      },
    },
    required: ['relationshipToVeteran'],
  },
};

export default applicantRelationshipToVeteran;
