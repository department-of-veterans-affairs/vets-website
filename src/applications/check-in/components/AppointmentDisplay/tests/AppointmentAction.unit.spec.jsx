import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import MockDate from 'mockdate';
import AppointmentAction from '../AppointmentAction';

import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import { ELIGIBILITY } from '../../../utils/appointment/eligibility';
import { api } from '../../../api';

describe('check-in', () => {
  afterEach(() => {
    MockDate.reset();
  });

  describe('AppointmentAction', () => {
    it('should render the check in button for ELIGIBLE appointments status', () => {
      const action = render(
        <CheckInProvider>
          <AppointmentAction
            appointment={{
              eligibility: ELIGIBILITY.ELIGIBLE,
              startTime: '2018-01-01T12:30:00.106-05:00',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
    });

    it('should render the check in button for appointments with ELIGIBLE status that expire in more than 10 seconds', () => {
      MockDate.set('2018-01-01T12:14:49-04:00');
      const action = render(
        <CheckInProvider>
          <AppointmentAction
            appointment={{
              checkInWindowEnd: '2018-01-01T12:15:00-04:00',
              eligibility: ELIGIBILITY.ELIGIBLE,
              startTime: '2018-01-01T12:30:00.106-05:00',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
    });
    it('should render the check in button for appointments with ELIGIBLE status in an earlier timezone', () => {
      MockDate.set('2018-01-01T13:25:00-04:00');
      const action = render(
        <CheckInProvider>
          <AppointmentAction
            appointment={{
              checkInWindowEnd: '2018-01-01T12:45:00.106-05:00',
              eligibility: ELIGIBILITY.ELIGIBLE,
              startTime: '2018-01-01T12:30:00.106-05:00',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
    });
    it('should call api on click with isTravelEnabled: true and travelSubmitted:true when enabled and submitted', () => {
      MockDate.set('2018-01-01T13:25:00-04:00');
      const { v2 } = api;
      const sandbox = sinon.createSandbox();
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      const initState = {
        travelQuestion: 'yes',
        travelAddress: 'yes',
        travelMileage: 'yes',
        travelVehicle: 'yes',
        travelReview: 'yes',
        features: {
          /* eslint-disable-next-line camelcase */
          check_in_experience_travel_reimbursement: true,
        },
      };
      sandbox.stub(v2, 'postCheckInData').resolves({});

      const action = render(
        <CheckInProvider store={initState}>
          <AppointmentAction
            appointment={{
              checkInWindowEnd: '2018-01-01T12:45:00.106-05:00',
              startTime: '2018-01-01T12:30:00.106-05:00',
              eligibility: ELIGIBILITY.ELIGIBLE,
              clinicIen: '0001',
              stationNo: '0001',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
      action.getByTestId('check-in-button').click();
      sandbox.assert.calledWith(v2.postCheckInData, {
        appointmentIen: undefined,
        isTravelEnabled: true,
        setECheckinStartedCalled: undefined,
        travelSubmitted: true,
        uuid: 'some-token',
      });
      sandbox.restore();
    });
    it('should call api on click with isTravelEnabled: false and travelSubmitted:false when not enabled and not submitted', () => {
      MockDate.set('2018-01-01T13:25:00-04:00');
      const { v2 } = api;
      const sandbox = sinon.createSandbox();
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      const initState = {
        travelQuestion: null,
        travelAddress: null,
        travelMileage: null,
        travelVehicle: null,
        travelReview: null,
        features: {
          /* eslint-disable-next-line camelcase */
          check_in_experience_travel_reimbursement: false,
        },
      };
      sandbox.stub(v2, 'postCheckInData').resolves({});

      const action = render(
        <CheckInProvider store={initState}>
          <AppointmentAction
            appointment={{
              checkInWindowEnd: '2018-01-01T12:45:00.106-05:00',
              startTime: '2018-01-01T12:30:00.106-05:00',
              eligibility: ELIGIBILITY.ELIGIBLE,
              clinicIen: '0002',
              stationNo: '0002',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
      action.getByTestId('check-in-button').click();
      sandbox.assert.calledWith(v2.postCheckInData, {
        appointmentIen: undefined,
        isTravelEnabled: false,
        setECheckinStartedCalled: undefined,
        travelSubmitted: false,
        uuid: 'some-token',
      });
      sandbox.restore();
    });
    it('should call api on click with isTravelEnabled: true and travelSubmitted:false when enabled but not submitted', () => {
      MockDate.set('2018-01-01T13:25:00-04:00');
      const { v2 } = api;
      const sandbox = sinon.createSandbox();
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      const initState = {
        travelQuestion: 'yes',
        travelAddress: 'yes',
        travelMileage: 'yes',
        travelVehicle: 'no',
        features: {
          /* eslint-disable-next-line camelcase */
          check_in_experience_travel_reimbursement: true,
        },
      };
      sandbox.stub(v2, 'postCheckInData').resolves({});

      const action = render(
        <CheckInProvider store={initState}>
          <AppointmentAction
            appointment={{
              checkInWindowEnd: '2018-01-01T12:45:00.106-05:00',
              startTime: '2018-01-01T12:30:00.106-05:00',
              eligibility: ELIGIBILITY.ELIGIBLE,
              clinicIen: '0001',
              stationNo: '0001',
            }}
          />
        </CheckInProvider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
      action.getByTestId('check-in-button').click();
      sandbox.assert.calledWith(v2.postCheckInData, {
        appointmentIen: undefined,
        isTravelEnabled: true,
        setECheckinStartedCalled: undefined,
        travelSubmitted: false,
        uuid: 'some-token',
      });
      sandbox.restore();
    });
  });
});
