import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { AccountUpdateView } from '@@profile/components/direct-deposit/AccountUpdateView';
import { getVaButtonByText } from '~/applications/personalization/common/unitHelpers';
import { renderWithProfileReducers } from '../../unit-test-helpers';

const createInitialState = ({
  saveError,
  loadError,
  controlInformation = {
    canUpdateDirectDeposit: true,
    canUpdateAddress: true,
    corpAvailIndicator: true,
    corpRecFoundIndicator: true,
    hasNoBdnPaymentsIndicator: true,
    identityIndicator: true,
    isCompetentIndicator: true,
    indexIndicator: true,
    noFiduciaryAssignedIndicator: true,
    notDeceasedIndicator: true,
  },
} = {}) => {
  const state = {
    directDeposit: {
      controlInformation,
      paymentAccount: loadError
        ? null
        : {
            name: 'TEST BANK NAME',
            accountNumber: 'test account number',
            routingNumber: 'test routing number',
          },
      loadError: null,
      saveError: saveError || null,
      ui: {
        isEditing: true,
        isSaving: false,
      },
    },
    user: {
      profile: {
        loa: {
          current: 3,
        },
        multifactor: true,
        session: {
          authBroker: 'sis',
        },
        loading: false,
      },
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
  };
  if (loadError) {
    state.directDeposit.loadError = loadError;
  }
  return state;
};

describe('<AccountUpdateView />', () => {
  const mockStore = configureMockStore();
  let store;
  let props;

  beforeEach(() => {
    store = mockStore(createInitialState());
    props = {
      formData: {},
      formSubmit: sinon.stub(),
      setFormData: sinon.stub(),
      isSaving: false,
      saveError: null,
      onCancel: sinon.stub(),
      showCancelModal: false,
      setShowCancelModal: sinon.stub(),
      exitUpdateView: sinon.stub(),
    };
  });

  it('renders the form fields correctly', () => {
    const { getByText, container } = renderWithProfileReducers(
      <AccountUpdateView {...props} />,
      {
        initialState: createInitialState(),
      },
    );

    expect(getByText('Account')).to.exist;

    // using these query selectors since the web components don't have an accessible name
    // that is easily queryable in unit tests
    expect(container.querySelector('va-radio[label="Account type"]')).to.exist;
    expect(container.querySelector('va-radio-option[label="Checking"]')).to
      .exist;
    expect(container.querySelector('va-radio-option[label="Savings"]')).to
      .exist;
    expect(container.querySelector('va-text-input[label="Routing number"]')).to
      .exist;
    expect(container.querySelector('va-text-input[label="Account number"]')).to
      .exist;
  });

  it('renders the UpdateErrorAlert when saveError is provided', () => {
    const errorMessage =
      'We’re sorry. We couldn’t update your payment information. Please try again later.';
    props.saveError = 'Internal Server Error';

    const { getByText } = renderWithProfileReducers(
      <AccountUpdateView {...props} />,
      {
        initialState: createInitialState(),
      },
    );

    expect(getByText(errorMessage)).to.exist;
  });

  it('calls formSubmit when the form is submitted', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <AccountUpdateView
          {...props}
          formData={{
            accountType: 'Checking',
            accountNumber: '1234567890',
            routingNumber: '123456789',
          }}
        />
      </Provider>,
    );

    // we have to simulate form submission since the va-button sets submit="prevent"
    const form = getByTestId('save-direct-deposit').closest('form');
    fireEvent.submit(form);

    expect(props.formSubmit.calledOnce).to.be.true;
  });

  it('calls onCancel when the Cancel button is clicked', () => {
    const { container } = render(
      <Provider store={store}>
        <AccountUpdateView {...props} />
      </Provider>,
    );

    const button = getVaButtonByText('Cancel', { container });
    fireEvent.click(button);

    expect(props.onCancel.calledOnce).to.be.true;
  });

  it('renders the ConfirmCancelModal when showCancelModal is true', () => {
    props.showCancelModal = true;

    const { getByText, container, getByTestId } = render(
      <Provider store={store}>
        <AccountUpdateView
          {...props}
          formData={{
            accountType: 'Checking',
            accountNumber: '1234567890',
            routingNumber: '123456789',
          }}
        />
      </Provider>,
    );

    const button = getVaButtonByText('Cancel', { container });
    fireEvent.click(button);

    const modal = getByTestId('confirm-cancel-modal');
    expect(modal).to.exist;
    expect(modal).to.have.attribute('visible', 'true');

    expect(
      getByText("If you cancel, we won't save your changes.", { exact: false }),
    ).to.exist;
  });
});
