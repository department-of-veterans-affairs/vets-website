import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { expect } from 'chai';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import ProfileSectionHeadline from '@@profile/components/ProfileSectionHeadline';
import DirectDepositV1 from '@@profile/components/direct-deposit/DirectDepositV1';
import BankInfoCNP from '@@profile/components/direct-deposit/BankInfoCNP';

describe('DirectDeposit version 1', () => {
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
        cnpPaymentInformation: {
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
        cnpPaymentInformationUiState: {},
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  });
  beforeEach(() => {
    fakeStore = makeFakeStore();
    wrapper = mount(
      <Provider store={fakeStore}>
        <MemoryRouter>
          <DirectDepositV1 />
        </MemoryRouter>
      </Provider>,
    );
    directDeposit = wrapper.find('DirectDeposit');
  });
  afterEach(() => {
    wrapper.unmount();
  });

  it('renders a ProfileSectionHeadline component as its first child', () => {
    const firstChild = directDeposit.childAt(0);
    expect(firstChild.type()).to.equal(ProfileSectionHeadline);
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
      expect(downtimeNotificationChild.type()).to.equal(BankInfoCNP);
    });
  });
});
