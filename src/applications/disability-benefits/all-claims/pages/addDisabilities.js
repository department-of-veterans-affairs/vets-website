import React from 'react';
import * as autosuggest from 'us-forms-system/lib/js/definitions/autosuggest';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import disabilityLabels from '../content/disabilityLabels';
import NewDisability from '../components/NewDisability';

import fullSchema from '../config/schema';

const { condition } = fullSchema.properties.newDisabilities.items.properties;

export const uiSchema = {
  'ui:description': 'Please tell us the new conditions you want to claim.',
  newDisabilities: {
    'ui:title': 'New condition',
    'ui:options': {
      viewField: NewDisability,
      reviewTitle: 'New Disabilities',
      itemName: 'Disability',
    },
    items: {
      condition: autosuggest.uiSchema(
        'If you know the name of your condition, you can type it here. You can write whatever you want and we’ll make suggestions for possible disabilities.',
        () =>
          Promise.resolve(
            Object.entries(disabilityLabels).map(([key, value]) => ({
              id: key,
              label: value,
            })),
          ),
        {
          'ui:options': {
            freeInput: true,
          },
        },
      ),
      'view:descriptionInfo': {
        'ui:description': () => (
          <div>
            <p>For example, foot pain, back pain, or hearing loss.</p>
            <AdditionalInfo triggerText="What if I don't know the name of my condition?">
              <p>
                If you don’t know the name of your condition or aren’t finding a
                match, you can type in your symptoms and we’ll help you figure
                out the name of your condition during the exam process.
              </p>
              <p>Shorter descriptions are better. For example:</p>
              <ul>
                <li>My knee hurts when I walk.</li>
                <li>I have trouble hearing when other people talk.</li>
                <li>My doctor says my cancer may be related to my service.</li>
              </ul>
            </AdditionalInfo>
          </div>
        ),
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    newDisabilities: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['condition'],
        properties: {
          condition,
          'view:descriptionInfo': { type: 'object', properties: {} },
        },
      },
    },
  },
};
