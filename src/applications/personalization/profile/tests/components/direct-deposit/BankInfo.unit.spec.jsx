import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

import * as mocks from '@@profile/msw-mocks';
import mockDisabilityCompensations from '@@profile/mocks/endpoints/disability-compensations';
import { renderWithProfileReducers } from '@@profile/tests/unit-test-helpers';

import BankInfo from '@@profile/components/direct-deposit/BankInfo';
import { benefitTypes } from '~/applications/personalization/common/constants';

const paymentAccount = {
  accountType: 'Checking',
  financialInstitutionName: 'Bank of EVSS',
  accountNumber: '****5678',
  financialInstitutionRoutingNumber: '*****0021',
};

const controlInformation = {
  canUpdateDirectDeposit: true,
  isCorpAvailable: true,
  isCorpRecFound: true,
  hasNoBdnPayments: true,
  hasIdentity: true,
  hasIndex: true,
  isCompetent: true,
  hasMailingAddress: true,
  hasNoFiduciaryAssigned: true,
  isNotDeceased: true,
  hasPaymentAddress: true,
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
      cnpPaymentInformation: {
        paymentAccount,
        controlInformation,
      },
      cnpPaymentInformationUiState: {},
    },
  };
}

function fillOutAndSubmitBankInfoForm(view) {
  const accountNumberField = view.container.querySelector(
    '#root_CNPAccountNumber',
  );
  const routingNumberField = view.container.querySelector(
    '#root_CNPRoutingNumber',
  );
  const savingsAccountRadio = view.getByLabelText('Savings');
  const submitButton = view.getByText('Save', { selector: 'button' });

  userEvent.type(routingNumberField, '456456456');
  userEvent.type(accountNumberField, '123123123');
  userEvent.click(savingsAccountRadio);
  userEvent.click(submitButton);
}

function findSetUpBankInfoButton(view) {
  return view.container.querySelector('[data-testid=edit-bank-info-button]');
}

function findEditBankInfoButton(view) {
  return view.getByText('Edit', {
    selector: 'button',
  });
}

function findPaymentHistoryLink(view) {
  return view.queryByText('/view your payment history/i', { selector: 'a' });
}

function findCancelEditButton(view, type) {
  return view.getByTestId(`${type}-form-cancel-button`);
}

describe('DirectDepositCNP', () => {
  let server;
  before(() => {
    server = setupServer(...mocks.updateDD4CNPSuccess);
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
      <BankInfo
        type={benefitTypes.CNP}
        setFormIsDirty={() => {}}
        setViewingPayments={() => {}}
      />
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

    const view = renderWithProfileReducers(ui, {
      initialState,
    });

    // nothing should be rendered
    expect(view.container.innerHTML).to.be.empty;
  });
  describe('when bank info is not set up but user is eligible', () => {
    let view;
    beforeEach(() => {
      initialState = createBasicInitialState();
      initialState.vaProfile.cnpPaymentInformation.paymentAccount = {};
      view = renderWithProfileReducers(ui, {
        initialState,
      });

      it('should render', () => {
        expect(view.container.innerHTML).not.to.be.empty;
      });
    });
    it('should not show the view payment history link', () => {
      expect(findPaymentHistoryLink(view)).not.to.exist;
    });
    it('should not show bank info', () => {
      expect(view.queryByText(paymentAccount.financialInstitutionName)).to.be
        .null;
      expect(view.queryByText(paymentAccount.accountNumber)).not.to.exist;
      expect(view.queryByText(paymentAccount.accountType)).not.to.exist;
    });
    it('should allow entering and exiting edit mode', async () => {
      userEvent.click(findSetUpBankInfoButton(view));

      // ensure that the edit form is visible
      expect(await view.findAllByLabelText(/account number/i)).to.exist;

      // find and click on the cancel button
      userEvent.click(findCancelEditButton(view, benefitTypes.CNP));

      // ensure that the edit form was removed
      expect(view.queryByLabelText(/account number/i)).not.to.exist;
    });
    it('should handle adding bank info', async () => {
      userEvent.click(findSetUpBankInfoButton(view));

      expect(await view.findAllByLabelText(/account number/i)).to.exist;

      // fill out form info
      fillOutAndSubmitBankInfoForm(view);

      await waitForElementToBeRemoved(() =>
        view.container.querySelector('#root_CNPAccountNumber'),
      );

      const {
        accountNumber,
        accountType,
        name,
      } = mockDisabilityCompensations.updates.success.data.attributes.paymentAccount;

      // and the bank info from the mocked call should be shown
      expect(view.getByText(accountNumber)).to.exist;
      expect(view.getByText(name)).to.exist;
      expect(view.getByText(accountType, { exact: false })).to.exist;
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
    });
    it('should handle a successful bank info update', async () => {
      userEvent.click(findEditBankInfoButton(view));

      // fill out form info
      fillOutAndSubmitBankInfoForm(view);

      await waitForElementToBeRemoved(() =>
        view.container.querySelector('#root_CNPAccountNumber'),
      );

      const {
        accountNumber,
        accountType,
        name,
      } = mockDisabilityCompensations.updates.success.data.attributes.paymentAccount;

      // and the bank info from the mocked call should be shown
      expect(view.getByText(name)).to.exist;
      expect(view.getByText(accountNumber)).to.exist;
      expect(view.getByText(accountType, { exact: false })).to.exist;
    });
    it('should handle a failed attempt to update bank info', async () => {
      server.use(...mocks.updateDD4CNPFailure);
      userEvent.click(findEditBankInfoButton(view));

      // fill out form info
      fillOutAndSubmitBankInfoForm(view);

      // wait for the error to appear
      expect(
        await view.findByText(
          /We’re sorry. We couldn’t update your payment information. Please try again later./i,
        ),
      ).to.exist;

      // does not show save succeeded alert
      expect(view.queryByText(/We’ve updated your bank account information/i))
        .to.not.exist;
    });
  });
});
