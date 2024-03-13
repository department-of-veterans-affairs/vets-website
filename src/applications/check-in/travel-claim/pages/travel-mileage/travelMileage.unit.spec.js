import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import TravelMileage from '.';

describe('travel-mileage', () => {
  describe('Mileage page', () => {
    it('displays single facility context', () => {
      const store = {
        eligibleToFile: [
          {
            stationNo: '500',
          },
        ],
      };
      const component = render(
        <CheckInProvider store={store}>
          <TravelMileage />
        </CheckInProvider>,
      );
      expect(component.getByTestId('single-fac-context')).to.exist;
    });
    it('displays multiple facility context', () => {
      const store = {
        eligibleToFile: [
          {
            stationNo: '500',
          },
          {
            stationNo: '633',
          },
        ],
      };
      const component = render(
        <CheckInProvider store={store}>
          <TravelMileage />
        </CheckInProvider>,
      );
      expect(component.getByTestId('multi-fac-context')).to.exist;
    });
    it('auto selects facility if single facility', () => {
      const store = {
        eligibleToFile: [
          {
            stationNo: '500',
            startTime: '2021-08-19T13:56:31',
          },
        ],
      };
      const expectedStateValue = [
        {
          stationNo: '500',
          startTime: '2021-08-19T13:56:31',
          multipleAppointments: false,
        },
      ];
      const component = render(
        <CheckInProvider store={store}>
          <TravelMileage />
        </CheckInProvider>,
      );
      expect(component.getByTestId(JSON.stringify(expectedStateValue))).to
        .exist;
    });
    it('does not select any facility when multi and nothing in redux', () => {
      const store = {
        eligibleToFile: [
          {
            stationNo: '500',
            startTime: '2021-08-19T13:56:31',
          },
          {
            stationNo: '600',
            startTime: '2021-08-19T13:56:31',
          },
        ],
      };
      const component = render(
        <CheckInProvider store={store}>
          <TravelMileage />
        </CheckInProvider>,
      );
      expect(component.getByTestId('[]')).to.exist;
    });
    it('auto selects facilities based on redux value', () => {
      const store = {
        eligibleToFile: [
          {
            stationNo: '500',
            startTime: '2021-08-19T13:56:31',
          },
          {
            stationNo: '600',
            startTime: '2021-08-19T13:56:31',
          },
        ],
        facilitiesToFile: [
          {
            stationNo: '500',
            startTime: '2021-08-19T13:56:31',
            multipleAppointments: false,
          },
        ],
      };
      const expectedStateValue = [
        {
          stationNo: '500',
          startTime: '2021-08-19T13:56:31',
          multipleAppointments: false,
        },
      ];
      const component = render(
        <CheckInProvider store={store}>
          <TravelMileage />
        </CheckInProvider>,
      );
      expect(component.getByTestId(JSON.stringify(expectedStateValue))).to
        .exist;
    });
    describe('continueClick', () => {
      it('continues to the next page with a selection', () => {
        const store = {
          formPages: ['travel-info', 'travel-mileage', 'travel-vehicle'],
          eligibleToFile: [
            {
              stationNo: '500',
              startTime: '2021-08-19T13:56:31',
            },
          ],
        };
        const push = sinon.spy();
        const component = render(
          <CheckInProvider
            store={store}
            router={{
              push,
              currentPage: '/travel-mileage',
              params: {},
            }}
          >
            <TravelMileage />
          </CheckInProvider>,
        );
        const link = component.getByTestId('continue-button');
        fireEvent.click(link);
        expect(push.calledWith('travel-vehicle')).to.be.true;
      });
      it('sets error state if continue clicked with no selection', () => {
        const store = {
          formPages: ['travel-info', 'travel-mileage', 'travel-vehicle'],
          eligibleToFile: [
            {
              stationNo: '500',
              startTime: '2021-08-19T13:56:31',
            },
            {
              stationNo: '600',
              startTime: '2021-08-19T13:56:31',
            },
          ],
        };
        const push = sinon.spy();
        const component = render(
          <CheckInProvider
            store={store}
            router={{
              push,
              currentPage: '/travel-mileage',
              params: {},
            }}
          >
            <TravelMileage />
          </CheckInProvider>,
        );
        const link = component.getByTestId('continue-button');
        fireEvent.click(link);
        expect(push.notCalled).to.be.true;
      });
    });
    describe('formatAppointment', () => {
      it('formats string with values', () => {
        const store = {
          eligibleToFile: [
            {
              stationNo: '500',
              appointmentIen: '111',
              clinicStopCodeName: 'Dermatology',
              doctorName: 'Dr. Face',
            },
          ],
        };
        const component = render(
          <CheckInProvider store={store}>
            <TravelMileage />
          </CheckInProvider>,
        );
        expect(
          component.getByTestId('appointment-list-item-111'),
        ).to.contain.text('Dermatology appointment with Dr. Face');
      });
      it('formats string with missing values', () => {
        const store = {
          eligibleToFile: [
            {
              stationNo: '500',
              appointmentIen: '111',
              clinicStopCodeName: '',
              doctorName: 'Dr. Face',
            },
            {
              stationNo: '500',
              appointmentIen: '222',
              clinicStopCodeName: '',
              doctorName: '',
            },
            {
              stationNo: '500',
              appointmentIen: '333',
              clinicStopCodeName: 'Dermatology',
              doctorName: '',
            },
          ],
        };
        const component = render(
          <CheckInProvider store={store}>
            <TravelMileage />
          </CheckInProvider>,
        );
        expect(
          component.getByTestId('appointment-list-item-111'),
        ).to.contain.text('VA Appointment with Dr. Face');
        expect(
          component.getByTestId('appointment-list-item-222'),
        ).to.contain.text('VA Appointment');
        expect(
          component.getByTestId('appointment-list-item-333'),
        ).to.contain.text('Dermatology appointment');
      });
    });
  });
});
