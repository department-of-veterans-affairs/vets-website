import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import UpdateInformationQuestion from '../UpdateInformationQuestion';

describe('check in', () => {
  describe('UpdateInformationQuestion', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          appointment: {
            clinicPhone: '555-867-5309',
            appointmentTime: '2021-07-06 12:58:39 UTC',
            facilityName: 'Acme VA',
            clinicName: 'Green Team Clinic1',
          },
        },
      };
      store = mockStore(initState);
    });
    it('has a header', () => {
      const component = render(
        <Provider store={store}>
          <UpdateInformationQuestion />
        </Provider>,
      );

      expect(
        component.getByText(
          'Need to update your insurance, contact, or other information?',
        ),
      ).to.exist;
    });
    it('uses a fieldset', () => {
      const { container } = render(
        <Provider store={store}>
          <UpdateInformationQuestion />
        </Provider>,
      );

      expect(container.querySelector('fieldset')).to.exist;
    });
    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <UpdateInformationQuestion />
        </Provider>,
      );
    });
  });
});
