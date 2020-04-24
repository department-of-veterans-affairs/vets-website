import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { isChapterFieldRequired } from '../../../helpers';
import { addChild } from '../../../utilities';
import { childInfo } from './helpers';
import { merge } from 'lodash/fp';

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
            isChapterFieldRequired(formData, 'addChild'),
        },
        middle: {
          'ui:title': 'Child’s middle name',
        },
        last: {
          'ui:title': 'Child’s last name',
          'ui:required': formData =>
            isChapterFieldRequired(formData, 'addChild'),
        },
        suffix: {
          'ui:title': 'Child’s suffix',
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
          },
        },
      },
      ssn: {
        'ui:title': 'Child’s Social Security Number',
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
        },
        'ui:required': formData => isChapterFieldRequired(formData, 'addChild'),
      },
      birthDate: merge(currentOrPastDateUI("Child's date of birth"), {
        'ui:required': formData => isChapterFieldRequired(formData, 'addChild'),
      }),
    },
  },
};
