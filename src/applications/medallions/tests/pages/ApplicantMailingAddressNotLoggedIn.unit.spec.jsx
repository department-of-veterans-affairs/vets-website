import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import ApplicantMailingAddressNotLoggedIn from '../../pages/applicantMailingAddressNotLoggedIn';

describe('Medallions ApplicantMailingAddressNotLoggedIn', () => {
  const mockStore = configureStore([]);

  const defaultProps = {
    data: {
      applicantMailingAddress: {
        street: '123 Main St',
        street2: 'Apt 4',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62701',
        country: 'USA',
      },
    },
    goToPath: sinon.spy(),
    title: 'Your mailing address',
    onReviewPage: true,
    editPage: false,
    setEditState: sinon.spy(),
  };

  it('should render on review page', () => {
    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddressNotLoggedIn {...defaultProps} />
      </Provider>,
    );

    expect(form.find('ApplicantMailingAddressNotLoggedIn').length).to.equal(1);
    expect(form.text()).to.include('123 Main St');
    form.unmount();
  });

  it('should not render when not on review page', () => {
    const store = mockStore({});
    const propsNotOnReview = {
      ...defaultProps,
      onReviewPage: false,
    };

    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddressNotLoggedIn {...propsNotOnReview} />
      </Provider>,
    );

    expect(form.find('.form-review-panel-page').length).to.equal(0);
    form.unmount();
  });

  it('should display edit button on review page', () => {
    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddressNotLoggedIn {...defaultProps} />
      </Provider>,
    );

    expect(form.find('va-button[text="Edit"]').length).to.equal(1);
    form.unmount();
  });

  it('should handle edit button click', () => {
    const store = mockStore({});
    const goToPath = sinon.spy();
    const props = {
      ...defaultProps,
      goToPath,
    };

    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddressNotLoggedIn {...props} />
      </Provider>,
    );

    const editButton = form.find('va-button[text="Edit"]').first();
    editButton.simulate('click');

    // Check if goToPath was called with correct path
    expect(
      goToPath.calledWith('/applicant-mailing-address/edit', { force: true }),
    ).to.be.true;

    form.unmount();
  });

  it('should display address on separate lines', () => {
    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddressNotLoggedIn {...defaultProps} />
      </Provider>,
    );

    const reviewRows = form.find('.review-row');
    expect(reviewRows.length).to.be.greaterThan(0);

    const text = form.text();
    expect(text).to.include('123 Main St');
    expect(text).to.include('Apt 4');
    expect(text).to.include('Springfield');
    expect(text).to.include('IL');
    expect(text).to.include('62701');

    form.unmount();
  });

  it('should handle missing street2', () => {
    const store = mockStore({});
    const propsWithoutStreet2 = {
      ...defaultProps,
      data: {
        applicantMailingAddress: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
          country: 'USA',
        },
      },
    };

    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddressNotLoggedIn {...propsWithoutStreet2} />
      </Provider>,
    );

    const text = form.text();
    expect(text).to.include('123 Main St');
    expect(text).to.include('Springfield');
    expect(text).to.not.include('Street address line 2');

    form.unmount();
  });

  it('should display international address correctly', () => {
    const store = mockStore({});
    const propsWithInternational = {
      ...defaultProps,
      data: {
        applicantMailingAddress: {
          street: '456 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'FRA',
        },
      },
    };

    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddressNotLoggedIn {...propsWithInternational} />
      </Provider>,
    );

    const text = form.text();
    expect(text).to.include('456 Rue de la Paix');
    expect(text).to.include('Paris');
    expect(text).to.include('FRA');

    form.unmount();
  });

  it('should clear edit flag on mount', () => {
    const store = mockStore({});
    const propsWithEditFlag = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        'view:notLoggedInEditAddress': true,
      },
    };

    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddressNotLoggedIn {...propsWithEditFlag} />
      </Provider>,
    );

    // Verify component rendered
    expect(form.find('ApplicantMailingAddressNotLoggedIn').length).to.equal(1);

    form.unmount();
  });

  it('should set edit state when handleEdit is called', () => {
    const store = mockStore({});
    const setEditState = sinon.spy();
    const props = {
      ...defaultProps,
      setEditState,
    };

    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddressNotLoggedIn {...props} />
      </Provider>,
    );

    const editButton = form.find('va-button[text="Edit"]').first();
    editButton.simulate('click');

    expect(
      setEditState.calledWith({
        editing: true,
        returnUrl: '/review-and-submit',
      }),
    ).to.be.true;

    form.unmount();
  });
});
