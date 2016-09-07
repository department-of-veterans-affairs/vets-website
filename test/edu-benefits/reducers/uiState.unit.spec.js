import { expect } from 'chai';

import uiStateReducer from '../../../src/js/edu-benefits/reducers/uiState/index';
import {
  UPDATE_COMPLETED_STATUS,
  UPDATE_INCOMPLETE_STATUS,
  UPDATE_REVIEW_STATUS,
  UPDATE_VERIFIED_STATUS,
  UPDATE_SUBMISSION_STATUS,
  UPDATE_SUBMISSION_ID,
  UPDATE_SUBMISSION_TIMESTAMP
} from '../../../src/js/edu-benefits/actions/index';

describe('uiState reducer', () => {
  it('should set the complete status', () => {
    const uiState = {
      pages: {
        '/path': {
          complete: false
        }
      }
    };
    const newState = uiStateReducer(uiState, { type: UPDATE_COMPLETED_STATUS, path: '/path' });
    expect(newState.pages['/path'].complete).to.be.true;
  });
  it('should set the incomplete status', () => {
    const uiState = {
      pages: {
        '/path': {
          complete: true
        }
      }
    };
    const newState = uiStateReducer(uiState, { type: UPDATE_INCOMPLETE_STATUS, path: '/path' });
    expect(newState.pages['/path'].complete).to.be.false;
  });
  it('should set the review status', () => {
    const uiState = {
      pages: {
        '/path': {
          complete: true
        }
      }
    };
    const newState = uiStateReducer(uiState, { type: UPDATE_REVIEW_STATUS, path: '/path', value: false });
    expect(newState.pages['/path'].complete).to.be.false;
  });
  it('should set the verified status', () => {
    const uiState = {
      pages: {
        '/path': {
          verified: true
        }
      }
    };
    const newState = uiStateReducer(uiState, { type: UPDATE_VERIFIED_STATUS, path: '/path', value: false });
    expect(newState.pages['/path'].verified).to.be.false;
  });
  it('should set the submission status', () => {
    const uiState = {
      submission: {
        status: false
      }
    };
    const newState = uiStateReducer(uiState, { type: UPDATE_SUBMISSION_STATUS, value: true });
    expect(newState.submission.status).to.be.true;
  });
  it('should set the submission id', () => {
    const uiState = {
      submission: {
        id: false
      }
    };
    const newState = uiStateReducer(uiState, { type: UPDATE_SUBMISSION_ID, value: 'idnumber' });
    expect(newState.submission.id).to.equal('idnumber');
  });
  it('should set the submission timestamp', () => {
    const uiState = {
      submission: {
        timestamp: false
      }
    };
    const newState = uiStateReducer(uiState, { type: UPDATE_SUBMISSION_TIMESTAMP, value: '2016-05-24T00:00:00' });
    expect(newState.submission.timestamp).to.equal('2016-05-24T00:00:00');
  });
});
