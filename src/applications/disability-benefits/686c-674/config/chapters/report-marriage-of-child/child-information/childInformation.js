import merge from 'lodash/merge';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { TASK_KEYS } from '../../../constants';
import { validateName, reportChildMarriage } from '../../../utilities';
import { isChapterFieldRequired } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    childMarriage: reportChildMarriage,
  },
};

export const uiSchema = {
  childMarriage: {
    'ui:title': 'Child who is now married',
    fullName: {
      'ui:validations': [validateName],
      first: {
        'ui:title': 'Child’s first name',
        'ui:errorMessages': { required: 'Please enter a first name' },
        'ui:required': formData =>
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportMarriageOfChildUnder18,
          ),
      },
      middle: { 'ui:title': 'Child’s middle name' },
      last: {
        'ui:title': 'Child’s last name',
        'ui:errorMessages': { required: 'Please enter a last name' },
        'ui:required': formData =>
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportMarriageOfChildUnder18,
          ),
      },
      suffix: {
        'ui:title': 'Child’s suffix',
        'ui:options': { widgetClassNames: 'form-select-medium' },
      },
    },
    dateMarried: merge(currentOrPastDateUI('Date of marriage'), {
      'ui:required': formData =>
        isChapterFieldRequired(
          formData,
          TASK_KEYS.reportMarriageOfChildUnder18,
        ),
    }),
  },
};
