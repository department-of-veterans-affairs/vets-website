import { expect } from 'chai';
import sinon from 'sinon';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { getAppealsV2 } from '../../actions';

import {
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_SUCCESS,
  USER_FORBIDDEN_ERROR,
  RECORD_NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  BACKEND_SERVICE_ERROR,
  FETCH_APPEALS_ERROR,
} from '../../actions/types';

const setup = () => {
  const response = {
    url: environment.API_URL,
    status: 200,
    headers: { get: () => 'application/json' },
    ok: true,
    json: () =>
      Promise.resolve({
        data: [],
      }),
  };
  mockFetch(response);
};

describe('getAppealsV2', () => {
  beforeEach(setup);

  it('dispatches FETCH_APPEALS_PENDING', done => {
    const thunk = getAppealsV2();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(FETCH_APPEALS_PENDING);
      })
      .then(done, done);
  });

  it('dispatches FETCH_APPEALS_SUCCESS', done => {
    const thunk = getAppealsV2();
    const dispatch = sinon.spy();
    thunk(dispatch)
      .then(() => {
        const action = dispatch.secondCall.args[0];
        expect(action.type).to.equal(FETCH_APPEALS_SUCCESS);
      })
      .then(done, done);
  });

  const appealsErrors = {
    403: USER_FORBIDDEN_ERROR,
    404: RECORD_NOT_FOUND_ERROR,
    422: VALIDATION_ERROR,
    502: BACKEND_SERVICE_ERROR,
    504: FETCH_APPEALS_ERROR, // works for any unspecified error code
  };

  Object.keys(appealsErrors).forEach(code => {
    it(`Dispatches ${
      appealsErrors[code]
    } when GET fails with ${code}`, done => {
      global.fetch.onCall(0).rejects({
        errors: [{ status: `${code}` }],
      });
      const thunk = getAppealsV2();
      const dispatch = sinon.spy();
      thunk(dispatch)
        .then(() => {
          const action = dispatch.secondCall.args[0];
          expect(action.type).to.equal(appealsErrors[code]);
        })
        .then(done, done);
    });
  });
});
