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
            paymentAccount: {
              accountType: 'Checking',
              financialInstitutionName: 'Bank of EVSS',
              accountNumber: '****5678',
              financialInstitutionRoutingNumber: '*****0021',
            },
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
  it('should show the current bank info if it is set up', () => {
    const wrapper = setUpWithInitialState();

    expect(wrapper.text().includes('Bank of EVSS')).to.be.true;
    expect(wrapper.text().includes('****5678')).to.be.true;
    expect(wrapper.text().includes('Checking')).to.be.true;

    wrapper.unmount();
  });
  it('should allow switching to the "edit bank info" form and cancelling out of the "edit bank info" form', () => {
    const wrapper = setUpWithInitialState();

    // find and click on the edit button
    const editButton = wrapper.find('button[aria-label^="Edit"]');
    editButton.simulate('click');

    // ensure that the edit form is visible
    let editForm = wrapper.find('form');
    expect(editForm.length).to.equal(1);

    // find and click on the cancel button
    const cancelButton = wrapper.find('form button[children="Cancel"]');
    cancelButton.simulate('click');

    // ensure that the edit form is not visible
    editForm = wrapper.find('form');
    expect(editForm.length).to.equal(0);

    wrapper.unmount();
  });
  it('should handle a successful attempt to update bank info', async () => {
    mockFetch();
    setFetchJSONResponse(global.fetch.onFirstCall(), {
      data: {
        attributes: {
          responses: [
            {
              paymentAccount: {
                accountType: 'Savings',
                financialInstitutionName: 'COMERICA BANK',
                accountNumber: '*****6789',
                financialInstitutionRoutingNumber: '*****4321',
              },
            },
          ],
        },
      },
    });
    const wrapper = setUpWithInitialState();

    // find and click on the edit button
    // so sad that this doesn't support case-insensitive matches :(
    const editButton = wrapper.find('button[aria-label^="Edit"]');
    editButton.simulate('click');

    // fill out form info
    fillOutAndSubmitBankInfoForm(wrapper.find('form'));

    await asyncFlush();
    wrapper.update();

    // the form should be removed
    expect(wrapper.find('form').length).to.equal(0);

    // a success alert should appear
    expect(
      wrapper.text().includes('We’ve saved your direct deposit information'),
    ).to.be.true;

    // and the bank info from the mocked call should be shown
    expect(wrapper.text().includes('COMERICA')).to.be.true;
    expect(wrapper.text().includes('****6789')).to.be.true;
    expect(wrapper.text().includes('Savings')).to.be.true;

    resetFetch();
    wrapper.unmount();
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
    const wrapper = setUpWithInitialState();

    // find and click on the edit button
    // so sad that this doesn't support case-insensitive matches :(
    const editButton = wrapper.find('button[aria-label^="Edit"]');
    editButton.simulate('click');

    // fill out form info
    fillOutAndSubmitBankInfoForm(wrapper.find('form'));

    await asyncFlush();
    wrapper.update();

    // the form should remain
    expect(wrapper.find('form').length).to.equal(1);
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
    wrapper.unmount();
  });
});
