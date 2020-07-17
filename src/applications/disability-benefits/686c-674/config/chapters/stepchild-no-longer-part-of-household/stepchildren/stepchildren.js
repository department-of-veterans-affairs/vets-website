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
            isChapterFieldRequired(formData, 'reportStepchildNotInHousehold'),
        },
        middle: {
          'ui:title': 'Stepchild’s middle name',
        },
        last: {
          'ui:title': 'Stepchild’s last name',
          'ui:required': formData =>
            isChapterFieldRequired(formData, 'reportStepchildNotInHousehold'),
        },
        suffix: {
          'ui:title': 'Stepchild’s suffix',
          'ui:options': {
            widgetClassNames: 'usa-input-medium',
          },
        },
      },
    },
  },
};
