import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import * as autosuggest from 'us-forms-system/lib/js/definitions/autosuggest';
import disabilityLabels from '../content/disabilityLabels';
import NewDisability from '../components/NewDisability';

import fullSchema from '../config/schema';

const { condition } = fullSchema.properties.newDisabilities.items.properties;

const conditionsDescriptions = new Set(
  Object.values(disabilityLabels).map(label => label.toLowerCase()),
);

export const uiSchema = {
  'view:newDisabilities': {
    'ui:title':
      'Do you have any new service-connected disabilities or conditions to add to your claim?',
    'ui:widget': 'yesNo',
  },
  newDisabilities: {
    'ui:title': 'Add a new disability',
    'ui:options': {
      expandUnder: 'view:newDisabilities',
      viewField: NewDisability,
      reviewTitle: 'New Disabilities',
      itemName: 'Disability',
    },
    items: {
      condition: autosuggest.uiSchema(
        'If you know the name of your disability, please enter it here. Or, if you don’t know the name, please briefly describe your disability or condition in as much detail as possible.',
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
          <AlertBox isVisible status="info">
            <p>
              Below are some details that may be helpful to include when
              describing your disability:
            </p>
            <ul>
              <li>The part of your body that's affected</li>
              <li>
                If your disability is on the right side or left side of your
                body
              </li>
              <li>The part of your body that isn't working right</li>
            </ul>
          </AlertBox>
        ),
        'ui:options': {
          hideIf: (formData, index) => {
            const enteredCondition = formData.newDisabilities[index].condition;
            if (enteredCondition) {
              return conditionsDescriptions.has(enteredCondition.toLowerCase());
            }

            return true;
          },
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  required: ['view:newDisabilities'],
  properties: {
    'view:newDisabilities': {
      type: 'boolean',
    },
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
