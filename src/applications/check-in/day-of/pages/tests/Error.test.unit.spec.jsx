import React from 'react';

import { Provider } from 'react-redux';
import { expect } from 'chai';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

import { render } from '@testing-library/react';

import configureStore from 'redux-mock-store';

import Error from '../Error';

describe('check-in', () => {
  describe('Error component', () => {
    it('renders without the phone number', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          appointment: {
            startTime: '2021-07-19T13:56:31',
            facilityName: 'Acme VA',
            clinicName: 'Green Team Clinic1',
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
          },
        },
      };
      const store = mockStore(initState);
      const component = render(
        <Provider store={store}>
          <Error />
        </Provider>,
      );
      expect(component.getByTestId('error-message')).to.exist;
      expect(component.getByTestId('error-message')).to.have.text(
        'We’re sorry. Something went wrong on our end. Check in with a staff member.',
      );
    });
    it('passes axeCheck', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          appointment: {
            clinicPhone: '555-867-5309',
            startTime: '2021-07-19T13:56:31',
            facilityName: 'Acme VA',
            clinicName: 'Green Team Clinic1',
          },
        },
      };
      const store = mockStore(initState);
      axeCheck(
        <Provider store={store}>
          <Error />
        </Provider>,
      );
    });
  });
});
