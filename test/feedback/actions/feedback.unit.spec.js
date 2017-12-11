import chai from 'chai';
import sinon from 'sinon';
import {
  sendFeedback,
  clearError,
  SEND_FEEDBACK,
  FEEDBACK_RECEIVED,
  FEEDBACK_ERROR,
  CLEAR_FEEDBACK_ERROR
} from '../../../src/js/feedback/actions';

describe('sendFeedback', function() {

  let dispatch = sinon.spy();
  let old = { sessionStorage: global.sessionStorage, fetch: global.fetch };
  let fetch = null;
  let fetchResponse = {
    ok: true,
    json(){},
    headers: {
      get: key => ({ 'content-type' : 'application/json' }[key])
    }
  };

  before(() => {
    global.sessionStorage = {};
    global.fetch = fetch = sinon.spy((url, settings) => Promise.resolve(fetchResponse));
  });

  after(() => {
    global.fetch = old.fetch;
    global.sessionStorage = old.sessionStorage;
  });

  afterEach(() => {
    fetch.reset();
    dispatch.reset();
  });

  it('dispatches SEND_FEEDBACK and FEEDBACK_RECEIVED when there is a successful request', (done) => {

    const actionCreator = sendFeedback({ description: 'My feedback description', email: 'test@test.com' });
    const result = actionCreator(dispatch);

    result.then(() => {

      chai.assert.isTrue(fetch.calledOnce, 'Fetch was called');
      chai.assert.isTrue(dispatch.calledTwice, 'There were two actions dispatched.');

      const firstAction = dispatch.args[0][0];
      const secondAction = dispatch.args[1][0];

      chai.assert.equal(firstAction.type, SEND_FEEDBACK, 'The SEND_FEEDBACK action was dispatched.');
      chai.assert.equal(secondAction.type, FEEDBACK_RECEIVED, 'The FEEDBACK_RECEIVED action was dispatched.');

    }).then(done, done);
  })

  it('dispatches FEEDBACK_ERROR when response.ok is false', (done) => {
    fetchResponse.ok = false;

    const actionCreator = sendFeedback({ description: 'My feedback description', email: 'test@test.com' });
    const result = actionCreator(dispatch);

    result.then(() => {

      chai.assert.isTrue(fetch.calledOnce, 'Fetch was called');
      chai.assert.isTrue(dispatch.calledTwice, 'There were two actions dispatched.');

      const firstAction = dispatch.args[0][0];
      const secondAction = dispatch.args[1][0];

      chai.assert.equal(firstAction.type, SEND_FEEDBACK, 'The SEND_FEEDBACK action was dispatched.');
      chai.assert.equal(secondAction.type, FEEDBACK_ERROR, 'The FEEDBACK_ERROR action was dispatched.');
      chai.assert.isString(secondAction.message, 'The FEEDBACK_ERROR action also contained an error message.');

    }).then(done, done);
  });
});

describe('clearError', function() {
  it('returns type CLEAR_FEEDBACK_ERROR', () => {
    const result = clearError();
    chai.assert.equal(result.type, CLEAR_FEEDBACK_ERROR, 'The CLEAR_FEEDBACK_ERROR action was returned.');
  })
})
