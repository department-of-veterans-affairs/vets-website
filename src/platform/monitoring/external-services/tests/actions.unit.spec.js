import { expect } from 'chai';
import sinon from 'sinon';

import { mockApiRequest } from 'platform/testing/unit/helpers';

import {
  FETCH_BACKEND_STATUSES_FAILURE,
  FETCH_BACKEND_STATUSES_SUCCESS,
  LOADING_BACKEND_STATUSES,
  getBackendStatuses,
} from '../actions';

describe('External services actions', () => {
  describe('getBackendStatuses', () => {
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

      mockApiRequest(response);
      const dispatch = sinon.spy();
      return getBackendStatuses()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          LOADING_BACKEND_STATUSES,
        );
        expect(dispatch.secondCall.args[0]).to.eql({
          type: FETCH_BACKEND_STATUSES_SUCCESS,
          data: response.data,
        });
      });
    });

    it('should handle an error response', () => {
      const response = {
        data: { attributes: { code: 400 } },
      };

      mockApiRequest(response, false);
      const dispatch = sinon.spy();
      return getBackendStatuses()(dispatch).then(() => {
        expect(dispatch.firstCall.args[0].type).to.equal(
          LOADING_BACKEND_STATUSES,
        );
        expect(dispatch.secondCall.args[0].type).to.equal(
          FETCH_BACKEND_STATUSES_FAILURE,
        );
      });
    });
  });
});
