import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import DateReviewField from '../components/FormReview/DateReviewField';
import { validateFutureDate } from '../utils/validation';
import { commonDefinitions } from '../utils/imports';
import content from '../locales/en/content.json';

const INPUT_LABEL = content['dates--default-label'];
const ERR_MSG_PATTERN = content['validation--date-pattern'];
const ERR_MSG_REQUIRED = content['validation--required'];

export const futureDateUI = options => {
  const { title, errorMessages, required, validations, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };
  return {
    'ui:title': title ?? INPUT_LABEL,
    'ui:webComponentField': VaMemorableDateField,
    'ui:required': required,
    'ui:validations': validations ?? [validateFutureDate],
    'ui:errorMessages': {
      pattern: errorMessages?.pattern || ERR_MSG_PATTERN,
      required: errorMessages?.required || ERR_MSG_REQUIRED,
    },
    'ui:options': { ...uiOptions },
    'ui:reviewField': DateReviewField,
  };
};
export const futureDateSchema = commonDefinitions.date;
