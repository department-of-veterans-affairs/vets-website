import React from 'react';
import { render } from '@testing-library/react';
import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import EditAddress from '../../components/EditAddress';

const title = 'Edit shipping address';
const props = {
  data: {
    permanentAddress: {
      'view:militaryBaseDescription': {},
      country: 'USA',
      street: '101 EXAMPLE STREET',
      street2: 'APT 2',
      city: 'KANSAS CITY',
      state: 'MO',
      postalCode: '64117',
    },
  },
  uiSchema: {
    ...titleUI('Edit shipping address'),
    'ui:objectViewField': () => {},
    permanentAddress: addressUI({ omit: ['street3'] }),
  },
  schema: {
    type: 'object',
    properties: {
      permanentAddress: addressSchema({ omit: ['street3'] }),
    },
    required: ['permanentAddress'],
  },
};

const setup = () => {
  return render(<EditAddress {...props} />);
};

describe('EditAddress', () => {
  it('renders', () => {
    const { getByRole } = setup();
    getByRole('heading', { level: 3, name: title });
  });
});
