import {
  titleUI,
  radioSchema,
  radioUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

const labels = {
  lessThanTwenty: 'Less than $20,000',
  twentyToThirtyFive: '$20,000-$35,000',
  thirtyFiveToFifty: '$35,001-$50,000',
  fiftyToSeventyFive: '$50,001-$75,000',
  moreThanSeventyFive: 'More than $75,000',
};

const uiSchema = {
  ...titleUI('Your current annual salary'),
  currentAnnualSalary: radioUI({
    title: "What's your current annual salary?",
    labels,
  }),
};

const schema = {
  type: 'object',
  properties: {
    currentAnnualSalary: radioSchema(Object.keys(labels)),
  },
};

export { uiSchema, schema };
