import { expect } from 'chai';
import sinon from 'sinon';
import { v2 } from './v2';

describe('check-in', () => {
  describe('v2 API', () => {
    const sandbox = sinon.createSandbox();
    let makeApiCallWithSentryStub;
    let apiRequestStub;
    let environment;

    beforeEach(() => {
      makeApiCallWithSentryStub = sandbox.stub(
        require('../utils'),
        'makeApiCallWithSentry',
      );
      apiRequestStub = sandbox.stub();
      sandbox
        .stub(
          require('@department-of-veterans-affairs/platform-utilities/exports'),
          'apiRequest',
        )
        .returns(apiRequestStub);

      // Mock environment
      environment = require('@department-of-veterans-affairs/platform-utilities/environment');
      environment.API_URL = 'https://dev-api.va.gov';
    });

    afterEach(() => {
      sandbox.restore();
    });

    describe('getSession', () => {
      it('constructs correct URL with token only', async () => {
        const mockResponse = { sessionData: 'test' };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const params = { token: 'test-token-123' };
        const result = await v2.getSession(params);

        expect(makeApiCallWithSentryStub.calledOnce).to.be.true;
        const [, eventLabel, token] = makeApiCallWithSentryStub.getCall(0).args;
        expect(eventLabel).to.equal('day-of-get-current-session-dob');
        expect(token).to.equal('test-token-123');
        expect(result).to.deep.equal(mockResponse);
      });

      it('constructs correct URL with checkInType', async () => {
        const mockResponse = { sessionData: 'test' };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const params = {
          token: 'test-token-123',
          checkInType: 'preCheckIn',
        };
        await v2.getSession(params);

        const [, eventLabel] = makeApiCallWithSentryStub.getCall(0).args;
        expect(eventLabel).to.equal('preCheckIn-get-current-session-dob');
      });

      it('constructs correct URL with facilityType', async () => {
        const mockResponse = { sessionData: 'test' };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const params = {
          token: 'test-token-123',
          facilityType: 'va_medical_center',
        };
        await v2.getSession(params);

        expect(makeApiCallWithSentryStub.calledOnce).to.be.true;
      });
    });

    describe('postSession', () => {
      it('posts session data with correct format', async () => {
        const mockResponse = { success: true };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const params = {
          lastName: ' Smith ',
          dob: '1990-01-01',
          token: 'test-token-123',
          checkInType: 'dayOf',
          facilityType: 'va_medical_center',
        };

        const result = await v2.postSession(params);

        expect(makeApiCallWithSentryStub.calledOnce).to.be.true;
        const [, eventLabel, token] = makeApiCallWithSentryStub.getCall(0).args;
        expect(eventLabel).to.equal('dayOf-validating-user-dob');
        expect(token).to.equal('test-token-123');
        expect(result).to.deep.equal(mockResponse);
      });

      it('trims lastName and uses default checkInType', async () => {
        const mockResponse = { success: true };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const params = {
          lastName: ' Smith ',
          dob: '1990-01-01',
          token: 'test-token-123',
        };

        await v2.postSession(params);

        const [, eventLabel] = makeApiCallWithSentryStub.getCall(0).args;
        expect(eventLabel).to.equal('day-of-validating-user-dob');
      });
    });

    describe('getCheckInData', () => {
      it('gets check-in data with token only', async () => {
        const mockResponse = { checkInData: 'test' };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const result = await v2.getCheckInData('test-token-123');

        expect(makeApiCallWithSentryStub.calledOnce).to.be.true;
        const [, eventLabel, token] = makeApiCallWithSentryStub.getCall(0).args;
        expect(eventLabel).to.equal('get-lorota-data');
        expect(token).to.equal('test-token-123');
        expect(result).to.deep.equal(mockResponse);
      });

      it('gets check-in data with facilityType', async () => {
        const mockResponse = { checkInData: 'test' };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const result = await v2.getCheckInData(
          'test-token-123',
          'va_medical_center',
        );

        expect(makeApiCallWithSentryStub.calledOnce).to.be.true;
        expect(result).to.deep.equal(mockResponse);
      });
    });

    describe('postCheckInData', () => {
      it('posts check-in data with correct structure', async () => {
        const mockResponse = { success: true };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const params = {
          uuid: 'test-uuid',
          appointmentIen: '12345',
          setECheckinStartedCalled: true,
          isTravelEnabled: true,
          travelSubmitted: false,
        };

        const result = await v2.postCheckInData(params);

        expect(makeApiCallWithSentryStub.calledOnce).to.be.true;
        const [, eventLabel, uuid] = makeApiCallWithSentryStub.getCall(0).args;
        expect(eventLabel).to.equal('check-in-user');
        expect(uuid).to.equal('test-uuid');
        expect(result).to.deep.equal(mockResponse);
      });

      it('uses correct event label when setECheckinStartedCalled is false', async () => {
        const mockResponse = { success: true };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const params = {
          uuid: 'test-uuid',
          appointmentIen: '12345',
          setECheckinStartedCalled: false,
          isTravelEnabled: true,
          travelSubmitted: false,
        };

        await v2.postCheckInData(params);

        const [, eventLabel] = makeApiCallWithSentryStub.getCall(0).args;
        expect(eventLabel).to.equal('check-in-user-45MR');
      });
    });

    describe('getPreCheckInData', () => {
      it('gets pre-check-in data with correct parameters', async () => {
        const mockResponse = { preCheckInData: 'test' };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const result = await v2.getPreCheckInData('test-token-123');

        expect(makeApiCallWithSentryStub.calledOnce).to.be.true;
        const [, eventLabel, token] = makeApiCallWithSentryStub.getCall(0).args;
        expect(eventLabel).to.equal('get-lorota-data');
        expect(token).to.equal('test-token-123');
        expect(result).to.deep.equal(mockResponse);
      });
    });

    describe('postPreCheckInData', () => {
      it('posts pre-check-in data with default checkInType', async () => {
        const mockResponse = { success: true };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const params = {
          uuid: 'test-uuid',
          demographicsUpToDate: 'yes',
          nextOfKinUpToDate: 'yes',
          emergencyContactUpToDate: 'yes',
        };

        const result = await v2.postPreCheckInData(params);

        expect(makeApiCallWithSentryStub.calledOnce).to.be.true;
        const [, eventLabel, uuid] = makeApiCallWithSentryStub.getCall(0).args;
        expect(eventLabel).to.equal('pre-check-in-user');
        expect(uuid).to.equal('test-uuid');
        expect(result).to.deep.equal(mockResponse);
      });
    });

    describe('patchDayOfDemographicsData', () => {
      it('patches demographics data with correct structure', async () => {
        const mockResponse = { success: true };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const params = {
          uuid: 'test-uuid',
          demographicsUpToDate: 'yes',
          nextOfKinUpToDate: 'no',
          emergencyContactUpToDate: 'yes',
        };

        const result = await v2.patchDayOfDemographicsData(params);

        expect(makeApiCallWithSentryStub.calledOnce).to.be.true;
        const [, eventLabel, uuid] = makeApiCallWithSentryStub.getCall(0).args;
        expect(eventLabel).to.equal('patch-demographics-update-flags');
        expect(uuid).to.equal('test-uuid');
        expect(result).to.deep.equal(mockResponse);
      });
    });

    describe('postDayOfTravelPayClaim', () => {
      [
        { isV1TravelPayAPIEnabled: true, expectedVersion: 'v1' },
        { isV1TravelPayAPIEnabled: false, expectedVersion: 'v0' },
      ].forEach(({ isV1TravelPayAPIEnabled, expectedVersion }) => {
        it(`uses ${expectedVersion} API when isV1TravelPayAPIEnabled is ${isV1TravelPayAPIEnabled}`, async () => {
          const mockResponse = { claimId: '12345' };
          makeApiCallWithSentryStub.resolves(mockResponse);

          const data = {
            uuid: 'test-uuid',
            appointmentDate: '2024-03-12',
          };

          const result = await v2.postDayOfTravelPayClaim(
            data,
            true,
            isV1TravelPayAPIEnabled,
          );

          expect(makeApiCallWithSentryStub.calledOnce).to.be.true;
          const [
            ,
            eventLabel,
            uuid,
            enableSentry,
          ] = makeApiCallWithSentryStub.getCall(0).args;
          expect(eventLabel).to.equal('submit-travel-pay-claim');
          expect(uuid).to.equal('test-uuid');
          expect(enableSentry).to.be.true;
          expect(result).to.deep.equal(mockResponse);
        });
      });

      it('uses correct event label when setECheckinStartedCalled is false', async () => {
        const mockResponse = { claimId: '12345' };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const data = {
          uuid: 'test-uuid',
          appointmentDate: '2024-03-12',
        };

        await v2.postDayOfTravelPayClaim(data, false, false);

        const [, eventLabel] = makeApiCallWithSentryStub.getCall(0).args;
        expect(eventLabel).to.equal('submit-travel-pay-claim-45MR');
      });
    });

    describe('postTravelOnlyClaim', () => {
      [
        { isV1TravelPayAPIEnabled: true, expectedVersion: 'v1' },
        { isV1TravelPayAPIEnabled: false, expectedVersion: 'v0' },
      ].forEach(({ isV1TravelPayAPIEnabled, expectedVersion }) => {
        it(`uses ${expectedVersion} API when isV1TravelPayAPIEnabled is ${isV1TravelPayAPIEnabled}`, async () => {
          const mockResponse = { claimId: '12345' };
          makeApiCallWithSentryStub.resolves(mockResponse);

          const result = await v2.postTravelOnlyClaim(
            '2024-03-12T10:00:00',
            'test-uuid',
            300,
            isV1TravelPayAPIEnabled,
          );

          expect(makeApiCallWithSentryStub.calledOnce).to.be.true;
          const [
            ,
            eventLabel,
            uuid,
            enableSentry,
          ] = makeApiCallWithSentryStub.getCall(0).args;
          expect(eventLabel).to.equal('travel-claim-submit-travel-pay-claim');
          expect(uuid).to.equal('test-uuid');
          expect(enableSentry).to.be.true;
          expect(result).to.deep.equal(mockResponse);
        });
      });

      it('includes correct travel claim data structure', async () => {
        const mockResponse = { claimId: '12345' };
        makeApiCallWithSentryStub.resolves(mockResponse);

        await v2.postTravelOnlyClaim(
          '2024-03-12T10:00:00',
          'test-uuid',
          300,
          false,
        );

        expect(makeApiCallWithSentryStub.calledOnce).to.be.true;
      });
    });

    describe('getUpcomingAppointmentsData', () => {
      it('gets upcoming appointments with correct date range', async () => {
        const mockResponse = { appointments: [] };
        makeApiCallWithSentryStub.resolves(mockResponse);

        const result = await v2.getUpcomingAppointmentsData('test-token-123');

        expect(makeApiCallWithSentryStub.calledOnce).to.be.true;
        const [, eventLabel, token] = makeApiCallWithSentryStub.getCall(0).args;
        expect(eventLabel).to.equal('get-upcoming-appointment-data');
        expect(token).to.equal('test-token-123');
        expect(result).to.deep.equal(mockResponse);
      });
    });

    describe('error handling', () => {
      it('propagates errors from makeApiCallWithSentry', async () => {
        const error = new Error('API Error');
        makeApiCallWithSentryStub.rejects(error);

        try {
          await v2.getSession({ token: 'test-token' });
          expect.fail('Should have thrown an error');
        } catch (err) {
          expect(err).to.equal(error);
        }
      });
    });
  });
});
