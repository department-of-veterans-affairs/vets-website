import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { expect } from 'chai';

import {
  mockFetch,
  resetFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import { commonReducer } from 'platform/startup/store';

import reducer from 'applications/personalization/profile360/reducers';

import profileUi from '../../reducers';
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

const newPaymentAccount = {
  accountType: 'Savings',
  financialInstitutionName: 'COMERICA BANK',
  accountNumber: '*****6789',
  financialInstitutionRoutingNumber: '*****4321',
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

function setUpWithInitialState(initialState = createBasicInitialState()) {
  const store = createStore(
    combineReducers({ ...commonReducer, ...reducer, profileUi }),
    initialState,
    applyMiddleware(thunk),
  );
  return mount(
    <Provider store={store}>
      <DirectDepositContent />
    </Provider>,
  );
}

function fillOutAndSubmitBankInfoForm(form) {
  const routingNumberInput = form.find('input#root_routingNumber');
  const accountNumberInput = form.find('input#root_accountNumber');
  const accountTypeSelect = form.find('select#root_accountType');

  // enter valid data in the bank info form...
  routingNumberInput.simulate('change', {
    target: { name: 'root_routingNumber', value: '123123123' },
  });
  accountNumberInput.simulate('change', {
    target: { name: 'root_accountNumber', value: '123123123' },
  });
  accountTypeSelect.simulate('change', {
    target: { name: 'root_accountType', value: 'Savings' },
  });

  form.simulate('submit');
}

function findSetUpBankInfoButton(wrapper) {
  return wrapper.find(
    'button.va-button-link[children="Please add your bank information"]',
  );
}

function findEditBankInfoButton(wrapper) {
  return wrapper.find(
    'button[aria-label^="Edit your direct deposit bank information"]',
  );
}

function findPaymentHistoryLink(wrapper) {
  return wrapper.find('a[children="View your payment history"]');
}

function findCancelEditButton(wrapper) {
  return wrapper.find('form button[children="Cancel"]');
}

// Thanks Pivotal http://engineering.pivotal.io/post/react-integration-tests-with-enzyme/
function asyncFlush() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

describe('DirectDepositContent', () => {
  let initialState;
  it('should render nothing if the user is LOA1', () => {
    initialState = createBasicInitialState();
    initialState.user.profile = {
      loa: {
        current: 1,
        highest: 3,
      },
    };

    const wrapper = setUpWithInitialState(initialState);

    expect(wrapper.isEmptyRender()).to.be.true;
    wrapper.unmount();
  });
  it('should render nothing if the user does not have 2FA set up', () => {
    initialState = createBasicInitialState();
    initialState.user.profile.multifactor = false;

    const wrapper = setUpWithInitialState(initialState);

    expect(wrapper.isEmptyRender()).to.be.true;
    wrapper.unmount();
  });
  describe('when bank info is not set up yet', () => {
    let wrapper;
    beforeEach(() => {
      initialState = createBasicInitialState();
      initialState.vaProfile.paymentInformation.responses[0].paymentAccount = emptyPaymentAccount;
      wrapper = setUpWithInitialState(initialState);
    });
    afterEach(() => {
      wrapper.unmount();
    });
    it('should not show the link to payment history', () => {
      expect(findPaymentHistoryLink(wrapper).exists()).to.be.false;
    });
    it('should not show any bank info', () => {
      expect(wrapper.text().includes(paymentAccount.financialInstitutionName))
        .to.be.false;
      expect(wrapper.text().includes(paymentAccount.accountNumber)).to.be.false;
      expect(wrapper.text().includes(paymentAccount.accountType)).to.be.false;
    });
    it('should allow switching to the "edit bank info" form and cancelling out of the "edit bank info" form', () => {
      // find and click on the set up button
      findSetUpBankInfoButton(wrapper).simulate('click');

      // ensure that the edit form is visible
      let editForm = wrapper.find('form');
      expect(editForm.exists()).to.be.true;

      // find and click on the cancel button
      findCancelEditButton(wrapper).simulate('click');

      // ensure that the edit form is not visible
      editForm = wrapper.find('form');
      expect(editForm.exists()).to.be.false;
    });
    it('should handle a successful attempt to update bank info', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            responses: [
              {
                paymentAccount: newPaymentAccount,
              },
            ],
          },
        },
      });

      // find and click on the set up button
      findSetUpBankInfoButton(wrapper).simulate('click');

      // fill out form info
      fillOutAndSubmitBankInfoForm(wrapper.find('form'));

      await asyncFlush();
      wrapper.update();

      // the form should be removed
      expect(wrapper.find('form').exists()).to.be.false;

      // a success alert should appear
      expect(
        wrapper.text().includes('We’ve saved your direct deposit information'),
      ).to.be.true;

      // and the bank info from the mocked call should be shown
      expect(
        wrapper.text().includes(newPaymentAccount.financialInstitutionName),
      ).to.be.true;
      expect(wrapper.text().includes(newPaymentAccount.accountNumber)).to.be
        .true;
      expect(wrapper.text().includes(newPaymentAccount.accountType)).to.be.true;

      resetFetch();
    });
  });

  describe('when bank info is already set up', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = setUpWithInitialState();
    });
    afterEach(() => {
      wrapper.unmount();
    });
    it('should show the current bank info and a link to payment history', () => {
      expect(wrapper.text().includes(paymentAccount.financialInstitutionName))
        .to.be.true;
      expect(wrapper.text().includes(paymentAccount.accountNumber)).to.be.true;
      expect(wrapper.text().includes(paymentAccount.accountType)).to.be.true;
      expect(findPaymentHistoryLink(wrapper).exists()).to.be.true;
      expect(findSetUpBankInfoButton(wrapper).exists()).to.be.false;
    });
    it('should allow switching to the "edit bank info" form and cancelling out of the "edit bank info" form', () => {
      // find and click on the edit button
      findEditBankInfoButton(wrapper).simulate('click');

      // ensure that the edit form is visible
      let editForm = wrapper.find('form');
      expect(editForm.exists()).to.be.true;

      // find and click on the cancel button
      findCancelEditButton(wrapper).simulate('click');

      // ensure that the edit form is not visible
      editForm = wrapper.find('form');
      expect(editForm.exists()).to.be.false;
    });
    it('should handle a successful attempt to update bank info', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            responses: [
              {
                paymentAccount: newPaymentAccount,
              },
            ],
          },
        },
      });

      // find and click on the edit button
      findEditBankInfoButton(wrapper).simulate('click');

      // fill out form info
      fillOutAndSubmitBankInfoForm(wrapper.find('form'));

      await asyncFlush();
      wrapper.update();

      // the form should be removed
      expect(wrapper.find('form').exists()).to.be.false;

      // a success alert should appear
      expect(
        wrapper.text().includes('We’ve saved your direct deposit information'),
      ).to.be.true;

      // and the bank info from the mocked call should be shown
      expect(
        wrapper.text().includes(newPaymentAccount.financialInstitutionName),
      ).to.be.true;
      expect(wrapper.text().includes(newPaymentAccount.accountNumber)).to.be
        .true;
      expect(wrapper.text().includes(newPaymentAccount.accountType)).to.be.true;

      resetFetch();
    });
    it('should handle a failed attempt to update bank info', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch.onFirstCall(), {
        errors: [
          {
            title: 'Unprocessable Entity',
            detail: 'One or more unprocessable user payment properties',
            code: '126',
            source: 'EVSS::PPIU::Service',
            status: '422',
            meta: {
              messages: [
                {
                  key: 'cnp.payment.generic.error.message',
                  severity: 'ERROR',
                  text:
                    'Generic CnP payment update error. Update response: Update Failed: Night area number is invalid, must be 3 digits',
                },
              ],
            },
          },
        ],
      });

      // find and click on the edit button
      findEditBankInfoButton(wrapper).simulate('click');

      // fill out form info
      fillOutAndSubmitBankInfoForm(wrapper.find('form'));

      await asyncFlush();
      wrapper.update();

      // the form should remain
      expect(wrapper.find('form').exists()).to.be.true;
      // an error appears
      expect(
        wrapper
          .text()
          .includes('We couldn’t update your direct deposit bank information'),
      ).to.be.true;

      // a success alert should not appear
      expect(
        wrapper.text().includes('We’ve saved your direct deposit information'),
      ).to.be.false;

      resetFetch();
    });
  });
});
