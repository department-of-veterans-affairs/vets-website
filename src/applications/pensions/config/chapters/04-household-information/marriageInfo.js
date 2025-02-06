import ArrayCountWidget from 'platform/forms-system/src/js/widgets/ArrayCountWidget';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { isMarried } from './helpers';
import { marriages } from '../../definitions';

export default {
  title: 'Marriage history',
  path: 'household/marriage-info',
  depends: isMarried,
  uiSchema: {
    ...titleUI('Marriage history'),
    marriages: {
      'ui:title': 'How many times have you been married?',
      'ui:widget': ArrayCountWidget,
      'ui:field': 'StringField',
      'ui:options': {
        showFieldLabel: 'label',
        keepInPageOnReview: true,
        useDlWrap: true,
        classNames: 'vads-u-margin-top--3',
      },
      'ui:errorMessages': {
        required: 'You must enter at least 1 marriage',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['marriages'],
    properties: {
      marriages,
    },
  },
};
