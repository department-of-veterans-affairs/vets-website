import { expect } from 'chai';

import {
  GET_MDOT_IN_PROGRESS_FORM_STARTED,
  GET_MDOT_IN_PROGRESS_FORM_SUCCEEDED,
  GET_MDOT_IN_PROGRESS_FORM_FAILED,
} from '../../actions/mdotInProgressForm';
import { mdotInProgressFormReducer as reducer } from '../../reducers/mdotInProgressFormReducer';
import { internalServerError } from '../../mocks/errors';
import mockEndpoints from '../../mocks';

const inProgressFormBody = mockEndpoints['GET /v0/in_progress_forms/MDOT'];

describe('mdotInProgressFormReducer', () => {
  let state;
  let nextState;
  let action;

  beforeEach(() => {
    state = undefined;
  });

  describe('action.type: GET_MDOT_IN_PROGRESS_FORM_STARTED', () => {
    it('sets loading', () => {
      action = {
        type: GET_MDOT_IN_PROGRESS_FORM_STARTED,
      };
      nextState = reducer(state, action);
      expect(nextState.loading).to.be.true;
    });
  });

  describe('action.type: GET_MDOT_IN_PROGRESS_FORM_SUCCEEDED', () => {
    it('sets formData', () => {
      action = {
        type: GET_MDOT_IN_PROGRESS_FORM_SUCCEEDED,
        payload: inProgressFormBody,
      };
      nextState = reducer(state, action);
      expect(nextState.formData).to.deep.equal(inProgressFormBody.formData);
      expect(nextState.loading).to.be.false;
      expect(nextState.error).to.be.false;
    });
  });

  describe('action.type: GET_MDOT_IN_PROGRESS_FORM_FAILED', () => {
    it('sets error', () => {
      action = {
        type: GET_MDOT_IN_PROGRESS_FORM_FAILED,
        payload: internalServerError,
      };
      nextState = reducer(state, action);
      expect(nextState.error).to.deep.equal(internalServerError.errors.at(0));
      expect(nextState.loading).to.be.false;
      expect(nextState.formData).to.deep.equal({});
    });
  });
});
