import chai from 'chai';
import reducer from '../../../src/js/feedback/reducers';
import {
  SEND_FEEDBACK,
  FEEDBACK_RECEIVED,
  FEEDBACK_ERROR,
  CLEAR_FEEDBACK_ERROR
} from '../../../src/js/feedback/actions';

const reducerInterface = ['requestPending', 'feedbackReceived', 'errorMessage', 'formErrors', 'formHasValidated', 'formIsVisible', 'formValues'];

describe('Feedback Reducer', () => {

  it('returns the initial state', () => {
    const result = reducer(undefined, { type: 'NOT_RELEVANT_TO_FEEDBACK' });
    chai.assert.containsAllKeys(result, reducerInterface);
  });

  it('sets requestPending to true during action type SEND_FEEDBACK', () => {
    const result = reducer(undefined, { type: SEND_FEEDBACK, values: {} });
    chai.assert.isTrue(result.requestPending, 'Request pending is set to true');
  });

  it('sets requestPending to false during action type FEEDBACK_RECEIVED', () => {
    const result = reducer(undefined, { type: FEEDBACK_RECEIVED });
    chai.assert.isFalse(result.requestPending, 'Request pending is set to false');
  });

  it('sets the errorMessage to a string during action type FEEDBACK_ERROR anc clears it during CLEAR_FEEDBACK_ERROR', () => {
    const message = 'My message';
    const result = reducer(undefined, { type: FEEDBACK_ERROR, message });
    chai.assert.equal(result.errorMessage, message, 'The error message was set correctly.');

    const result2 = reducer(result, { type: CLEAR_FEEDBACK_ERROR });
    chai.assert.isNull(result2.errorMessage, 'The error message is null.');
  });

});
