const formFields = {
  first: 'first',
  last: 'last',
  phone: 'phone',
  email: 'email',
};

export const uiSchema = {
  [formFields.first]: {
    'ui:title': "Veteran's first name",
  },
  [formFields.last]: {
    'ui:title': "Veteran's last name",
  },
  [formFields.phone]: {
    'ui:title': 'Daytime phone (area code)',
  },
  [formFields.email]: {
    'ui:title': 'Email',
  },
};
