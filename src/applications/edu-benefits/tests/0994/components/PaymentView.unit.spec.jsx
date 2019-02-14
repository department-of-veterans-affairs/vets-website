import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';

import PaymentView from '../../../0994/components/PaymentView';

const store = {
  getState: () => ({}),
  dispatch: () => ({}),
  subscribe: () => ({}),
  form: {
    data: {
      prefillBankAccount: {
        bankAccountType: 'checking',
        bankAccountNumber: '*********1234',
        bankRoutingNumber: '*****2115',
        bankName: 'Comerica',
      },
    },
  },
};

describe('<PaymentView>', () => {
  it('should render', () => {
    const component = shallow(
      <Provider store={store}>
        <PaymentView formData originalData />
      </Provider>,
    );

    component.unmount();
  });
});
