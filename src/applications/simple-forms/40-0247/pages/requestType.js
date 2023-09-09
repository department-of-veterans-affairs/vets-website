import React from 'react';

// import {
//   radioSchema,
//   radioUI,
// } from 'platform/forms-system/src/js/web-component-patterns/radioPattern.jsx';

/* @type {PageSchema} */
export default {
  uiSchema: {
    requestType: {
      'ui:title': (
        <span className="custom-label-h3">
          Is this your first time requesting a Presidential Memorial
          Certificate?
        </span>
      ),
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          first:
            'Yes, this is my first time requesting a presidential memorial certificate',
          replacement:
            'No, I need to replace a presidential memorial certificate that was incorrect, damaged, or never received',
          copies:
            'No, I’ve requested a presidential memorial certificate before, and I need more copies',
        },
      },
      'ui:errorMessages': {
        required: 'Please select a request type',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['requestType'],
    properties: {
      requestType: {
        type: 'string',
        enum: ['first', 'replacement', 'copies'],
      },
    },
  },

  // TODO: Find out how label can be custom-styled as H3
  // uiSchema: {
  //   requestType: radioUI({
  //     title: 'Do you receive VA disability compensation?',
  //     description: null,
  //     labels: {
  //       first: 'Yes, for a service-connected disability rating of up to 40%',
  //       replacement:
  //         'Yes, for a service-connected disability rating of 50% or higher',
  //       copies: 'No',
  //     },
  //   }),
  // },
  // schema: {
  //   type: 'object',
  //   required: ['requestType'],
  //   properties: {
  //     requestType: radioSchema(['first', 'replacement', 'copies']),
  //   },
  // },
};
