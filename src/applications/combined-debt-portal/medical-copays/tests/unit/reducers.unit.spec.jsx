import { expect } from 'chai';
import { medicalCopaysReducer as reducer } from '../../../combined/reducers';
import copays from '../e2e/fixtures/mocks/copays.json';
import {
  MCP_STATEMENTS_FETCH_INIT,
  MCP_STATEMENTS_FETCH_SUCCESS,
  MCP_STATEMENTS_FETCH_FAILURE,
} from '../../../combined/actions/copays';

describe('Medical Copays Reducer', () => {
  it('MCP_STATEMENTS_FETCH_INIT', () => {
    const action = {
      type: MCP_STATEMENTS_FETCH_INIT,
    };
    const reducedState = reducer(undefined, action);
    expect(reducedState.pending).to.be.true;
  });

  it('MCP_STATEMENTS_FETCH_SUCCESS', () => {
    const action = {
      type: MCP_STATEMENTS_FETCH_SUCCESS,
      response: copays.data,
    };
    const reducedState = reducer(undefined, action);
    expect(reducedState.pending).to.be.false;
    expect(reducedState.statements).to.deep.equal(copays.data);
  });

  it('MCP_STATEMENTS_FETCH_FAILURE', () => {
    const errorResponse = {
      title: 'Not found',
      detail: 'There are no routes matching your request: v0/medical_copays',
      code: '411',
      status: '404',
    };
    const action = {
      type: MCP_STATEMENTS_FETCH_FAILURE,
      error: errorResponse,
    };
    const reducedState = reducer(undefined, action);
    expect(reducedState.pending).to.be.false;
    expect(reducedState.error).to.deep.equal(errorResponse);
  });
});
