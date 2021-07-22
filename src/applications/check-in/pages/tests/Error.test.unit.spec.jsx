import React from 'react';

import { Provider } from 'react-redux';
import { expect } from 'chai';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

import { render } from '@testing-library/react';

import configureStore from 'redux-mock-store';

import Error from '../Error';

describe('check-in', () => {
  describe('Error component', () => {
    // it('show appointment details progress', () => {
    //   const mockRouter = {
    //     params: {
    //       token: 'token-123',
    //     },
    //   };
    //   const checkIn = render(
    //     <Provider store={store}>
    //       <CheckIn router={mockRouter} />
    //     </Provider>,
    //   );
    //   expect(checkIn.getByTestId('appointment-date')).to.exist;
    //   expect(checkIn.getByTestId('appointment-date')).to.have.text(
    //     'Monday, July 19, 2021',
    //   );
    //   expect(checkIn.getByTestId('appointment-time')).to.exist;
    //   expect(checkIn.getByTestId('appointment-time').innerHTML).to.match(
    //     /([\d]|[\d][\d]):[\d][\d]/,
    //   );
    //   expect(checkIn.getByTestId('clinic-name')).to.exist;
    //   expect(checkIn.getByTestId('clinic-name')).to.have.text(
    //     'Green Team Clinic1',
    //   );
    // });
    it('renders with the phone number', () => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          appointment: {
            clinicPhoneNumber: '555-123-1234',
            startTime: '2021-07-19T13:56:31',
            facilityName: 'Acme VA',
            clinicName: 'Green Team Clinic1',
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
        'We’re sorry. Something went wrong on our end. Check in with a staff member or call us at 555-123-1234.',
      );
    });
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
