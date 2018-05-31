import AsyncDisplayWidget from '../components/AsyncDisplayWidget';

import { veteranInformationViewField } from '../helpers';

export const uiSchema = {
  'ui:field': 'StringField',
  'ui:widget': AsyncDisplayWidget,
  'ui:title': 'Veteran information',
  'ui:options': {
    viewComponent: veteranInformationViewField,
    loadingMessage: 'Fetching your information...',
    callback: () => {
      // TODO: Actually fetch the information
      return Promise.resolve({
        fullName: {
          first: 'Sally',
          last: 'Alphonse'
        },
        socialSecurityNumber: '234234234',
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
