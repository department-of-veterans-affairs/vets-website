import React from 'react';
import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const employmentFocusOptions = {
  computerProgramming: 'Computer programming',
  computerSoftware: 'Computer software',
  mediaApplication: 'Media application',
  dataProcessing: 'Data processing',
  informationSciences: 'Information sciences',
  other: 'Other',
};

const uiSchema = {
  ...titleUI({
    title: 'Your main area of focus',
    description: (
      <p className="vads-u-margin-y--0">
        If your area of focus does not appear below, please chose the closest
        approximation
      </p>
    ),
  }),
  technologyAreaOfFocus: {
    ...radioUI({
      title: 'What’s your main area of focus in the technology industry?',
      required: formData => formData.isInTechnologyIndustry === true,
      labels: employmentFocusOptions,
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    technologyAreaOfFocus: radioSchema(Object.keys(employmentFocusOptions)),
  },
};
export { schema, uiSchema };
