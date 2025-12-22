import { expect } from 'chai';
import { add, sub } from 'date-fns';

import { requestStates } from 'platform/utilities/constants';
import { daysFromToday } from '../utils/dates/formatting';
import { parseDate } from '../utils/dates';
import { itfStatuses } from '../constants';

import {
  ITF_FETCH_INITIATED,
  ITF_FETCH_SUCCEEDED,
  ITF_FETCH_FAILED,
  ITF_CREATION_INITIATED,
  ITF_CREATION_SUCCEEDED,
  ITF_CREATION_FAILED,
  MVI_ADD_NOT_ATTEMPTED,
  MVI_ADD_INITIATED,
  MVI_ADD_SUCCEEDED,
  MVI_ADD_FAILED,
} from '../actions';

import reducers from '../reducers';

// Helper to get current date as Date object
const getToday = () => parseDate(daysFromToday(0));

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
                expirationDate: add(getToday(), { days: 1 }).toISOString(),
              },
              {
                // duplicate ITF with later expiration date; should use the active one
                type: 'compensation',
                status: itfStatuses.duplicate,
                expirationDate: add(getToday(), { years: 1 }).toISOString(),
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
                status: itfStatuses.duplicate,
                expirationDate: add(getToday(), { years: 1 }).toISOString(),
              },
              {
                type: 'compensation',
                status: itfStatuses.duplicate,
                expirationDate: add(getToday(), { days: 1 }).toISOString(),
              },
            ],
          },
        },
      };
      const newState = itf(initialState, action);
      expect(newState.currentITF.status).to.equal(itfStatuses.duplicate);
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
              status: itfStatuses.active,
            },
            {
              type: 'compensation',
              status: itfStatuses.expired,
              expirationDate: sub(getToday(), { days: 3 }).toISOString(),
            },
            {
              type: 'compensation',
              status: itfStatuses.duplicate,
              expirationDate: sub(getToday(), { days: 1 }).toISOString(),
            },
            {
              type: 'compensation',
              status: itfStatuses.duplicate,
              expirationDate: sub(getToday(), { years: 1 }).toISOString(),
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

  it('should handle ITF_CREATION_FAILED', () => {
    const newState = itf(initialState, { type: ITF_CREATION_FAILED });
    expect(newState.creationCallState).to.equal(requestStates.failed);
  });
});

describe('MVI reducer', () => {
  const { mvi } = reducers;
  const mviInitialState = {
    addPersonState: MVI_ADD_NOT_ATTEMPTED,
  };

  it('should handle ITF_CREATION_INITIATED', () => {
    const newState = mvi(mviInitialState, { type: MVI_ADD_INITIATED });
    expect(newState.addPersonState).to.equal(MVI_ADD_INITIATED);
  });

  it('should handle ITF_CREATION_SUCCEEDED', () => {
    const newState = mvi(mviInitialState, { type: MVI_ADD_SUCCEEDED });
    expect(newState.addPersonState).to.equal(MVI_ADD_SUCCEEDED);
  });

  it('should handle ITF_CREATION_FAILED', () => {
    const newState = mvi(mviInitialState, { type: MVI_ADD_FAILED });
    expect(newState.addPersonState).to.equal(MVI_ADD_FAILED);
  });
});
