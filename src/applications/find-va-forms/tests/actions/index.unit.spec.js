// Dependencies.
import { expect } from 'chai';
import sinon from 'sinon';

// Relative imports.
import {
  fetchFormsAction,
  fetchFormsFailure,
  fetchFormsSuccess,
  fetchFormsThunk,
} from '../../actions';
import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
} from '../../constants';

describe('Find VA Forms actions', () => {
  describe('fetchFormsAction', () => {
    it('should return an action in the shape we expect', () => {
      const query = 'some text';
      const result = fetchFormsAction(query);

      expect(result).to.be.deep.equal({
        type: FETCH_FORMS,
        query,
      });
    });
  });

  describe('fetchFormsFailure', () => {
    it('should return an action in the shape we expect', () => {
      const result = fetchFormsFailure();

      expect(result).to.be.deep.equal({
        type: FETCH_FORMS_FAILURE,
      });
    });
  });

  describe('fetchFormsSuccess', () => {
    it('should return an action in the shape we expect', () => {
      const response = {};
      const result = fetchFormsSuccess(response);

      expect(result).to.be.deep.equal({
        response,
        type: FETCH_FORMS_SUCCESS,
      });
    });
  });

  describe('fetchFormsThunk', () => {
    let oldWindow;

    beforeEach(() => {
      oldWindow = global.window;
      global.window = {
        location: {
          search: '',
          pathname: '',
        },
        history: {
          replaceState: sinon.stub(),
        },
      };
    });

    afterEach(() => {
      global.window = oldWindow;
    });

    it('updates search params', async () => {
      const dispatch = () => {};
      const query = 'health';
      const thunk = fetchFormsThunk(query);

      await thunk(dispatch);

      const replaceStateStub = global.window.history.replaceState;

      expect(replaceStateStub.calledOnce).to.be.true;
      expect(replaceStateStub.firstCall.args[2]).to.be.equal('?q=health');
    });

    it('calls dispatch', async () => {
      const dispatch = sinon.stub();
      const query = 'health';
      const thunk = fetchFormsThunk(query);

      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: FETCH_FORMS,
          query,
        }),
      ).to.be.true;

      const secondCallAction = dispatch.secondCall.args[0];

      expect(secondCallAction.type).to.be.equal(FETCH_FORMS_SUCCESS);
      expect(secondCallAction.response).to.have.keys(['data']);
    });
  });
});
