import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';

import PaymentReviewView from '../../../0994/components/PaymentReviewView';

const store = {
  getState: () => ({}),
  dispatch: () => ({}),
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

describe('<PaymentReviewView>', () => {
  it('should render new bank info', () => {
    const component = shallow(
      <Provider store={store}>
        <PaymentReviewView formData="savings" name="accountType" />
      </Provider>,
    );

    component.unmount();
  });
  it('should render prefill bank info', () => {
    const component = shallow(
      <Provider store={store}>
        <PaymentReviewView formData={undefined} name="accountType" />
      </Provider>,
    );

    component.unmount();
  });
});
