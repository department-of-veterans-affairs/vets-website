import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import formConfig from '../../config/form';
import ConfirmationPage from '../../containers/ConfirmationPage';
import { CLAIM_OWNERSHIPS, CLAIMANT_TYPES } from '../../definitions/constants';

const storeBase = {
  form: {
    formId: formConfig.formId,
    submission: {
      response: {
        confirmationNumber: '123456',
      },
      timestamp: Date.now(),
    },
    data: {
      witnessFullName: {
        first: 'Jack',
        middle: 'W',
        last: 'Witness',
      },
      claimantFullName: {
        first: 'Joe',
        middle: 'C',
        last: 'Claimant',
      },
      veteranFullName: {
        first: 'John',
        middle: '',
        last: 'Veteran',
      },
    },
  },
};

describe('Confirmation page', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('it should show status success', () => {
    const { container } = render(
      <Provider store={mockStore(storeBase)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
  });

  it('should show the witness name if it was a third party', () => {
    const store = { ...storeBase };
    store.form.data.claimOwnership = CLAIM_OWNERSHIPS.THIRD_PARTY;
    store.form.data.claimantType = CLAIMANT_TYPES.VETERAN;

    const { getByText } = render(
      <Provider store={mockStore(store)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    getByText(/Jack W Witness/);
  });

  it('should show the witness name if it was a third party 2', () => {
    const store = { ...storeBase };
    store.form.data.claimOwnership = CLAIM_OWNERSHIPS.THIRD_PARTY;
    store.form.data.claimantType = CLAIMANT_TYPES.NON_VETERAN;

    const { getByText } = render(
      <Provider store={mockStore(store)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    getByText(/Jack W Witness/);
  });

  it('should show the claimant name if it is a self claim but a nonveteran', () => {
    const store = { ...storeBase };
    store.form.data.claimOwnership = CLAIM_OWNERSHIPS.SELF;
    store.form.data.claimantType = CLAIMANT_TYPES.NON_VETERAN;

    const { getByText } = render(
      <Provider store={mockStore(store)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    getByText(/Joe C Claimant/);
  });

  it('should show the veteran name if it is a self claim', () => {
    const store = { ...storeBase };
    store.form.data.claimOwnership = CLAIM_OWNERSHIPS.SELF;
    store.form.data.claimantType = CLAIMANT_TYPES.VETERAN;

    const { getByText } = render(
      <Provider store={mockStore(store)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    getByText(/John Veteran/);
  });
});
