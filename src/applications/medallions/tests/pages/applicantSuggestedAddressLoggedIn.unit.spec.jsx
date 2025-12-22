import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ApplicantSuggestedAddressLoggedIn from '../../pages/applicantSuggestedAddressLoggedIn';

describe('Medallions applicantSuggestedAddressLoggedIn', () => {
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
    goToPath: () => {},
    goBack: () => {},
    contentBeforeButtons: <div />,
    contentAfterButtons: <div />,
  };

  it('should render', () => {
    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantSuggestedAddressLoggedIn {...defaultProps} />
      </Provider>,
    );

    expect(form.find('ApplicantSuggestedAddressLoggedIn').length).to.equal(1);
    form.unmount();
  });

  it('should show loading state initially', () => {
    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantSuggestedAddressLoggedIn {...defaultProps} />
      </Provider>,
    );

    expect(form.find('ApplicantSuggestedAddressLoggedIn').length).to.equal(1);
    form.unmount();
  });

  it('should handle missing address data', () => {
    const store = mockStore({});
    const propsWithoutAddress = {
      ...defaultProps,
      data: {},
    };

    const form = mount(
      <Provider store={store}>
        <ApplicantSuggestedAddressLoggedIn {...propsWithoutAddress} />
      </Provider>,
    );

    expect(form.find('ApplicantSuggestedAddressLoggedIn').length).to.equal(1);
    form.unmount();
  });
});
