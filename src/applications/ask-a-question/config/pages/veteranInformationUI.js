import { uiSchema as addressUI } from '../../contactInformation/address/address';

const formFields = {
  first: 'first',
  last: 'last',
  address: 'address',
  phone: 'phone',
  email: 'email',
};

export const veteranInformationUI = {
  [formFields.first]: {
    'ui:title': "Veteran's first name",
  },
  [formFields.last]: {
    'ui:title': "Veteran's last name",
  },
  [formFields.address]: addressUI('', false, false, null, false),
  [formFields.phone]: {
    'ui:title': 'Daytime phone (area code)',
  },
  [formFields.email]: {
    'ui:title': 'Email',
  },
};
