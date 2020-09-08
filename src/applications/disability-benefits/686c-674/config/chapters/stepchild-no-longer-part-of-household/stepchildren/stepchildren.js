import merge from 'lodash/merge';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { TASK_KEYS } from '../../../constants';
import { reportStepchildNotInHousehold } from '../../../utilities';
import { StepchildInfo } from './helpers';
import { isChapterFieldRequired } from '../../../helpers';

export const schema = reportStepchildNotInHousehold.properties.stepchildren;

export const uiSchema = {
  stepChildren: {
    'ui:options': {
      itemName: 'Stepchild',
      viewField: StepchildInfo,
    },
    items: {
      fullName: {
        first: {
          'ui:title': 'Stepchild’s first name',
          'ui:required': formData =>
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportStepchildNotInHousehold,
            ),
        },
        middle: {
          'ui:title': 'Stepchild’s middle name',
        },
        last: {
          'ui:title': 'Stepchild’s last name',
          'ui:required': formData =>
            isChapterFieldRequired(
              formData,
              TASK_KEYS.reportStepchildNotInHousehold,
            ),
        },
        suffix: {
          'ui:title': 'Stepchild’s suffix',
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
          },
        },
      },
      ssn: {
        ...ssnUI,
        'ui:title': 'Stepchild’s Social Security number',
        'ui:required': formData =>
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportStepchildNotInHousehold,
          ),
      },
      birthDate: merge(currentOrPastDateUI('Stepchild’s date of birth'), {
        'ui:required': formData =>
          isChapterFieldRequired(
            formData,
            TASK_KEYS.reportStepchildNotInHousehold,
          ),
      }),
    },
  },
};
