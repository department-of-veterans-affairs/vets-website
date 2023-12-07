import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import MockDate from 'mockdate';

import { render, fireEvent } from '@testing-library/react';

import TestComponent from './TestComponent';

describe('check-in', () => {
  afterEach(() => {
    MockDate.reset();
  });

  describe('useTravelPayFlags', () => {
    describe('should render with token only.', () => {
      let store;
      beforeEach(() => {
        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            context: {
              token: 123,
              appointment: {
                startTime: '2022-08-12T15:15:00',
              },
            },
            form: {
              data: {},
              pages: [],
            },
          },
        };
        store = mockStore(initState);
      });
      it('should render without form data', () => {
        const component = render(
          <Provider store={store}>
            <TestComponent />
          </Provider>,
        );

        const sentFalseButton = component.getByTestId(
          'setTravelPayClaimSentFalse',
        );
        const sentTrueButton = component.getByTestId(
          'setTravelPayClaimSentTrue',
        );

        expect(component.getByTestId('travelPayQuestion')).to.have.text('no');
        expect(component.getByTestId('travelPayAddress')).to.have.text('no');
        expect(component.getByTestId('travelPayMileage')).to.have.text('no');
        expect(component.getByTestId('travelPayVehicle')).to.have.text('no');
        expect(component.getByTestId('travelPayClaimSent')).to.have.text('no');
        expect(component.getByTestId('travelPayEligible')).to.have.text('no');
        fireEvent.click(sentTrueButton);
        expect(component.getByTestId('travelPayClaimSent')).to.have.text('yes');
        fireEvent.click(sentFalseButton);
        expect(component.getByTestId('travelPayClaimSent')).to.have.text('no');
      });
    });
    describe('should render with form data.', () => {
      let store;
      beforeEach(() => {
        MockDate.set('2022-08-12T15:14:00-07:00');

        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          checkInData: {
            context: {
              token: 123,
              appointment: {
                startTime: '2022-08-12T15:15:00',
              },
            },
            form: {
              data: {
                'travel-question': 'yes',
                'travel-address': 'yes',
                'travel-mileage': 'yes',
                'travel-vehicle': 'yes',
                'travel-review': 'yes',
              },
              pages: [],
            },
          },
        };
        store = mockStore(initState);
      });
      it('should render with redux store data', () => {
        const component = render(
          <Provider store={store}>
            <TestComponent />
          </Provider>,
        );
        expect(component.getByTestId('travelPayQuestion')).to.have.text('yes');
        expect(component.getByTestId('travelPayAddress')).to.have.text('yes');
        expect(component.getByTestId('travelPayMileage')).to.have.text('yes');
        expect(component.getByTestId('travelPayVehicle')).to.have.text('yes');
        expect(component.getByTestId('travelPayEligible')).to.have.text('yes');
        expect(component.getByTestId('travelPayData')).to.have.text(
          '2022-08-12',
        );
      });
    });
    describe('should render date in ISO form when feature flag is on.', () => {
      let store;
      beforeEach(() => {
        MockDate.set('2022-08-12T15:14:00-07:00');

        const middleware = [];
        const mockStore = configureStore(middleware);
        const initState = {
          featureToggles: {
            // eslint-disable-next-line camelcase
            check_in_experience_travel_logic: true,
          },
          checkInData: {
            context: {
              token: 123,
              appointment: {
                startTime: '2022-08-12T15:15:00',
              },
            },
            form: {
              data: {
                'travel-question': 'yes',
                'travel-address': 'yes',
                'travel-mileage': 'yes',
                'travel-vehicle': 'yes',
                'travel-review': 'yes',
              },
              pages: [],
            },
          },
        };
        store = mockStore(initState);
      });
      it('should render with redux store data', () => {
        const component = render(
          <Provider store={store}>
            <TestComponent />
          </Provider>,
        );
        expect(component.getByTestId('travelPayData')).to.contain.text(
          '2022-08-12T15:15:00Z',
        );
      });
    });
  });
});
