import React from 'react';

const notEligibleText = props => {
  console.log(props);
  return (
    <>
      <p>You are not eligible</p>
    </>
  );
};

export const schema = {
  notEligible: {
    type: 'object',
    properties: {
      eligibility: {
        type: 'string',
      },
    },
  },
};

export const uiSchema = {
  notEligible: {
    eligibility: {
      'ui:widget': notEligibleText,
    },
  },
};
