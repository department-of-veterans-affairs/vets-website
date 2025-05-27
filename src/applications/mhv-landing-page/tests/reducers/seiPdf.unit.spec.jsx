import { expect } from 'chai';

import reducer, {
  GET_SEI_PDF,
  GET_SEI_PDF_SUCCESS,
  GET_SEI_PDF_FAILED,
} from '../../reducers/seiPdfReducer';

const errorResponse = 'error response';

const failedDomains = ['domain1', 'domain2'];

describe('seiPdfReducer', () => {
  let state;
  let nextState;
  let action;

  beforeEach(() => {
    state = undefined;
  });

  describe('action.type: GET_SEI_PDF', () => {
    it('sets loading', () => {
      action = {
        type: GET_SEI_PDF,
      };
      nextState = reducer(state, action);
      expect(nextState.loading).to.be.true;
    });
  });

  describe('action.type: GET_SEI_PDF_SUCCESS', () => {
    it('sets formData', () => {
      action = {
        type: GET_SEI_PDF_SUCCESS,
        failedDomains,
      };
      nextState = reducer(state, action);
      expect(nextState.loading).to.be.false;
      expect(nextState.successfulDownload).to.be.true;
      expect(nextState.failedDownload).to.be.false;
      expect(nextState.failedDomains).to.equal(failedDomains);
    });
  });
  describe('action.type: GET_SEI_PDF_FAILED', () => {
    it('sets error', () => {
      action = {
        type: GET_SEI_PDF_FAILED,
        error: errorResponse,
      };
      nextState = reducer(state, action);
      expect(nextState.loading).to.be.false;
      expect(nextState.successfulDownload).to.be.false;
      expect(nextState.failedDownload).to.be.true;
    });
  });
});
