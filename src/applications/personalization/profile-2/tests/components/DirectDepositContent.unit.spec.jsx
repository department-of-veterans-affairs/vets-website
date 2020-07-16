import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

import { resetFetch } from 'platform/testing/unit/helpers';

import * as mocks from '../../msw-mocks';
import { renderWithProfileReducers } from '../unit-test-helpers';

import DirectDepositContent from '../../components/direct-deposit/DirectDepositContent';

const paymentAccount = {
  accountType: 'Checking',
  financialInstitutionName: 'Bank of EVSS',
  accountNumber: '****5678',
  financialInstitutionRoutingNumber: '*****0021',
};

const emptyPaymentAccount = {
  accountType: '',
  financialInstitutionName: null,
  accountNumber: '',
  financialInstitutionRoutingNumber: '',
};

function createBasicInitialState() {
  return {
    user: {
      profile: {
        loa: {
          current: 3,
          highest: 3,
        },
        multifactor: true,
      },
    },
    vaProfile: {
      paymentInformation: {
        responses: [
          {
            paymentAccount,
          },
        ],
      },
      paymentInformationUiState: {},
    },
  };
}

function fillOutAndSubmitBankInfoForm(view) {
  const accountNumberField = view.getByLabelText(/account number/i);
  const routingNumberField = view.getByLabelText(/routing/i);
  const accountTypeSelect = view.getByLabelText(/account type/i);
  const submitButton = view.getByRole('button', { name: /update/i });

  userEvent.type(accountNumberField, '123123123');
  userEvent.type(routingNumberField, '456456456');
  userEvent.selectOptions(accountTypeSelect, ['Savings']);
  userEvent.click(submitButton);
}

function findSetUpBankInfoButton(view) {
  return view.queryByRole('button', {
    name: /please add your bank information/i,
  });
}

function findEditBankInfoButton(view) {
  return view.getByRole('button', {
    name: /edit your direct deposit bank information/i,
  });
}

function findPaymentHistoryLink(view) {
  return view.queryByRole('link', { name: /view your payment history/i });
}

function findCancelEditButton(view) {
  return view.getByRole('button', {
    name: /cancel/i,
  });
}

describe('DirectDepositContent', () => {
  let server;
  before(() => {
    // before we can use msw, we need to make sure that global.fetch has been
    // restored and is not longer a sinon stub.
    resetFetch();
    server = setupServer(...mocks.updateDirectDepositSuccess);
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  after(() => {
    server.close();
  });

  const ui = (
    <MemoryRouter>
      <DirectDepositContent />
    </MemoryRouter>
  );

  let initialState;
  it('should render nothing if the user is LOA1', () => {
    initialState = createBasicInitialState();
    initialState.user.profile = {
      loa: {
        current: 1,
        highest: 3,
      },
    };

    const { container } = renderWithProfileReducers(ui, {
      initialState,
    });
    expect(container).to.be.empty;
  });
  it('should render nothing if the user does not have 2FA set up', () => {
    initialState = createBasicInitialState();
    initialState.user.profile.multifactor = false;

    const { container } = renderWithProfileReducers(ui, {
      initialState,
    });
    expect(container).to.be.empty;
  });
  describe('when bank info is not set up', () => {
    let view;
    beforeEach(() => {
      initialState = createBasicInitialState();
      initialState.vaProfile.paymentInformation.responses[0].paymentAccount = emptyPaymentAccount;
      // Using queries on RTL `screen` does not work for some reason. So I'm just
      // storing the entire response from `render` as `view` so I can treat `view`
      // like I would `screen`
      view = renderWithProfileReducers(ui, {
        initialState,
      });
    });
    it('should not show the view payment history link', () => {
      expect(findPaymentHistoryLink(view)).to.be.null;
    });
    it('should not show bank info', () => {
      expect(view.queryByText(paymentAccount.financialInstitutionName)).to.be
        .null;
      expect(view.queryByText(paymentAccount.accountNumber)).to.be.null;
      expect(view.queryByText(paymentAccount.accountType)).to.be.null;
      expect(view.getByText(/been the victim of bank fraud/i)).to.exist;
    });
    it('should allow entering and exiting edit mode', async () => {
      userEvent.click(findSetUpBankInfoButton(view));
      // ensure that the edit form is visible
      expect(await view.findByLabelText(/account number/i)).to.exist;

      // find and click on the cancel button
      userEvent.click(findCancelEditButton(view));

      // ensure that the edit form was removed
      expect(view.queryByRole('form')).to.be.null;
    });
    it('should handle adding bank info', async () => {
      userEvent.click(findSetUpBankInfoButton(view));

      expect(await view.findByRole('form')).to.exist;

      // fill out form info
      fillOutAndSubmitBankInfoForm(view);

      await waitForElementToBeRemoved(() => view.queryByRole('form'));

      // shows a save succeeded alert
      expect(view.getByRole('alert')).to.contain.text(
        'We’ve saved your direct deposit information',
      );

      // and the bank info from the mocked call should be shown
      expect(view.getByText(mocks.newPaymentAccount.financialInstitutionName))
        .to.exist;
      expect(view.getByText(mocks.newPaymentAccount.accountNumber)).to.exist;
      expect(
        view.getByText(mocks.newPaymentAccount.accountType, { exact: false }),
      ).to.exist;
    });
  });
  describe('when bank info is already set up', () => {
    let view;
    beforeEach(() => {
      initialState = createBasicInitialState();
      // Using queries on RTL `screen` does not work for some reason. So I'm just
      // storing the entire response from `render` as `view` so I can treat `view`
      // like I would `screen`
      view = renderWithProfileReducers(ui, {
        initialState,
      });
    });
    it('should show the bank info and not show the "set up bank info" button', () => {
      expect(view.getByText(paymentAccount.financialInstitutionName)).to.exist;
      expect(view.getByText(paymentAccount.accountNumber)).to.exist;
      expect(view.getByText(paymentAccount.accountType, { exact: false })).to
        .exist;
      expect(view.getByText(/been the victim of bank fraud/i)).to.exist;
      expect(findSetUpBankInfoButton(view)).to.be.null;
    });
    it('should handle a successful bank info update', async () => {
      userEvent.click(findEditBankInfoButton(view));

      // fill out form info
      fillOutAndSubmitBankInfoForm(view);

      await waitForElementToBeRemoved(() => view.queryByRole('form'));

      // shows a save succeeded alert
      expect(view.getByRole('alert')).to.contain.text(
        'We’ve saved your direct deposit information',
      );

      // and the bank info from the mocked call should be shown
      expect(view.getByText(mocks.newPaymentAccount.financialInstitutionName))
        .to.exist;
      expect(view.getByText(mocks.newPaymentAccount.accountNumber)).to.exist;
      expect(
        view.getByText(mocks.newPaymentAccount.accountType, { exact: false }),
      ).to.exist;
    });
    it('should handle a failed attempt to update bank info', async () => {
      server.use(...mocks.updateDirectDepositFailure);
      userEvent.click(findEditBankInfoButton(view));

      // fill out form info
      fillOutAndSubmitBankInfoForm(view);

      // wait for the error to appear
      expect(
        await view.findByText(
          /we couldn’t update your direct deposit bank information/i,
        ),
      ).to.exist;

      // does not show save succeeded alert
      expect(view.container).to.not.contain.text(
        /we’ve saved your direct deposit information/i,
      );
    });
  });
});
