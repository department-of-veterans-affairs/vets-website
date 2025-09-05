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
    relationshipToVeteran: selectUI({
      label:
        'Relationship of deceased to the Veteran or service member (their sponsor)',
      options: [
        { value: '', label: 'Select an option' },
        { value: 'spouse', label: 'Spouse' },
        { value: 'child', label: 'Child' },
        { value: 'parent', label: 'Parent' },
        { value: 'other', label: 'Other' },
      ],
    }),
    dateOfDeath: {
      ...dateOfBirthUI(),
      'ui:title': 'Date of death',
      'ui:description':
        'Please enter two digits for the month and day and four digits for the year.',
    },
    birthCityOrCounty: textUI({ label: 'Birth city or county' }),
    birthStateOrTerritory: textUI({ label: 'Birth state or territory' }),
  },
  schema: {
    type: 'object',
    required: ['relationshipToVeteran', 'dateOfDeath'],
    properties: {
      relationshipToVeteran: {
        type: 'string',
        enum: ['', 'spouse', 'child', 'parent', 'other'],
        enumNames: ['Select an option', 'Spouse', 'Child', 'Parent', 'Other'],
      },
      dateOfDeath: dateOfBirthSchema,
      birthCityOrCounty: { ...textSchema },
      birthStateOrTerritory: { ...textSchema },
    },
  },
};
