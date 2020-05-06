import merge from 'lodash/merge';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { isChapterFieldRequired } from '../../../helpers';
import { TASK_KEYS } from '../../../constants';
import { addChild } from '../../../utilities';
import { childInfo } from './helpers';

export const schema = addChild.properties.addChildInformation;

export const uiSchema = {
  childrenToAdd: {
    'ui:options': {
      itemName: 'Child',
      viewField: childInfo,
    },
    items: {
      fullName: {
        first: {
          'ui:title': 'Child’s first name',
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addChild),
        },
        middle: {
          'ui:title': 'Child’s middle name',
        },
        last: {
          'ui:title': 'Child’s last name',
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addChild),
        },
        suffix: {
          'ui:title': 'Child’s suffix',
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
          },
        },
      },
      ssn: {
        ...ssnUI,
        'ui:title': 'Child’s Social Security number',
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addChild),
      },
      birthDate: merge(currentOrPastDateUI("Child's date of birth"), {
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addChild),
      }),
    },
  },
};
