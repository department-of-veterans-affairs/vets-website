import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { setupI18n, teardownI18n } from '../../../utils/i18n/i18n';
import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import TravelMileage from '.';

describe('travel-mileage', () => {
  beforeEach(() => {
    setupI18n();
  });
  afterEach(() => {
    teardownI18n();
  });
  describe('Mileage page', () => {
    it('displays single appointment context', () => {
      const store = {
        appointments: [
          {
            stationNo: '500',
            startTime: '2021-08-19T13:56:31',
          },
        ],
      };
      const component = render(
        <CheckInProvider store={store}>
          <TravelMileage />
        </CheckInProvider>,
      );
      expect(component.getByTestId('single-appointment-context')).to.exist;
    });
    it('displays multiple facility context', () => {
      const store = {
        appointments: [
          {
            stationNo: '500',
            startTime: '2021-08-19T13:56:31',
          },
          {
            stationNo: '633',
            startTime: '2021-08-19T14:56:31',
          },
        ],
      };
      const component = render(
        <CheckInProvider store={store}>
          <TravelMileage />
        </CheckInProvider>,
      );
      expect(component.getByTestId('multi-appointment-context')).to.exist;
    });
    it('auto selects appointment if single appointment', () => {
      const store = {
        appointmentToFile: {
          stationNo: '500',
          startTime: '2024-03-21T22:19:12.099Z',
        },
      };
      const expectedStateValue = {
        stationNo: '500',
        startTime: '2024-03-21T22:19:12.099Z',
      };
      const component = render(
        <CheckInProvider store={store}>
          <TravelMileage />
        </CheckInProvider>,
      );
      expect(component.getByTestId(JSON.stringify(expectedStateValue))).to
        .exist;
    });
    it('does not select any appointment when multi and nothing in redux', () => {
      const store = {
        appointments: [
          {
            stationNo: '500',
            startTime: '2024-03-21T22:19:12.099Z',
          },
          {
            stationNo: '600',
            startTime: '2024-03-21T20:19:12.099Z',
          },
        ],
      };
      const component = render(
        <CheckInProvider store={store}>
          <TravelMileage />
        </CheckInProvider>,
      );
      expect(component.getByTestId('null')).to.exist;
    });
    it('auto selects appointment based on redux value', () => {
      const store = {
        appointments: [
          {
            stationNo: '500',
            startTime: '2024-03-21T22:19:12.099Z',
          },
          {
            stationNo: '600',
            startTime: '2024-03-21T21:19:12.099Z',
          },
        ],
        appointmentToFile: {
          stationNo: '500',
          startTime: '2024-03-21T22:19:12.099Z',
        },
      };
      const expectedStateValue = {
        stationNo: '500',
        startTime: '2024-03-21T22:19:12.099Z',
      };
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
          appointments: [
            {
              stationNo: '500',
              startTime: '2024-03-21T22:19:12.099Z',
              timezone: 'America/Los_Angeles',
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
          appointments: [
            {
              stationNo: '500',
              startTime: '2024-03-21T22:19:12.099Z',
              timezone: 'America/Los_Angeles',
            },
            {
              stationNo: '600',
              startTime: '2024-03-21T21:19:12.099Z',
              timezone: 'America/Los_Angeles',
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
          appointments: [
            {
              stationNo: '500',
              appointmentIen: '111',
              clinicStopCodeName: 'Dermatology',
              doctorName: 'Dr. Face',
              startTime: '2024-03-21T22:19:12.099Z',
              timezone: 'America/Los_Angeles',
              facility: 'Test Facility',
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
        ).to.contain.text('In person at Test Facility');
      });
      it('formats string with missing values', () => {
        const store = {
          appointments: [
            {
              stationNo: '500',
              appointmentIen: '111',
              clinicStopCodeName: '',
              doctorName: 'Dr. Face',
              startTime: '2024-03-21T22:19:12.099Z',
              timezone: 'America/Los_Angeles',
            },
            {
              stationNo: '500',
              appointmentIen: '222',
              clinicStopCodeName: '',
              doctorName: '',
              startTime: '2024-03-21T22:19:12.099Z',
              timezone: 'America/Los_Angeles',
            },
            {
              stationNo: '500',
              appointmentIen: '333',
              clinicStopCodeName: 'Dermatology',
              doctorName: '',
              startTime: '2024-03-21T22:19:12.099Z',
              timezone: 'America/Los_Angeles',
            },
          ],
        };
        const component = render(
          <CheckInProvider store={store}>
            <TravelMileage />
          </CheckInProvider>,
        );
        expect(component.getByTestId('radio-500-111')).to.exist;
        expect(component.getByTestId('radio-500-222')).to.exist;
        expect(component.getByTestId('radio-500-333')).to.exist;
      });
    });
  });
});
