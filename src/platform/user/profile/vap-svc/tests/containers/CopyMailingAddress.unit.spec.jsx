import React from 'react';
import enzyme from 'enzyme';
import { expect } from 'chai';

import CopyMailingAddress from 'platform/user/profile/vap-svc/containers/CopyMailingAddress';

describe('<CopyMailingAddress/>', () => {
  describe('the checkbox', () => {
    it('is checked when the Mailing Address and Home Address are equal', () => {
      const fakeStore = {
        getState: () => ({
          vapService: {
            formFields: {
              residentialAddress: {
                value: {
                  addressLine1: '36320 Coronado Dr',
                  addressLine2: null,
                  addressLine3: null,
                  addressPou: 'CORRESPONDENCE',
                  city: 'Fremont',
                  countryName: 'United States',
                  countryCodeIso3: 'USA',
                  internationalPostalCode: null,
                  province: null,
                  stateCode: 'CA',
                  zipCode: '94536',
                },
              },
            },
          },
          user: {
            profile: {
              vapContactInfo: {
                mailingAddress: {
                  addressLine1: '36320 Coronado Dr',
                  addressLine2: null,
                  addressLine3: null,
                  addressPou: 'CORRESPONDENCE',
                  city: 'Fremont',
                  countryName: 'United States',
                  countryCodeIso3: 'USA',
                  internationalPostalCode: null,
                  province: null,
                  stateCode: 'CA',
                  zipCode: '94536',
                },
              },
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };
      const component = enzyme.mount(<CopyMailingAddress store={fakeStore} />);
      const checkbox = component.find(
        '#copy-mailing-address-to-residential-address',
      );
      expect(checkbox.props().checked).to.equal(true);
      component.unmount();
    });

    it('is not checked when the Mailing Address and Home Address are not equal', () => {
      const fakeStore = {
        getState: () => ({
          vapService: {
            formFields: {
              residentialAddress: {
                value: {
                  addressLine1: '36320 Coronado Dr',
                  addressLine2: null,
                  addressLine3: null,
                  addressPou: 'CORRESPONDENCE',
                  city: 'Fremont',
                  countryName: 'United States',
                  countryCodeIso3: 'USA',
                  internationalPostalCode: null,
                  province: null,
                  stateCode: 'CA',
                  zipCode: '94536',
                },
              },
            },
          },
          user: {
            profile: {
              vapContactInfo: {
                mailingAddress: {
                  addressLine1: '36310 Coronado Dr',
                  addressLine2: null,
                  addressLine3: null,
                  addressPou: 'CORRESPONDENCE',
                  city: 'Fremont',
                  countryName: 'United States',
                  countryCodeIso3: 'USA',
                  internationalPostalCode: null,
                  province: null,
                  stateCode: 'CA',
                  zipCode: '94536',
                },
              },
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };

      const component = enzyme.mount(<CopyMailingAddress store={fakeStore} />);
      const checkbox = component.find(
        '#copy-mailing-address-to-residential-address',
      );
      expect(checkbox.props().checked).to.equal(false);
      component.unmount();
    });
  });
});
