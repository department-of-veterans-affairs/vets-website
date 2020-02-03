// Dependencies.
import { expect } from 'chai';
// Relative imports.
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  UPDATE_PAGE,
  ADD_SCHOOL_TO_COMPARE,
} from './index';

describe('Yellow Ribbon constants', () => {
  it('should have `yellow-ribbon` in them', () => {
    expect(FETCH_RESULTS).to.include('yellow-ribbon');
    expect(FETCH_RESULTS_FAILURE).to.include('yellow-ribbon');
    expect(FETCH_RESULTS_SUCCESS).to.include('yellow-ribbon');
    expect(ADD_SCHOOL_TO_COMPARE).to.include('yellow-ribbon');
    expect(UPDATE_PAGE).to.include('yellow-ribbon');
  });
});
