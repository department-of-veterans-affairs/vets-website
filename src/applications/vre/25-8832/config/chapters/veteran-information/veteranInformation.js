import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { veteranInformation } from '../../utilities';

export const schema = {
  type: 'object',
  properties: {
    veteranInformation,
  },
};

export const uiSchema = {
  veteranInformation: {
    fullName: {
      first: {
        'ui:title': 'Your sponsor’s first name',
        'ui:required': () => true,
      },
      middle: {
        'ui:title': 'Your sponsor’s middle name',
        'ui:options': {
          hideEmptyValueInReview: true,
        },
      },
      last: {
        'ui:title': 'Your sponsor’s last name',
        'ui:required': () => true,
      },
      suffix: {
        'ui:title': 'Suffix',
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
          hideEmptyValueInReview: true,
        },
      },
    },
    ssn: {
      ...ssnUI,
      'ui:required': () => true,
      'ui:title': 'Your sponsor’s Social Security Number',
    },
  },
};
