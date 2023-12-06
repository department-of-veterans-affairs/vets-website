import { expect } from 'chai';
import sinon from 'sinon';
import {
  mockFetch,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from '~/platform/testing/unit/helpers';

import {
  FETCH_RATED_DISABILITIES_SUCCESS,
  FETCH_RATED_DISABILITIES_FAILED,
  FETCH_TOTAL_RATING_SUCCEEDED,
  FETCH_TOTAL_RATING_FAILED,
  fetchRatedDisabilities,
  fetchTotalDisabilityRating,
} from '../../actions';

describe('Rated Disabilities actions: fetchRatedDisabilities', () => {
  beforeEach(() => mockFetch());

  it('should fetch rated disabilities', () => {
    const disabilities = [
      {
        name: 'PTSD',
        date: '01/01/1990',
        related: true,
      },
      {
        name: 'Head Trauma',
        date: '01/01/1990',
        related: false,
      },
    ];

    setFetchJSONResponse(global.fetch.onCall(0), disabilities);
    const thunk = fetchRatedDisabilities();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          FETCH_RATED_DISABILITIES_SUCCESS,
        );
      }
    };
    thunk(dispatch);
  });

  it('should handle an error returned', () => {
    const response = {
      errors: [
        {
          code: '500',
          status: 'some status',
        },
      ],
    };
    setFetchJSONFailure(global.fetch.onCall(0), response);
    const thunk = fetchRatedDisabilities();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          FETCH_RATED_DISABILITIES_FAILED,
        );
      }
    };
    thunk(dispatch);
  });
});

describe('Rated Disabilities actions: fetchTotalDisabilityRating', () => {
  beforeEach(() => mockFetch());

  it('should fetch the total rating', () => {
    const total = { data: { attributes: { userPercentOfDisability: 80 } } };
    setFetchJSONResponse(global.fetch.onCall(0), total);
    const thunk = fetchTotalDisabilityRating();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          FETCH_TOTAL_RATING_SUCCEEDED,
        );
      }
    };
    thunk(dispatch);
  });

  it('should attach the appropriate source to the analytics event when EVSS is source', () => {
    const total = {
      data: {
        attributes: { userPercentOfDisability: 80, sourceSystem: 'EVSS' },
      },
    };
    setFetchJSONResponse(global.fetch.onCall(0), total);
    const analyticsSpy = sinon.spy();
    const thunk = fetchTotalDisabilityRating(analyticsSpy);
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);

      if (dispatchSpy.callCount === 2) {
        expect(analyticsSpy.calledOnce).to.be.true;
        expect(analyticsSpy.firstCall.args[0]['api-name'].includes('EVSS')).to
          .be.true;
      }
    };

    thunk(dispatch);
  });

  it('should attach the appropriate source to the analytics event when Lighthouse is source', () => {
    const total = {
      data: {
        attributes: { userPercentOfDisability: 80, sourceSystem: 'Lighthouse' },
      },
    };
    setFetchJSONResponse(global.fetch.onCall(0), total);
    const analyticsSpy = sinon.spy();
    const thunk = fetchTotalDisabilityRating(analyticsSpy);
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);

      if (dispatchSpy.callCount === 2) {
        expect(analyticsSpy.calledOnce).to.be.true;
        expect(
          analyticsSpy.firstCall.args[0]['api-name'].includes('Lighthouse'),
        ).to.be.true;
      }
    };

    thunk(dispatch);
  });

  it('should succeed and format the analytics string if source is missing in the response', () => {
    const total = {
      data: {
        attributes: { userPercentOfDisability: 80 },
      },
    };
    setFetchJSONResponse(global.fetch.onCall(0), total);
    const analyticsSpy = sinon.spy();
    const thunk = fetchTotalDisabilityRating(analyticsSpy);
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);

      if (dispatchSpy.callCount === 2) {
        expect(analyticsSpy.calledOnce).to.be.true;
        expect(analyticsSpy.firstCall.args[0]['api-name']).to.equal(
          'GET disability rating',
        );
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          FETCH_TOTAL_RATING_SUCCEEDED,
        );
      }
    };

    thunk(dispatch);
  });

  it('should pass source to error analytics call if present', () => {
    const response = {
      data: {
        attributes: { sourceSystem: 'EVSS' },
      },
      errors: [
        {
          code: '500',
          status: 'some status',
        },
      ],
    };
    setFetchJSONResponse(global.fetch.onCall(0), response);
    const analyticsSpy = sinon.spy();
    const thunk = fetchTotalDisabilityRating(analyticsSpy);
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          FETCH_TOTAL_RATING_FAILED,
        );
        expect(analyticsSpy.calledOnce).to.be.true;
        expect(analyticsSpy.firstCall.args[0]['api-name'].includes('EVSS')).to
          .be.true;
      }
    };
    thunk(dispatch);
  });

  it('should handle an error returned', () => {
    const response = {
      errors: [
        {
          code: '500',
          status: 'some status',
        },
      ],
    };
    setFetchJSONResponse(global.fetch.onCall(0), response);
    const thunk = fetchTotalDisabilityRating();
    const dispatchSpy = sinon.spy();
    const dispatch = action => {
      dispatchSpy(action);
      if (dispatchSpy.callCount === 2) {
        expect(dispatchSpy.secondCall.args[0].type).to.equal(
          FETCH_TOTAL_RATING_FAILED,
        );
      }
    };
    thunk(dispatch);
  });
});
