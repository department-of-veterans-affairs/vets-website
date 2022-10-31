import PayrollDeductionInputList from '../../../components/PayrollDeductionInputList';
import { SelectedJobEmployerTitle } from '../../../components/SelectedJobEmployerTitle';

export const uiSchema = {
  'ui:title': SelectedJobEmployerTitle,
  currEmployment: {
    'ui:field': PayrollDeductionInputList,
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
