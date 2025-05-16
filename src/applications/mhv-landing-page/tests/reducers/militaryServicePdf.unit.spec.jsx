import { expect } from 'chai';

import reducer, {
  GET_MILITARY_SERVICE_PDF,
  GET_MILITARY_SERVICE_PDF_SUCCESS,
  GET_MILITARY_SERVICE_PDF_FAILED,
} from '../../reducers/militaryServicePdfReducer';

const errorResponse = 'error response';

describe('militaryServicePdfReducer', () => {
  let state;
  let nextState;
  let action;

  beforeEach(() => {
    state = undefined;
  });

  describe('action.type: GET_MILITARY_SERVICE_PDF', () => {
    it('sets loading', () => {
      action = {
        type: GET_MILITARY_SERVICE_PDF,
      };
      nextState = reducer(state, action);
      expect(nextState.loading).to.be.true;
    });
  });

  describe('action.type: GET_MILITARY_SERVICE_PDF_SUCCESS', () => {
    it('sets formData', () => {
      action = {
        type: GET_MILITARY_SERVICE_PDF_SUCCESS,
      };
      nextState = reducer(state, action);
      expect(nextState.loading).to.be.false;
      expect(nextState.successfulDownload).to.be.true;
      expect(nextState.failedDownload).to.be.false;
      expect(nextState.error).to.be.false;
    });
  });

  describe('action.type: GET_MILITARY_SERVICE_PDF_FAILED', () => {
    it('sets error', () => {
      action = {
        type: GET_MILITARY_SERVICE_PDF_FAILED,
        error: errorResponse,
      };
      nextState = reducer(state, action);
      expect(nextState.loading).to.be.false;
      expect(nextState.successfulDownload).to.be.false;
      expect(nextState.failedDownload).to.be.true;
      expect(nextState.error).to.equal(errorResponse);
    });
  });
});
