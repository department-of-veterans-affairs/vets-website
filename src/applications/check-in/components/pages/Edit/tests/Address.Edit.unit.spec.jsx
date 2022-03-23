import React from 'react';
import { expect } from 'chai';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import Address from '../Address';

describe('pre-check-in experience', () => {
  describe('Edit pages', () => {
    describe('Address', () => {
      let store;
      const middleware = [];
      const mockStore = configureStore(middleware);
      beforeEach(() => {
        const initState = {
          checkInData: {
            context: {
              token: '',
              editing: {
                value: '',
                key: 'homeAddress',
              },
            },
            form: {},
          },
        };
        store = mockStore(initState);
      });
      it('passes axeCheck', () => {
        axeCheck(
          <Provider store={store}>
            <Address />
          </Provider>,
        );
      });
      it('defaults to US address form', () => {
        const { getByTestId } = render(
          <Provider store={store}>
            <Address />
          </Provider>,
        );
        expect(getByTestId('city')).to.exist;
        expect(getByTestId('state')).to.exist;
        expect(getByTestId('zipCode')).to.exist;
      });
      it.skip('shows international address form with non-US address', () => {
        const internationalAddressState = {
          checkInData: {
            context: {
              token: '',
              editing: {
                value: {
                  country: 'other',
                },
                key: 'homeAddress',
              },
            },
            form: {},
          },
        };
        store = mockStore(internationalAddressState);
        const { getByTestId } = render(
          <Provider store={store}>
            <Address />
          </Provider>,
        );
        expect(getByTestId('city')).to.exist;
        expect(getByTestId('stateProvinceRegion')).to.exist;
        expect(getByTestId('internationalPostalCode')).to.exist;
      });
      it.skip('shows military base address form with military base address', () => {
        const baseAddressState = {
          checkInData: {
            context: {
              token: '',
              editing: {
                value: {
                  city: 'APO',
                },
                key: 'homeAddress',
              },
            },
            form: {},
          },
        };
        store = mockStore(baseAddressState);
        const { getByTestId } = render(
          <Provider store={store}>
            <Address />
          </Provider>,
        );
        expect(getByTestId('apoFpoDpo')).to.exist;
        expect(getByTestId('state')).to.exist;
        expect(getByTestId('zipCode')).to.exist;
      });
    });
  });
});
