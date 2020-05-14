import React from 'react';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { expect } from 'chai';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import DirectDeposit from '../../components/direct-deposit/DirectDeposit';
import DirectDepositContent from '../../components/direct-deposit/DirectDepositContent';

describe('DirectDeposit', () => {
  let wrapper;
  let directDeposit;
  let fakeStore = {};
  const makeFakeStore = () => ({
    getState: () => ({
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
      scheduledDowntime: {
        dismissedDowntimeWarnings: [],
        globalDowntime: null,
        isPending: false,
        isReady: true,
        serviceMap: {
          get() {},
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
    }),
    subscribe: () => {},
    dispatch: () => {},
  });
  beforeEach(() => {
    fakeStore = makeFakeStore();
    wrapper = mount(
      <Provider store={fakeStore}>
        <DirectDeposit />
      </Provider>,
    );
    directDeposit = wrapper.childAt(0);
  });
  afterEach(() => {
    wrapper.unmount();
  });
  it('renders an h2 tag as its first child', () => {
    const firstChild = directDeposit.childAt(0);
    expect(firstChild.type()).to.equal('h2');
  });

  describe('the DowntimeNotification component', () => {
    it('should be the second child', () => {
      const secondChild = directDeposit.childAt(1);
      expect(secondChild.type()).to.equal(DowntimeNotification);
      expect(secondChild.prop('dependencies')).to.deep.equal([
        externalServices.evss,
      ]);
    });
    it('should wrap a DirectDepositContent component', () => {
      const secondChild = directDeposit.childAt(1);
      const downtimeNotificationChild = secondChild.childAt(0).childAt(0);
      expect(downtimeNotificationChild.type()).to.equal(DirectDepositContent);
    });
  });
});
