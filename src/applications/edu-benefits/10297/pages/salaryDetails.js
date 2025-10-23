import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const salaryRanges = {
  lessThanTwenty: 'Less than $20,000',
  twentyToThirtyFive: 'Between $20,001 and $35,000',
  thirtyFiveToFifty: 'Between $35,001 and $50,000',
  fiftyToSeventyFive: 'Between $50,001 and $75,000',
  moreThanSeventyFive: 'More than $75,000',
};

const uiSchema = {
  ...titleUI('Your current annual salary'),
  currentSalary: {
    ...radioUI({
      title: "What's your current annual salary?",
      labels: salaryRanges,
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    currentSalary: radioSchema(Object.keys(salaryRanges)),
  },
};

export { schema, uiSchema };
