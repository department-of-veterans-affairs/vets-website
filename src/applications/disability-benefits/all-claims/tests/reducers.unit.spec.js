import { expect } from 'chai';

import { requestStates } from '../../../../platform/utilities/constants';
import { itfStatuses } from '../constants';

import {
  ITF_FETCH_INITIATED,
  ITF_FETCH_SUCCEEDED,
  ITF_FETCH_FAILED,
  ITF_CREATION_INITIATED,
  ITF_CREATION_SUCCEEDED,
  ITF_CREATION_FAILED,
} from '../actions';

import reducers from '../reducers';

const initialState = {
  fetchCallState: requestStates.notCalled,
  creationCallState: requestStates.notCalled,
  currentITF: null,
  previousITF: null,
};

describe('ITF reducer', () => {
  const { itf } = reducers;

  it('should handle ITF_FETCH_INITIATED', () => {
    const newState = itf(initialState, { type: ITF_FETCH_INITIATED });
    expect(newState.fetchCallState).to.equal(requestStates.pending);
  });

  describe('ITF_FETCH_SUCCEEDED', () => {
    // These also test that it filters for compensation ITFs
    it('should set the currentITF to the active one if present', () => {
      const action = {
        type: ITF_FETCH_SUCCEEDED,
        data: {
          attributes: {
            intentToFile: [
              {
                type: 'something not compensation',
                status: itfStatuses.active,
              },
              {
                type: 'compensation',
                status: itfStatuses.active,
                expirationDate: '2014-07-28T19:53:45.810+0000',
              },
              {
                // duplicate ITF with later expiration date; should use the active one
                type: 'compensation',
                status: itfStatuses.duplicate,
                expirationDate: '2015-07-28T19:53:45.810+0000',
              },
            ],
          },
        },
      };
      const newState = itf(initialState, action);
      expect(newState.currentITF.status).to.equal(itfStatuses.active);
    });

    it('should set the currentITF to the one with the latest expiration date if no active one is present', () => {
      const action = {
        type: ITF_FETCH_SUCCEEDED,
        data: {
          attributes: {
            intentToFile: [
              {
                type: 'something not compensation',
                status: itfStatuses.active,
              },
              {
                type: 'compensation',
                status: itfStatuses.expired,
                expirationDate: '2014-07-28T19:53:45.810+0000',
              },
              {
                type: 'compensation',
                status: itfStatuses.duplicate,
                expirationDate: '2015-07-28T19:53:45.810+0000',
              },
            ],
          },
        },
      };
      const newState = itf(initialState, action);
      expect(newState.currentITF.status).to.equal(itfStatuses.duplicate);
    });
  });

  it('should handle ITF_FETCH_FAILED', () => {
    const newState = itf(initialState, { type: ITF_FETCH_FAILED });
    expect(newState.fetchCallState).to.equal(requestStates.failed);
  });

  it('should handle ITF_CREATION_INITIATED', () => {
    const newState = itf(initialState, { type: ITF_CREATION_INITIATED });
    expect(newState.creationCallState).to.equal(requestStates.pending);
  });

  it('should handle ITF_CREATION_SUCCEEDED', () => {
    const action = {
      type: ITF_CREATION_SUCCEEDED,
      data: {
        attributes: {
          intentToFile: 'new itf',
        },
      },
    };
    const newState = itf({ currentITF: 'old itf' }, action);
    expect(newState.previousITF).to.equal('old itf');
    expect(newState.currentITF).to.equal('new itf');
  });

  it('should handle ITF_CREATION_FAILED', () => {
    const newState = itf(initialState, { type: ITF_CREATION_FAILED });
    expect(newState.creationCallState).to.equal(requestStates.failed);
  });
});
