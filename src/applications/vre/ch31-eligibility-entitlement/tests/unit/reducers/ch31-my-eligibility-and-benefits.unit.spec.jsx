import { expect } from 'chai';
import reducer from '../../../reducers/ch31-my-eligibility-and-benefits';
import {
  CH31_FETCH_STARTED,
  CH31_FETCH_SUCCEEDED,
  CH31_FETCH_FAILED,
  CH31_ERROR_400_BAD_REQUEST,
  CH31_ERROR_403_FORBIDDEN,
  CH31_ERROR_500_SERVER,
  CH31_ERROR_503_UNAVAILABLE,
} from '../../../constants';

const initialState = {
  loading: false,
  error: null,
  data: null,
};

describe('ch31Eligibility reducer', () => {
  it('returns initial state by default', () => {
    const next = reducer(undefined, { type: '@@INIT' });
    expect(next).to.deep.equal(initialState);
  });

  it('handles CH31_FETCH_STARTED (sets loading true, clears error)', () => {
    const prev = { ...initialState, error: { status: 400, messages: ['x'] } };
    const next = reducer(prev, { type: CH31_FETCH_STARTED });
    expect(next.loading).to.equal(true);
    expect(next.error).to.equal(null);
    expect(next.data).to.equal(prev.data); // unchanged
  });

  it('handles CH31_FETCH_SUCCEEDED (stores payload, clears error, loading false)', () => {
    const payload = { data: { id: 'abc', attributes: { foo: 'bar' } } };
    const prev = {
      ...initialState,
      loading: true,
      error: { status: 500, messages: ['oops'] },
    };
    const next = reducer(prev, { type: CH31_FETCH_SUCCEEDED, payload });
    expect(next.loading).to.equal(false);
    expect(next.error).to.equal(null);
    expect(next.data).to.equal(payload);
  });

  it('handles CH31_ERROR_400_BAD_REQUEST', () => {
    const error = { status: 400, messages: ['Bad Request'] };
    const prev = { ...initialState, loading: true, data: { keep: 'me' } };
    const next = reducer(prev, { type: CH31_ERROR_400_BAD_REQUEST, error });
    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal(error);
    expect(next.data).to.equal(prev.data); // reducer does not clear data
  });

  it('handles CH31_ERROR_403_FORBIDDEN', () => {
    const error = { status: 403, messages: ['Not Authorized'] };
    const next = reducer(initialState, {
      type: CH31_ERROR_403_FORBIDDEN,
      error,
    });
    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal(error);
  });

  it('handles CH31_ERROR_503_UNAVAILABLE', () => {
    const error = { status: 503, messages: ['Service Unavailable'] };
    const next = reducer(initialState, {
      type: CH31_ERROR_503_UNAVAILABLE,
      error,
    });
    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal(error);
  });

  it('handles CH31_ERROR_500_SERVER', () => {
    const error = { status: 500, messages: ['Server Error'] };
    const next = reducer(initialState, { type: CH31_ERROR_500_SERVER, error });
    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal(error);
  });

  it('handles CH31_FETCH_FAILED (generic failure)', () => {
    const error = { status: 418, messages: ['I’m a teapot'] };
    const next = reducer(initialState, { type: CH31_FETCH_FAILED, error });
    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal(error);
  });

  it('falls back to default error shape when action.error is missing', () => {
    const next = reducer(initialState, { type: CH31_FETCH_FAILED });
    expect(next.loading).to.equal(false);
    expect(next.error).to.deep.equal({
      status: null,
      messages: ['Unknown error'],
    });
  });

  it('is pure (does not mutate prior state)', () => {
    const prev = Object.freeze({ ...initialState });
    const next = reducer(prev, { type: CH31_FETCH_STARTED });
    expect(next).to.not.equal(prev);
    expect(prev).to.deep.equal(initialState);
  });
});
