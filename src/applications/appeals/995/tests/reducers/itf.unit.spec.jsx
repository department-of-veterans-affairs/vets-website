import { expect } from 'chai';

import { requestStates } from '~/platform/utilities/constants';
import { ITF_STATUSES } from '../../constants';

import {
  ITF_FETCH_INITIATED,
  ITF_FETCH_SUCCEEDED,
  ITF_FETCH_FAILED,
  ITF_CREATION_INITIATED,
  ITF_CREATION_SUCCEEDED,
  ITF_CREATION_FAILED,
} from '../../actions';

import reducers from '../../reducers';

import { parseDateWithOffset } from '../../../shared/utils/dates';

const initialState = {
  fetchCallState: requestStates.notCalled,
  creationCallState: requestStates.notCalled,
  currentITF: null,
  previousITF: null,
};

describe('ITF reducer', () => {
  const { itf } = reducers;

  it('should return default state', () => {
    const newState = itf();
    expect(newState).to.deep.equal(initialState);
  });

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
                status: ITF_STATUSES.active,
              },
              {
                type: 'compensation',
                status: ITF_STATUSES.active,
                expirationDate: parseDateWithOffset({ days: 1 }),
              },
              {
                // duplicate ITF with later expiration date; should use the active one
                type: 'compensation',
                status: ITF_STATUSES.duplicate,
                expirationDate: parseDateWithOffset({ year: 1 }),
              },
            ],
          },
        },
      };
      const newState = itf(initialState, action);
      expect(newState.currentITF.status).to.equal(ITF_STATUSES.active);
    });

    it('should set the currentITF to the one with the latest expiration date if no active one is present', () => {
      const action = {
        type: ITF_FETCH_SUCCEEDED,
        data: {
          attributes: {
            intentToFile: [
              {
                type: 'something not compensation',
                status: ITF_STATUSES.active,
              },
              {
                type: 'compensation',
                status: ITF_STATUSES.expired,
                expirationDate: parseDateWithOffset({ days: -1 }),
              },
              {
                type: 'compensation',
                status: ITF_STATUSES.duplicate,
                expirationDate: parseDateWithOffset({ days: 1 }),
              },
            ],
          },
        },
      };
      const newState = itf(initialState, action);
      expect(newState.currentITF.status).to.equal(ITF_STATUSES.duplicate);
    });

    it('should set the currentITF to null', () => {
      const action = {
        type: ITF_FETCH_SUCCEEDED,
        data: { attributes: {} },
      };
      const newState = itf(initialState, action);
      expect(newState.currentITF).to.be.null;
    });
  });

  it('should not set a currentITF if the active & latest expiration date have passed', () => {
    const action = {
      type: ITF_FETCH_SUCCEEDED,
      data: {
        attributes: {
          intentToFile: [
            {
              type: 'something not compensation',
              status: ITF_STATUSES.active,
            },
            {
              type: 'compensation',
              status: ITF_STATUSES.expired,
              expirationDate: parseDateWithOffset({ days: -3 }),
            },
            {
              type: 'compensation',
              status: ITF_STATUSES.duplicate,
              expirationDate: parseDateWithOffset({ days: -2 }),
            },
            {
              type: 'compensation',
              status: ITF_STATUSES.active,
              expirationDate: parseDateWithOffset({ days: -1 }),
            },
          ],
        },
      },
    };
    const newState = itf(initialState, action);
    expect(newState.currentITF).to.be.null;
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

  it('should handle ITF_CREATION_SUCCEEDED fallback of previousITF', () => {
    const action = {
      type: ITF_CREATION_SUCCEEDED,
      data: {
        attributes: {
          intentToFile: 'new itf',
        },
      },
    };
    const newState = itf({ previousITF: 'prev itf' }, action);
    expect(newState.previousITF).to.equal('prev itf');
    expect(newState.currentITF).to.equal('new itf');
  });

  it('should handle ITF_CREATION_FAILED', () => {
    const newState = itf(initialState, { type: ITF_CREATION_FAILED });
    expect(newState.creationCallState).to.equal(requestStates.failed);
  });
});
