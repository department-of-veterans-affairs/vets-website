import { expect } from 'chai';
import sinon from 'sinon';
import * as api from 'platform/utilities/api';
import { fetchTotalDisabilityRating } from '../../../../utils/actions';
import { DISABILITY_RATING_ACTIONS } from '../../../../utils/constants';

describe('hca `fetchTotalDisabilityRating` action', () => {
  const {
    FETCH_DISABILITY_RATING_STARTED,
    FETCH_DISABILITY_RATING_FAILED,
    FETCH_DISABILITY_RATING_SUCCEEDED,
  } = DISABILITY_RATING_ACTIONS;
  let apiRequestStub;
  let dispatch;
  let mockData;
  let thunk;

  beforeEach(() => {
    apiRequestStub = sinon.stub(api, 'apiRequest');
    dispatch = sinon.spy();
    mockData = { data: { attributes: { key: 'value' } } };
    thunk = fetchTotalDisabilityRating();
  });

  afterEach(() => {
    apiRequestStub.restore();
  });

  it('should dispatch the correct action when fetch operation starts', done => {
    apiRequestStub.onFirstCall().resolves(mockData);
    thunk(dispatch)
      .then(() => {
        const { type } = dispatch.firstCall.args[0];
        expect(type).to.eq(FETCH_DISABILITY_RATING_STARTED);
      })
      .then(done, done);
  });

  it('should dispatch the correct action with data when fetch operation succeeds', done => {
    apiRequestStub.onFirstCall().resolves(mockData);
    thunk(dispatch)
      .then(() => {
        const { type, response } = dispatch.secondCall.args[0];
        expect(type).to.eq(FETCH_DISABILITY_RATING_SUCCEEDED);
        expect(response).to.eq(mockData.data.attributes);
      })
      .then(done, done);
  });

  it('should dispatch the correct action when fetch operation fails', done => {
    apiRequestStub.onFirstCall().rejects({ status: 503, error: 'error' });
    thunk(dispatch)
      .then(() => {
        const { type } = dispatch.secondCall.args[0];
        expect(type).to.eq(FETCH_DISABILITY_RATING_FAILED);
      })
      .then(done, done);
  });
});
