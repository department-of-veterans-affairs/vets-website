import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ApplicantMailingAddressLoggedIn from '../../pages/applicantMailingAddressLoggedIn';

describe('Medallions applicantMailingAddressLoggedIn', () => {
  const mockStore = configureStore([]);

  const defaultProps = {
    data: {
      applicantMailingAddress: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
      },
    },
    onReviewPage: false,
    goBack: () => {},
    goForward: () => {},
    goToPath: () => {},
    NavButtons: () => <div>Nav Buttons</div>,
    contentBeforeButtons: <div />,
    contentAfterButtons: <div />,
  };

  it('should render', () => {
    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddressLoggedIn {...defaultProps} />
      </Provider>,
    );

    expect(form.find('ApplicantMailingAddressLoggedIn').length).to.equal(1);
    form.unmount();
  });

  it('should render ApplicantMailingAddressCard component', () => {
    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddressLoggedIn {...defaultProps} />
      </Provider>,
    );

    expect(form.find('ApplicantMailingAddressCard').length).to.equal(1);
    form.unmount();
  });

  it('should handle edit flag in data', () => {
    const store = mockStore({});
    const propsWithEditFlag = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        'view:loggedInEditAddress': true,
      },
    };

    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddressLoggedIn {...propsWithEditFlag} />
      </Provider>,
    );

    expect(form.find('ApplicantMailingAddressLoggedIn').length).to.equal(1);
    form.unmount();
  });
});
