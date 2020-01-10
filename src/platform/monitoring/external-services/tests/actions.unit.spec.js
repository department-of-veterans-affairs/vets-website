import { expect } from 'chai';
import moment from 'moment-timezone';
import sinon from 'sinon';

import { mockApiRequest } from 'platform/testing/unit/helpers';

import {
  FETCH_BACKEND_STATUSES_FAILURE,
  FETCH_BACKEND_STATUSES_SUCCESS,
  LOADING_BACKEND_STATUSES,
  getBackendStatuses,
} from '../actions';

const originalFetch = global.fetch;

describe('External services actions', () => {
  describe('getBackendStatuses', () => {
    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should handle a success response', () => {
      const response = {
        data: {
          attributes: {
            statuses: [
              {
                service: 'Master Veterans Index (MVI)',
                serviceId: 'mvi',
                status: 'active',
                lastIncidentTimestamp: '2019-07-09T07:00:40.000-04:00',
              },
            ],
          },
        },
      };

      const state = {};

      mockApiRequest(response);
      const dispatch = sinon.spy();
      return getBackendStatuses()(dispatch, state).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          LOADING_BACKEND_STATUSES,
        );
        expect(dispatch.thirdCall.args[0]).to.eql({
          type: FETCH_BACKEND_STATUSES_SUCCESS,
          data: response.data,
        });
      });
    });

    it('should handle an error response', () => {
      const response = {
        data: { attributes: { code: 400 } },
      };

      const state = {};

      mockApiRequest(response, false);
      const dispatch = sinon.spy();
      return getBackendStatuses()(dispatch, state).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          LOADING_BACKEND_STATUSES,
        );
        expect(dispatch.thirdCall.args[0].type).to.equal(
          FETCH_BACKEND_STATUSES_FAILURE,
        );
      });
    });

    describe('downtime notifications', () => {
      const timezone = 'America/New_York';
      const dispatch = sinon.spy();
      const now = moment().tz(timezone);
      const tomorrow = moment()
        .tz(timezone)
        .add(1, 'day');

      beforeEach(() => {
        dispatch.reset();
      });

      xit('should handle global downtime being active', () => {
        const response = {
          data: { attributes: { code: 400 } },
        };
        const downtimeWindow = {
          downtimeStart: now,
          downtimeEnd: tomorrow,
        };
        const state = {
          featureToggles: {
            vaGlobalDowntimeNotification: true,
          },
        };

        mockApiRequest(response);
        return getBackendStatuses(downtimeWindow)(dispatch, state).then(() => {
          expect(dispatch.secondCall.args[0]).to.eql({
            type: FETCH_BACKEND_STATUSES_FAILURE,
            globalDowntimeActive: true,
          });
        });
      });

      xit('should handle global downtime being inactive', () => {
        const response = {
          data: {
            attributes: {
              statuses: [
                {
                  service: 'Master Veterans Index (MVI)',
                  serviceId: 'mvi',
                  status: 'active',
                  lastIncidentTimestamp: '2019-07-09T07:00:40.000-04:00',
                },
              ],
            },
          },
        };

        const downtimeWindow = {
          downtimeStart: tomorrow,
          downtimeEnd: moment()
            .tz(timezone)
            .add(6, 'day'),
        };
        const state = {
          featureToggles: {
            vaGlobalDowntimeNotification: true,
          },
        };

        mockApiRequest(response);

        return getBackendStatuses(downtimeWindow)(dispatch, state).then(() => {
          expect(dispatch.secondCall.args[0]).to.eql({
            type: FETCH_BACKEND_STATUSES_FAILURE,
            globalDowntimeActive: false,
          });
        });
      });

      xit('should respect the feature toggle even during a downtime window', () => {
        const response = {
          data: { attributes: { code: 400 } },
        };
        const downtimeWindow = {
          downtimeStart: now,
          downtimeEnd: tomorrow,
        };
        const state = {
          featureToggles: {
            vaGlobalDowntimeNotification: false,
          },
        };

        mockApiRequest(response);
        return getBackendStatuses(downtimeWindow)(dispatch, state).then(() => {
          expect(dispatch.secondCall.args[0]).to.eql({
            type: FETCH_BACKEND_STATUSES_FAILURE,
            globalDowntimeActive: false,
          });
        });
      });
    });
  });
});
