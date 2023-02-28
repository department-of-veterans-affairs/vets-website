import SpousePayrollDeductionInputList from '../../../components/SpousePayrollDeductionInputList';

export const uiSchema = {
  currEmployment: {
    'ui:field': SpousePayrollDeductionInputList,
  },
};

export const schema = {
  type: 'object',
  properties: {
    currEmployment: {
      type: 'array',
      items: {
        type: 'object',
        properties: {},
      },
    },
  },
};
