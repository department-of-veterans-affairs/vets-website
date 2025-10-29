import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import {
  titleUI,
  radioUI,
  textUI,
  radioSchema,
  currencyUI,
  currencySchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const recipientTypeLabels = {
  SURVIVING_SPOUSE: 'Surviving spouse',
  VETERANS_CHILD: 'Veteran’s child',
  CUSTODIAN: 'Custodian',
  CUSTODIAN_SPOUSE: 'Custodian’s spouse',
  OTHER: 'Other',
};

const typeOfIncomeLabels = {
  SOCIAL_SECURITY: 'Social Security',
  INTEREST_DIVIDEND: 'Interest or dividend income',
  CIVIL_SERVICE: 'Civil Service',
  PENSION_RETIREMENT: 'Pension or retirement income',
  OTHER: 'Other income',
};

const uiSchema = {
  ...titleUI('Monthly gross income details'),
  whoReceives: radioUI({
    title: 'Who receives this income?',
    labels: recipientTypeLabels,
  }),
  fullName: textUI({
    title: 'Full name of the person who receives this income',
    expandUnder: 'whoReceives',
    expandUnderCondition: field => field === 'OTHER',
    required: formData => formData?.whoReceives === 'OTHER',
  }),
  typeOfIncome: radioUI({
    title: 'What type of income?',
    labels: typeOfIncomeLabels,
  }),
  otherTypeExplanation: textUI({
    title: 'Tell us the type of income',
    expandUnder: 'typeOfIncome',
    expandUnderCondition: field => field === 'OTHER',
    required: formData => formData?.typeOfIncome === 'OTHER',
  }),
  payer: {
    'ui:title': 'Who pays this income?',
    'ui:webComponentField': VaTextInputField,
    'ui:options': {
      hint:
        'Enter the name of a government agency, a company, or another organization.',
      classNames: 'vads-u-margin-bottom--2',
    },
  },
  amount: currencyUI('What’s the monthly amount of income?'),
};

const schema = {
  type: 'object',
  required: ['whoReceives', 'typeOfIncome', 'payer', 'amount'],
  properties: {
    whoReceives: radioSchema(Object.keys(recipientTypeLabels)),
    fullName: { type: 'string' },
    typeOfIncome: radioSchema(Object.keys(typeOfIncomeLabels)),
    payer: { type: 'string' },
    otherTypeExplanation: { type: 'string' },
    amount: currencySchema,
  },
};

export default {
  uiSchema,
  schema,
};
