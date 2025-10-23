import React from 'react';

import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';

import CheckInProvider from '../../../tests/unit/utils/CheckInProvider';
import TestComponent from './TestComponent';
import { api } from '../../../api';

describe('check-in', () => {
  describe('useSendTravelPayClaim hook', () => {
    const sandbox = sinon.createSandbox();
    const { v2 } = api;
    let initState = {};
    beforeEach(() => {
      global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
      initState = {
        features: {
          /* eslint-disable-next-line camelcase */
          check_in_experience_travel_reimbursement: true,
        },
        demographicsUpToDate: 'yes',
        emergencyContactUpToDate: 'yes',
        nextOfKinUpToDate: 'yes',
        travelQuestion: 'yes',
        travelAddress: 'yes',
        travelMileage: 'yes',
        travelReview: 'yes',
        travelVehicle: 'yes',
        appointments: [
          {
            startTime: '2022-08-12T15:15:00',
          },
        ],
      };
      sandbox.stub(v2, 'postDayOfTravelPayClaim').resolves({});
    });
    afterEach(() => {
      sandbox.restore();
    });
    it('Loads test component with hook', () => {
      const screen = render(
        <CheckInProvider store={initState}>
          <TestComponent />
        </CheckInProvider>,
      );
      expect(screen.getByText(/TestComponent/i)).to.exist;
      sandbox.assert.calledOnce(v2.postDayOfTravelPayClaim);
    });
    [
      { featureEnabled: true, expectedValue: true },
      { featureEnabled: false, expectedValue: false },
    ].forEach(({ featureEnabled, expectedValue }) => {
      it(`calls travel api with isV1TravelPayApiEnabled=${expectedValue} when feature toggle is ${featureEnabled}`, () => {
        sandbox.restore();
        sandbox.stub(v2, 'postDayOfTravelPayClaim').resolves({});

        const stateWithFeatureToggle = {
          ...initState,
          features: {
            ...initState.features,
            // eslint-disable-next-line camelcase
            check_in_experience_travel_pay_api: featureEnabled,
          },
        };

        render(
          <CheckInProvider store={stateWithFeatureToggle}>
            <TestComponent />
          </CheckInProvider>,
        );

        sandbox.assert.calledOnce(v2.postDayOfTravelPayClaim);
        const callArgs = v2.postDayOfTravelPayClaim.getCall(0).args;
        expect(callArgs[2]).to.equal(expectedValue);
      });
    });
  });
});
