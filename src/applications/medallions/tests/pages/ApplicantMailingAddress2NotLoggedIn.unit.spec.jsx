import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import ApplicantMailingAddress2NotLoggedIn from '../../pages/applicantMailingAddress2NotLoggedIn';

describe('Medallions ApplicantMailingAddress2NotLoggedIn', () => {
  const mockStore = configureStore([]);

  const defaultProps = {
    data: {
      address: {
        street: '789 Org Ave',
        street2: 'Suite 200',
        city: 'Capital City',
        state: 'TX',
        postalCode: '73301',
        country: 'USA',
      },
    },
    goToPath: sinon.spy(),
    title: "Your organization's mailing address",
    onReviewPage: true,
    editPage: false,
    setEditState: sinon.spy(),
  };

  it('should render on review page', () => {
    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddress2NotLoggedIn {...defaultProps} />
      </Provider>,
    );

    expect(form.find('ApplicantMailingAddress2NotLoggedIn').length).to.equal(1);
    expect(form.text()).to.include('789 Org Ave');
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
        <ApplicantMailingAddress2NotLoggedIn {...propsNotOnReview} />
      </Provider>,
    );

    expect(form.find('.form-review-panel-page').length).to.equal(0);
    form.unmount();
  });

  it('should display edit button on review page', () => {
    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddress2NotLoggedIn {...defaultProps} />
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
        <ApplicantMailingAddress2NotLoggedIn {...props} />
      </Provider>,
    );

    const editButton = form.find('va-button[text="Edit"]').first();
    editButton.simulate('click');

    // Check if goToPath was called with correct path
    expect(
      goToPath.calledWith('/applicant-mailing-address-2/edit', { force: true }),
    ).to.be.true;

    form.unmount();
  });

  it('should display address on separate lines', () => {
    const store = mockStore({});
    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddress2NotLoggedIn {...defaultProps} />
      </Provider>,
    );

    const reviewRows = form.find('.review-row');
    expect(reviewRows.length).to.be.greaterThan(0);

    const text = form.text();
    expect(text).to.include('789 Org Ave');
    expect(text).to.include('Suite 200');
    expect(text).to.include('Capital City');
    expect(text).to.include('TX');
    expect(text).to.include('73301');

    form.unmount();
  });

  it('should handle missing street2', () => {
    const store = mockStore({});
    const propsWithoutStreet2 = {
      ...defaultProps,
      data: {
        address: {
          street: '789 Org Ave',
          city: 'Capital City',
          state: 'TX',
          postalCode: '73301',
          country: 'USA',
        },
      },
    };

    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddress2NotLoggedIn {...propsWithoutStreet2} />
      </Provider>,
    );

    const text = form.text();
    expect(text).to.include('789 Org Ave');
    expect(text).to.include('Capital City');
    expect(text).to.not.include('Street address line 2');

    form.unmount();
  });

  it('should display international address correctly', () => {
    const store = mockStore({});
    const propsWithInternational = {
      ...defaultProps,
      data: {
        address: {
          street: '999 International Blvd',
          city: 'Toronto',
          postalCode: 'M5H 2N2',
          country: 'CAN',
        },
      },
    };

    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddress2NotLoggedIn {...propsWithInternational} />
      </Provider>,
    );

    const text = form.text();
    expect(text).to.include('999 International Blvd');
    expect(text).to.include('Toronto');
    expect(text).to.include('CAN');

    form.unmount();
  });

  it('should clear edit flag on mount', () => {
    const store = mockStore({});
    const propsWithEditFlag = {
      ...defaultProps,
      data: {
        ...defaultProps.data,
        'view:notLoggedInEditAddress2': true,
      },
    };

    const form = mount(
      <Provider store={store}>
        <ApplicantMailingAddress2NotLoggedIn {...propsWithEditFlag} />
      </Provider>,
    );

    // Verify component rendered
    expect(form.find('ApplicantMailingAddress2NotLoggedIn').length).to.equal(1);

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
        <ApplicantMailingAddress2NotLoggedIn {...props} />
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
