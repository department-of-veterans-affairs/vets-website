import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import { labels } from './applicantDescription';

const { veteranFullName, veteranDesc } = fullSchema10282.properties;
const yourName = (
  <h3 className="vads-u-margin-top--neg2p5 full-name vads-u-color--base">
    Your name
  </h3>
);
// const getQueryParam = param => {
//   const searchParams = new URLSearchParams(window.location.search);

//   return searchParams.get(param);
// };
// const paramValue = getQueryParam('yourParam');

const schema = {
  type: 'object',
  required: ['veteranFullName'],
  properties: {
    veteranFullName,
  },
};

const uiSchema = {
  veteranFullName: {
    'ui:title': yourName,
    first: {
      'ui:title': 'First name',
      'ui:errorMessages': {
        required: 'Please enter a first name',
      },
    },
    middle: {
      'ui:title': 'Middle name',
    },
    last: {
      'ui:title': 'Last name',
      'ui:errorMessages': {
        required: 'Please enter a last name',
      },
    },
    suffix: {
      'ui:options': {
        classNames: 'hidden',
        hideOnReviewIfFalse: true,
      },
    },
  },
};

if (localStorage.getItem('isReview') === 'true') {
  schema.required.push('veteranDesc');
  schema.properties.veteranDesc = { ...veteranDesc, enum: Object.keys(labels) };

  // Add `veteranDesc` to the uiSchema
  uiSchema.veteranDesc = {
    'ui:title': 'Which one best describes you?',
    'ui:widget': 'radio',
    'ui:errorMessages': {
      required: 'You must select one of the options',
    },
    'ui:options': {
      labels,
      keepInPageOnReview: true,
    },
    'ui:reviewWidget': 'radio',
  };
}

export { uiSchema, schema };
