import { expect } from 'chai';
import reducer from '../../../reducers/ch31-case-milestones';
import {
  CH31_CASE_MILESTONES_FETCH_FAILED,
  CH31_CASE_MILESTONES_FETCH_STARTED,
  CH31_CASE_MILESTONES_FETCH_SUCCEEDED,
  CH31_CASE_MILESTONES_RESET_STATE,
} from '../../../constants';

const initialState = {
  loading: false,
  error: null,
  data: null,
};

describe('ch31CaseMilestones reducer', () => {
  it('returns initial state by default', () => {
    const next = reducer(undefined, { type: '@@INIT' });
    expect(next).to.deep.equal(initialState);
  });

  it('handles CH31_CASE_MILESTONES_RESET_STATE', () => {
    const prev = {
      loading: true,
      error: { status: 500, messages: ['oops'] },
      data: { foo: 'bar' },
    };
    const next = reducer(prev, { type: CH31_CASE_MILESTONES_RESET_STATE });
    expect(next).to.deep.equal(initialState);
  });

  it('handles CH31_CASE_MILESTONES_FETCH_STARTED', () => {
    const prev = { ...initialState, error: { status: 400, messages: ['x'] } };
    const next = reducer(prev, { type: CH31_CASE_MILESTONES_FETCH_STARTED });
    expect(next.loading).to.equal(true);
    expect(next.error).to.equal(null);
    expect(next.data).to.equal(prev.data);
  });

  it('handles CH31_CASE_MILESTONES_FETCH_SUCCEEDED', () => {
    const payload = { foo: 'bar' };
    const prev = {
      ...initialState,
      loading: true,
      error: { status: 500, messages: ['oops'] },
    };
    const next = reducer(prev, {
      type: CH31_CASE_MILESTONES_FETCH_SUCCEEDED,
      payload,
    });
    expect(next.loading).to.equal(false);
    expect(next.error).to.equal(null);
    expect(next.data).to.equal(payload);
  });

  it('handles CH31_CASE_MILESTONES_FETCH_FAILED', () => {
    const error = { status: 400, messages: ['Bad Request'] };
    const prev = { ...initialState, loading: true, data: { keep: 'me' } };
    const next = reducer(prev, {
      type: CH31_CASE_MILESTONES_FETCH_FAILED,
      error,
    });
    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal(error);
    expect(next.data).to.equal(prev.data);
  });

  it('falls back to default error shape when action.error is missing', () => {
    const next = reducer(initialState, {
      type: CH31_CASE_MILESTONES_FETCH_FAILED,
    });
    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal({
      status: null,
      messages: ['Unknown error'],
    });
  });

  it('is pure (does not mutate prior state)', () => {
    const prev = Object.freeze({ ...initialState });
    const next = reducer(prev, { type: CH31_CASE_MILESTONES_FETCH_STARTED });
    expect(next).to.not.equal(prev);
    expect(prev).to.deep.equal(initialState);
  });
});
