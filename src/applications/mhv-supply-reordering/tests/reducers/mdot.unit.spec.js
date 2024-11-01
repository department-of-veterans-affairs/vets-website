import { expect } from 'chai';
import { mdotApiResults } from '../../reducers/mdot';
import { MDOT_API_STATES } from '../../constants';

describe('mdot reducer', () => {
  it('initial state', () => {
    const action = { type: 'some action' };
    const state = mdotApiResults(undefined, action);
    expect(state).to.not.be.null;
    expect(state.isError).to.be.false;
    expect(state.pending).to.be.true;
    expect(state.data).to.be.null;
    expect(state.errorCode).to.be.empty;
    expect(state.statusCode).to.be.empty;
  });

  it('pending state', () => {
    const action = {
      type: MDOT_API_STATES.PENDING,
    };
    const state = mdotApiResults(undefined, action);
    expect(state).to.not.be.null;
    expect(state.isError).to.be.false;
    expect(state.pending).to.be.true;
    expect(state.data).to.be.null;
    expect(state.errorCode).to.be.empty;
    expect(state.statusCode).to.be.empty;
  });

  it('error state', () => {
    const action = {
      type: MDOT_API_STATES.ERROR,
      errorCode: 'MDOT_ERROR_CODE',
      statusCode: '400',
    };
    const state = mdotApiResults(undefined, action);
    expect(state).to.not.be.null;
    expect(state.isError).to.be.true;
    expect(state.pending).to.be.false;
    expect(state.data).to.be.null;
    expect(state.errorCode).to.be.eql(action.errorCode);
    expect(state.statusCode).to.be.eql(action.statusCode);
  });

  it('success state', () => {
    const action = {
      type: MDOT_API_STATES.SUCCESS,
      statusCode: '200',
      data: 'some data',
    };
    const state = mdotApiResults(undefined, action);
    expect(state).to.not.be.null;
    expect(state.isError).to.be.false;
    expect(state.pending).to.be.false;
    expect(state.data).to.be.eql(action.data);
    expect(state.errorCode).to.be.empty;
    expect(state.statusCode).to.be.eql(action.statusCode);
  });
});
