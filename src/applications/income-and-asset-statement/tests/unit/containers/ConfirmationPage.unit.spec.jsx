import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import formConfig from '../../../config/form';
import ConfirmationPage from '../../../containers/ConfirmationPage';

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
      claimantFullName: {
        first: 'Jane',
        middle: 'C',
        last: 'ClaimantLastName',
      },
      veteranFullName: {
        first: 'John',
        middle: '',
        last: 'VeteranLastName',
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

  it('should not show the claimant name if the applicant is the veteran', () => {
    const store = { ...storeBase };

    const { queryByText } = render(
      <Provider store={mockStore(store)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    expect(queryByText(/Jane/)).to.be.null;
    expect(queryByText(/ClaimantLastName/)).to.be.null;
  });

  it('should show the claimant name if the applicant is not the veteran', () => {
    const store = { ...storeBase };
    store.form.data['view:applicantIsVeteran'] = false;

    const { getByText } = render(
      <Provider store={mockStore(store)}>
        <ConfirmationPage route={{ formConfig }} />
      </Provider>,
    );

    getByText(/Jane/);
    getByText(/ClaimantLastName/);
  });
});
