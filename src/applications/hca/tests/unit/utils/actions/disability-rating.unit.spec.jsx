import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockApiRequest,
  setFetchJSONResponse,
} from '~/platform/testing/unit/helpers';
import { fetchTotalDisabilityRating } from '../../../../utils/actions/disability-rating';
import { DISABILITY_RATING_ACTIONS } from '../../../../utils/constants';

describe('hca disability rating actions', () => {
  const {
    FETCH_DISABILITY_RATING_STARTED,
    FETCH_DISABILITY_RATING_FAILED,
    FETCH_DISABILITY_RATING_SUCCEEDED,
  } = DISABILITY_RATING_ACTIONS;
  let dispatch;
  let mockData;
  let thunk;

  describe('when `fetchTotalDisabilityRating` executes', () => {
    beforeEach(() => {
      dispatch = sinon.spy();
      mockData = { data: { attributes: { key: 'value' } } };
      thunk = fetchTotalDisabilityRating();
    });

    context('when fetch operation starts', () => {
      it('should dispatch a fetch started action', done => {
        mockApiRequest(mockData);
        thunk(dispatch)
          .then(() => {
            const { type } = dispatch.firstCall.args[0];
            expect(type).to.eq(FETCH_DISABILITY_RATING_STARTED);
          })
          .then(done, done);
      });
    });

    context('when fetch operation succeeds', () => {
      it('should dispatch a fetch succeeded action with data', done => {
        mockApiRequest(mockData);
        thunk(dispatch)
          .then(() => {
            const { type, response } = dispatch.secondCall.args[0];
            expect(type).to.eq(FETCH_DISABILITY_RATING_SUCCEEDED);
            expect(response).to.eq(mockData.data.attributes);
          })
          .then(done, done);
      });
    });

    context('when fetch operation fails', () => {
      it('should dispatch a fetch failed action when the response code is in the 500s', done => {
        mockApiRequest(mockData, false);
        setFetchJSONResponse(
          global.fetch.onCall(0),
          // eslint-disable-next-line prefer-promise-reject-errors
          Promise.reject({ status: 503, error: 'error' }),
        );
        thunk(dispatch)
          .then(() => {
            const { type } = dispatch.secondCall.args[0];
            expect(type).to.eq(FETCH_DISABILITY_RATING_FAILED);
          })
          .then(done, done);
      });

      it('should dispatch a fetch failed action when the response code is in the 400s', done => {
        mockApiRequest(mockData, false);
        setFetchJSONResponse(
          global.fetch.onCall(0),
          // eslint-disable-next-line prefer-promise-reject-errors
          Promise.reject({ status: 403, error: 'error' }),
        );
        thunk(dispatch)
          .then(() => {
            const { type } = dispatch.secondCall.args[0];
            expect(type).to.eq(FETCH_DISABILITY_RATING_FAILED);
          })
          .then(done, done);
      });

      it('should dispatch a fetch failed action when the response code is in the 300s', done => {
        mockApiRequest(mockData, false);
        setFetchJSONResponse(
          global.fetch.onCall(0),
          // eslint-disable-next-line prefer-promise-reject-errors
          Promise.reject({ status: 301, error: 'error' }),
        );
        thunk(dispatch)
          .then(() => {
            const { type } = dispatch.secondCall.args[0];
            expect(type).to.eq(FETCH_DISABILITY_RATING_FAILED);
          })
          .then(done, done);
      });
    });
  });
});
