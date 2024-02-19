import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';
import formConfig from '../../config/form';
import ConfirmationPage from '../../containers/ConfirmationPage';

const veteranData = {
  benefitSelection: {
    compensation: true,
    pension: true,
  },
  veteranFullName: {
    first: 'Jack',
    middle: 'W',
    last: 'Veteran',
    suffix: 'Jr.',
  },
  preparerIdentification: 'VETERAN',
  statementOfTruthSignature: 'Jack W Veteran',
};

const survivorData = {
  relationshipToVeteran: {
    relationshipToVeteran: 'spouse',
  },
  veteranId: {
    ssn: '454544545',
  },
  benefitSelection: {
    survivor: true,
  },
  thirdPartyPreparerRole: 'alternate',
  thirdPartyPreparerFullName: {
    first: 'Alternate',
    last: 'Signer',
  },
  preparerIdentification: 'THIRD_PARTY_SURVIVING_DEPENDENT',
  veteranFullName: {
    first: 'Jack',
    middle: 'W',
    last: 'Veteran',
  },
  statementOfTruthSignature: 'Jack W Veteran',
};

const responseNew = {
  confirmationNumber: '123456',
  expirationDate: '2024-11-30T17:56:30.512Z',
};

const responseExisting = {
  confirmationNumber: '123456',
  expirationDate: '2024-11-30T17:56:30.512Z',
  compensationIntent: {
    creationDate: '2022-12-02T13:31:51-06:00',
    expirationDate: '2023-12-02T13:31:49-06:00',
    type: 'compensation',
    status: 'active',
  },
  pensionIntent: {
    creationDate: '2022-12-02T13:31:51-06:00',
    expirationDate: '2023-12-02T13:31:49-06:00',
    type: 'pension',
    status: 'active',
  },
  survivorIntent: {
    creationDate: '2022-12-02T13:31:51-06:00',
    expirationDate: '2023-12-02T13:31:49-06:00',
    type: 'survivor',
    status: 'active',
  },
};

function makeStore(response, data) {
  return {
    form: {
      formId: formConfig.formId,
      submission: {
        response,
        timestamp: Date.now(),
      },
      data,
    },
  };
}

const STORE_VETERAN_FIRST_TIME = makeStore(responseNew, veteranData);
const STORE_SURVIVOR_FIRST_TIME = makeStore(responseNew, survivorData);
const STORE_VETERAN_EXISTING = makeStore(responseExisting, veteranData);
const STORE_SURVIVOR_EXISTING = makeStore(responseExisting, survivorData);

describe('Confirmation page', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('it should show status success and the correct name of person for a veteran submitting for the first time', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_VETERAN_FIRST_TIME)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Jack W Veteran/);
    getByText('Complete your pension claim');
    getByText('Complete your disability compensation claim');
  });

  it('it should show status success and the correct name of person for a survivor submitting for the first time', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_SURVIVOR_FIRST_TIME)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Jack W Veteran/);
    getByText('Complete your pension claim for survivors');
  });

  it('it should show status success and the correct name of person for a veteran submitting for a second time', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_VETERAN_EXISTING)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Jack W Veteran/);
    getByText('Complete your pension claim');
    getByText('Complete your disability compensation claim');
  });

  it('it should show status success and the correct name of person for a survivor submitting for a second time', () => {
    const { container, getByText } = render(
      <Provider store={mockStore(STORE_SURVIVOR_EXISTING)}>
        <ConfirmationPage />
      </Provider>,
    );
    expect(container.querySelector('va-alert')).to.have.attr(
      'status',
      'success',
    );
    getByText(/Jack W Veteran/);
    getByText('Complete your pension claim for survivors');
  });
});
