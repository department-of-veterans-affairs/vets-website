import React from 'react';

import { Provider } from 'react-redux';
import { expect } from 'chai';
import sinon from 'sinon';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

import { render, fireEvent } from '@testing-library/react';

import {
  mockFetch,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers.js';
import configureStore from 'redux-mock-store';

import { createMockSuccessResponse } from '../../api/local-mock-api/mocks/check.in.response';
import CheckIn from '../CheckIn';

describe('check-in', () => {
  describe('CheckIn component', () => {
    let store;
    beforeEach(() => {
      mockFetch();
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
    it('show appointment details progress', () => {
      const mockRouter = {
        params: {
          token: 'token-123',
        },
      };
      const checkIn = render(
        <Provider store={store}>
          <CheckIn router={mockRouter} />
        </Provider>,
      );
      expect(checkIn.getByTestId('appointment-date')).to.exist;
      expect(checkIn.getByTestId('appointment-date')).to.have.text(
        'Tuesday, July 6, 2021',
      );
      expect(checkIn.getByTestId('appointment-time')).to.exist;
      expect(checkIn.getByTestId('appointment-time').innerHTML).to.match(
        /([\d]|[\d][\d]):[\d][\d]/,
      );
      expect(checkIn.getByTestId('clinic-name')).to.exist;
      expect(checkIn.getByTestId('clinic-name')).to.have.text(
        'Green Team Clinic1',
      );
    });
    it('passes axeCheck', () => {
      const mockRouter = {
        params: {
          token: 'token-123',
        },
      };
      axeCheck(
        <Provider store={store}>
          <CheckIn router={mockRouter} />
        </Provider>,
      );
    });
    it('button click calls router', async () => {
      setFetchJSONResponse(
        global.fetch.onCall(0),
        createMockSuccessResponse({}),
      );

      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {
          token: 'token-123',
        },
      };
      const component = render(
        <Provider store={store}>
          <CheckIn router={mockRouter} />
        </Provider>,
      );

      const checkInButton = component.getByTestId('check-in-button');
      expect(checkInButton).to.exist;
      fireEvent.click(await component.findByText('Check in now'));
      expect(component.getAllByText('Loading...')).to.exist;
    });
  });
});
