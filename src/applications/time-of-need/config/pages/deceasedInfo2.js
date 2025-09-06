import React from 'react';
import {
  titleUI,
  textUI,
  textSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
  selectUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Deceased details'),
    'ui:description': (
      <div>
        <p>
          Provide details for the deceased. Later on, we’ll ask for your own
          details.
        </p>
      </div>
    ),
    relationshipToVeteran: {
      ...selectUI({
        options: [
          { value: '', label: 'Select an option' },
          { value: 'spouse', label: 'Spouse' },
          { value: 'child', label: 'Child' },
          { value: 'parent', label: 'Parent' },
          { value: 'other', label: 'Other' },
        ],
        title:
          'Relationship of deceased to the Veteran or service member (their sponsor)',
      }),
    },
    dateOfDeath: {
      ...dateOfBirthUI({
        title: 'Date of death',
        description:
          'Please enter two digits for the month and day and four digits for the year.',
      }),
    },
    birthCityOrCounty: {
      ...textUI({ title: 'Birth city or county' }),
    },
    birthStateOrTerritory: {
      ...textUI({ title: 'Birth state or territory' }),
    },
  },
  schema: {
    type: 'object',
    required: ['relationshipToVeteran', 'dateOfDeath'],
    properties: {
      relationshipToVeteran: {
        type: 'string',
        title:
          'Relationship of deceased to the Veteran or service member (their sponsor)',
        enum: ['', 'spouse', 'child', 'parent', 'other'],
        enumNames: ['Select an option', 'Spouse', 'Child', 'Parent', 'Other'],
      },
      dateOfDeath: {
        ...dateOfBirthSchema,
        title: 'Date of death',
      },
      birthCityOrCounty: {
        ...textSchema,
        title: 'Birth city or county',
      },
      birthStateOrTerritory: {
        ...textSchema,
        title: 'Birth state or territory',
      },
    },
  },
};
