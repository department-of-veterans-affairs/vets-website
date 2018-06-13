import AsyncDisplayWidget from '../components/AsyncDisplayWidget';

import { veteranInformationViewField } from '../helpers';

export const uiSchema = {
  'ui:field': 'StringField',
  'ui:widget': AsyncDisplayWidget,
  'ui:title': 'Veteran information',
  'ui:options': {
    viewComponent: veteranInformationViewField,
    errorHeadline: '',
    errorContent: 'We’re sorry. We can’t find your personal details in our system right now. Please try again later.',
    callback: () => {
      // TODO: Actually fetch the information
      return Promise.resolve({
        fullName: {
          first: 'Sally',
          last: 'Alphonse'
        },
        ssn: '234234234',
        vaFileNumber: '345345345',
        gender: 'F',
        dateOfBirth: '1990-04-02'
      });
    }
  }
};

export const schema = {
  type: 'object',
  properties: {}
};
