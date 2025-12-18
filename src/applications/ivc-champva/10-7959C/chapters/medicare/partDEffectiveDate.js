import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { nameWording, privWrapper } from '../../../shared/utilities';
import { validateDateRange } from '../../utils/validation';

const PAGE_TITLE = ({ formData }) => {
  const name = nameWording(formData, undefined, undefined, true);
  return privWrapper(`${name} Medicare Part D effective date`);
};

const VALIDATIONS = [
  (errors, data) =>
    validateDateRange(errors, data, {
      startDateKey: 'medicarePartDEffectiveDate',
      endDateKey: 'medicarePartDTerminationDate',
    }),
];

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE),
    medicarePartDEffectiveDate: currentOrPastDateUI({
      title: 'Medicare Part D effective date',
      hint: 'This information is at the top of the card.',
    }),
    medicarePartDTerminationDate: currentOrPastDateUI({
      title: 'Medicare Part D termination date',
      hint: 'Only enter this date if the plan is inactive.',
    }),
    'ui:validations': VALIDATIONS,
  },
  schema: {
    type: 'object',
    required: ['medicarePartDEffectiveDate'],
    properties: {
      medicarePartDEffectiveDate: currentOrPastDateSchema,
      medicarePartDTerminationDate: currentOrPastDateSchema,
    },
  },
};
