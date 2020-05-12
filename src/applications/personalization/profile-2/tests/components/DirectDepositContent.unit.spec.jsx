import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';

import DirectDepositContent from '../../components/direct-deposit/DirectDepositContent';

describe('DirectDepositContent', () => {
  let wrapper;
  let store;
  let state;
  const makeFakeStore = () => {
    state = {
      user: {
        login: {
          currentlyLoggedIn: true,
        },
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
    return {
      getState: () => state,
      subscribe: () => {},
      dispatch: () => {},
    };
  };
  describe('when user is LOA 3 and has 2FA set up', () => {
    describe('when bank info is set up', () => {
      it('should show the current bank info', () => {
        store = makeFakeStore();
        wrapper = mount(
          <Provider store={store}>
            <DirectDepositContent />
          </Provider>,
        );

        expect(wrapper.text().includes('Bank of EVSS')).to.be.true;
        expect(wrapper.text().includes('****5678')).to.be.true;
        expect(wrapper.text().includes('Checking')).to.be.true;

        wrapper.unmount();
      });
    });
  });

  describe('when the user is LOA 1', () => {
    it('should render nothing', () => {
      store = makeFakeStore();
      state.user.profile = {
        loa: {
          current: 1,
          highest: 3,
        },
      };
      wrapper = mount(
        <Provider store={store}>
          <DirectDepositContent />
        </Provider>,
      );
      expect(wrapper.html()).to.equal('');
      wrapper.unmount();
    });
  });
  describe('when the user does not have 2FA set up', () => {
    it('should render nothing', () => {
      store = makeFakeStore();
      state.user.profile.multifactor = false;
      wrapper = mount(
        <Provider store={store}>
          <DirectDepositContent />
        </Provider>,
      );
      expect(wrapper.html()).to.equal('');
      wrapper.unmount();
    });
  });
});
