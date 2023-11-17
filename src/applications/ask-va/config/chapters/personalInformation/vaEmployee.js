import React from 'react';
import { radioUI, radioSchema } from '../../schema-helpers/radioHelper';

const options = {
  yes: 'YES',
  no: 'NO',
};
// SHOULD BE RENAMED TO QUESTION
const title = <h4>Are you currently an employee of the VA?</h4>;

const pageDescription =
  "Now we'll ask for some personal information. We use this information to help us understand your question and find the answers you need.";

const vaEmployeePage = {
  uiSchema: {
    'ui:description': pageDescription,
    isVAEmployee: radioUI({ title, description: '', options }),
  },
  schema: {
    type: 'object',
    required: ['isVAEmployee'],
    properties: {
      isVAEmployee: radioSchema(Object.keys(options)),
    },
  },
};

export default vaEmployeePage;
