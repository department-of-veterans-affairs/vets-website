import React from 'react';

import {
  titleUI,
  radioUI,
  radioSchema,
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const levelNames = {
  'certifying official': 'Certifying official',
  owner: 'Owner',
  officer: 'Officer',
  other: 'Other',
};
const noSpaceOnlyPattern = '^(?!\\s*$).+';
const uiSchema = {
  certifyingOfficial: {
    ...titleUI('Your name and role'),
    first: {
      ...textUI({
        title: 'First name',
        errorMessages: {
          required: 'Please enter a first name',
          pattern: 'You must provide a response',
        },
      }),
    },
    last: {
      ...textUI({
        title: 'Last name',
        errorMessages: {
          required: 'Please enter a last name',
          pattern: 'You must provide a response',
        },
      }),
    },
    role: {
      level: {
        ...radioUI({
          title:
            'Which of the following best describes your role at this institution?',
          errorMessages: { required: 'Please make a selection' },
          labels: levelNames,
        }),
      },
      other: {
        'ui:title': 'Please specify your role',
        'ui:widget': props => (
          <input
            className="usa-input"
            type="text"
            placeholder="Example: Registrar, Bursar, Campus director"
            defaultValue={props.value || ''}
            onChange={e => props.onChange(e.target.value)}
            maxLength={50}
          />
        ),
        'ui:errorMessages': {
          required: 'Your role must be specified',
          pattern: 'You must provide a response',
        },
        'ui:required': formData => {
          return formData.certifyingOfficial?.role?.level === 'other';
        },
        'ui:options': {
          expandUnder: 'level',
          expandUnderCondition: 'other',
          expandedContentFocus: true,
          preserveHiddenData: true,
          classNames: 'vads-u-margin-top--neg1',
        },
      },
    },
  },
};
const schema = {
  type: 'object',
  properties: {
    certifyingOfficial: {
      type: 'object',
      required: ['first', 'last', 'role'],
      properties: {
        first: { ...textSchema, pattern: noSpaceOnlyPattern, maxLength: 30 },
        last: { ...textSchema, pattern: noSpaceOnlyPattern, maxLength: 30 },
        role: {
          type: 'object',
          required: ['level'],
          properties: {
            level: {
              ...radioSchema(Object.keys(levelNames)),
            },
            other: {
              type: 'string',
              pattern: noSpaceOnlyPattern,
            },
          },
        },
      },
    },
  },
};

export { uiSchema, schema };
