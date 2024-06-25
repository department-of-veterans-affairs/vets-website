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
    'ui:title': 'Child Information',
    'ui:options': {
      itemName: 'Child',
      viewField: childInfo,
      keepInPageOnReview: true,
      customTitle: ' ',
    },
    items: {
      fullName: {
        'ui:options': {
          useDlWrap: true,
        },
        first: {
          'ui:title': 'Child’s first name',
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addChild),
          'ui:options': {
            useDlWrap: true,
          },
          'ui:errorMessages': {
            pattern: 'This field accepts alphabetic characters only',
          },
        },
        middle: {
          'ui:title': 'Child’s middle name',
          'ui:options': {
            useDlWrap: true,
            hideEmptyValueInReview: true,
          },
          'ui:errorMessages': {
            pattern: 'This field accepts alphabetic characters only',
          },
        },
        last: {
          'ui:title': 'Child’s last name',
          'ui:required': formData =>
            isChapterFieldRequired(formData, TASK_KEYS.addChild),
          'ui:options': {
            useDlWrap: true,
          },
          'ui:errorMessages': {
            pattern: 'This field accepts alphabetic characters only',
          },
        },
        suffix: {
          'ui:title': 'Child’s suffix',
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
            useDlWrap: true,
            hideEmptyValueInReview: true,
          },
        },
      },
      ssn: {
        ...ssnUI,
        'ui:title': 'Child’s Social Security number',
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addChild),
        'ui:options': {
          useDlWrap: true,
          widgetClassNames: 'usa-input-medium',
        },
      },
      birthDate: merge(currentOrPastDateUI("Child's date of birth"), {
        'ui:required': formData =>
          isChapterFieldRequired(formData, TASK_KEYS.addChild),
        'ui:options': {
          useDlWrap: true,
        },
      }),
    },
  },
};
