import { expect } from 'chai';
import allDependentsReducer from '../../reducers/index';

import {
  FETCH_ALL_DEPENDENTS_STARTED,
  FETCH_ALL_DEPENDENTS_SUCCESS,
  FETCH_ALL_DEPENDENTS_FAILED,
} from '../../actions';

describe('allDependents reducer', () => {
  const { allDependents } = allDependentsReducer;

  it('should return initial state', () => {
    const initialState = allDependents(undefined, {});
    expect(initialState.loading).to.be.true;
    expect(initialState.error).to.be.null;
    expect(initialState.onAwardDependents).to.deep.equal([]);
    expect(initialState.notOnAwardDependents).to.deep.equal([]);
  });

  it('should handle FETCH_ALL_DEPENDENTS_STARTED', () => {
    const previousState = {
      loading: false,
      error: { code: '500' },
      onAwardDependents: [],
      notOnAwardDependents: [],
    };

    const newState = allDependents(previousState, {
      type: FETCH_ALL_DEPENDENTS_STARTED,
    });

    expect(newState.loading).to.be.true;
    expect(newState.error).to.be.null;
    expect(newState.onAwardDependents).to.deep.equal([]);
    expect(newState.notOnAwardDependents).to.deep.equal([]);
  });

  it('should handle FETCH_ALL_DEPENDENTS_SUCCESS with dependents', () => {
    const previousState = {
      loading: true,
      error: null,
      onAwardDependents: [],
      notOnAwardDependents: [],
    };

    const mockPersons = [
      {
        awardIndicator: 'Y',
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        awardIndicator: 'N',
        firstName: 'Jane',
        lastName: 'Smith',
      },
    ];

    const newState = allDependents(previousState, {
      type: FETCH_ALL_DEPENDENTS_SUCCESS,
      response: { persons: mockPersons },
    });

    expect(newState.loading).to.be.false;
    expect(newState.onAwardDependents).to.have.lengthOf(1);
    expect(newState.notOnAwardDependents).to.have.lengthOf(1);
    expect(newState.onAwardDependents[0].firstName).to.equal('John');
    expect(newState.notOnAwardDependents[0].firstName).to.equal('Jane');
  });

  it('should handle FETCH_ALL_DEPENDENTS_SUCCESS with no dependents', () => {
    const previousState = {
      loading: true,
      error: null,
      onAwardDependents: [],
      notOnAwardDependents: [],
    };

    const newState = allDependents(previousState, {
      type: FETCH_ALL_DEPENDENTS_SUCCESS,
      response: {},
    });

    expect(newState.loading).to.be.false;
    expect(newState.onAwardDependents).to.deep.equal([]);
    expect(newState.notOnAwardDependents).to.deep.equal([]);
  });

  it('should handle FETCH_ALL_DEPENDENTS_FAILED', () => {
    const previousState = {
      loading: true,
      error: null,
      onAwardDependents: [],
      notOnAwardDependents: [],
    };

    const mockError = {
      errors: [
        {
          status: '500',
        },
      ],
    };

    const newState = allDependents(previousState, {
      type: FETCH_ALL_DEPENDENTS_FAILED,
      response: mockError,
    });

    expect(newState.loading).to.be.false;
    expect(newState.error).to.deep.equal({ code: '500' });
    expect(newState.onAwardDependents).to.deep.equal([]);
    expect(newState.notOnAwardDependents).to.deep.equal([]);
  });
});
