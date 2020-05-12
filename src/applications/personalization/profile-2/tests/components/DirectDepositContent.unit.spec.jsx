import React from 'react';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import {
  render,
  fireEvent,
  waitForElement,
  waitForElementToBeRemoved,
} from '@testing-library/react';
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

function fillOutValidBankInfo(selector) {
  // get the form fields
  const routingNumberInput = selector(/routing number/i);
  const accountNumberInput = selector(/account number/i);
  const accountTypeSelect = selector(/account type/i);
  // enter valid data in the form
  fireEvent.change(routingNumberInput, {
    target: { value: '987654321' },
  });
  fireEvent.change(accountNumberInput, {
    target: { value: '123456789' },
  });
  fireEvent.change(accountTypeSelect, {
    target: { value: 'Savings' },
  });
}

describe('DirectDepositContent', () => {
  let initialState;
  let store;
  beforeEach(() => {
    initialState = {
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
  });
  describe('when the user is LOA 1', () => {
    it('should render nothing', () => {
      initialState.user.profile.loa.current = 1;
      store = createStore(
        combineReducers({ ...commonReducer, ...reducer, profileUi }),
        initialState,
      );
      const { container } = render(
        <Provider store={store}>
          <DirectDepositContent />
        </Provider>,
      );
      expect(container.firstChild).to.be.null;
    });
  });
  describe('when the user does not have 2FA set up', () => {
    it('should render nothing', () => {
      initialState.user.profile.multifactor = false;
      store = createStore(
        combineReducers({ ...commonReducer, ...reducer, profileUi }),
        initialState,
      );
      const { container } = render(
        <Provider store={store}>
          <DirectDepositContent />
        </Provider>,
      );
      expect(container.firstChild).to.be.null;
    });
  });
  describe('when user is LOA 3 and has 2FA set up', () => {
    describe('when bank info is set up', () => {
      it('the user can view their bank info, switch to editing mode, and return to the read-only view', () => {
        store = createStore(
          combineReducers({ ...commonReducer, ...reducer, profileUi }),
          initialState,
        );
        const { getByText, queryByText } = render(
          <Provider store={store}>
            <DirectDepositContent />
          </Provider>,
        );

        // the bank info is shown:
        expect(queryByText(/bank of evss/i)).not.to.be.null;
        expect(queryByText(/\*\*\*\*5678/i)).not.to.be.null;
        expect(queryByText(/checking account/i)).not.to.be.null;
        // the edit bank info content is not shown
        expect(queryByText(/Please provide your bank’s/i)).to.be.null;

        // click the "Edit" button
        const editButton = getByText(/edit/i);
        fireEvent.click(editButton);

        // make sure edit bank info content is shown
        expect(queryByText(/Please provide your bank’s/i)).not.to.be.null;
        // and make sure that the bank info is no longer shown
        expect(queryByText(/bank of evss/i)).to.be.null;
        expect(queryByText(/\*\*\*\*5678/i)).to.be.null;
        expect(queryByText(/checking account/i)).to.be.null;

        // click the "Cancel" button
        const cancelButton = getByText(/cancel/i);
        fireEvent.click(cancelButton);

        // make sure the form is not shown...
        expect(queryByText(/Please provide your bank’s/i)).to.be.null;
        // ...and the bank info is shown again
        expect(queryByText(/bank of evss/i)).not.to.be.null;
        expect(queryByText(/\*\*\*\*5678/i)).not.to.be.null;
        expect(queryByText(/checking account/i)).not.to.be.null;
      });
      it('the user can submit valid bank info', async () => {
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
        store = createStore(
          combineReducers({ ...commonReducer, ...reducer, profileUi }),
          initialState,
          applyMiddleware(thunk),
        );
        const { getByText, getByLabelText, getByTestId, queryByText } = render(
          <Provider store={store}>
            <DirectDepositContent />
          </Provider>,
        );

        // click the edit button
        const editButton = getByText(/edit/i);
        fireEvent.click(editButton);

        fillOutValidBankInfo(getByLabelText);

        // submit the form
        const updateButton = getByTestId('submit-button');
        const cancelButton = getByTestId('cancel-button');
        fireEvent.click(updateButton);
        // confirm that the buttons are disabled during submission
        expect(updateButton.disabled).to.be.true;
        expect(cancelButton.disabled).to.be.true;

        // wait for the edit view to be removed
        await waitForElementToBeRemoved(() =>
          queryByText(/Please provide your bank/i),
        );

        // the updated bank info matches the fetch response
        expect(queryByText(/COMERICA BANK/)).not.to.be.null;
        expect(queryByText(/\*\*\*\*6789/i)).not.to.be.null;
        expect(queryByText(/savings account/i)).not.to.be.null;

        resetFetch();
      });
      it('the user should see an error alert when the bank info update fails', async () => {
        mockFetch();
        setFetchJSONFailure(global.fetch.onFirstCall(), {
          error: {
            errors: [
              {
                meta: {
                  messages: [{ key: 'payment.accountRoutingNumber' }],
                },
              },
            ],
          },
        });
        store = createStore(
          combineReducers({ ...commonReducer, ...reducer, profileUi }),
          initialState,
          applyMiddleware(thunk),
        );
        const { getByText, getByLabelText, getByTestId, queryByText } = render(
          <Provider store={store}>
            <DirectDepositContent />
          </Provider>,
        );

        // click the edit button
        const editButton = getByText(/edit/i);
        fireEvent.click(editButton);

        fillOutValidBankInfo(getByLabelText);

        // submit the form
        const updateButton = getByTestId('submit-button');
        fireEvent.click(updateButton);

        // wait for the error alert...
        await waitForElement(() =>
          queryByText(/We couldn’t update your bank information/i),
        );

        resetFetch();
      });
    });
  });
});
