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
        'ui:title': 'First Name',
        'ui:required': () => true,
      },
      middle: {
        'ui:title': 'Middle Name',
      },
      last: {
        'ui:title': 'Last Name',
        'ui:required': () => true,
      },
      suffix: {
        'ui:title': 'Suffix',
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
        },
      },
    },
    ssn: { ...ssnUI, 'ui:required': () => true },
  },
};
