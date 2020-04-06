// Dependencies.
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  UPDATE_PAGE,
  ADD_SCHOOL_TO_COMPARE,
} from './index';

describe('Yellow Ribbon constants', () => {
  it('should have `yellow-ribbon` in them', () => {
    expect(FETCH_RESULTS).toEqual(expect.arrayContaining(['yellow-ribbon']));
    expect(FETCH_RESULTS_FAILURE).toEqual(
      expect.arrayContaining(['yellow-ribbon']),
    );
    expect(FETCH_RESULTS_SUCCESS).toEqual(
      expect.arrayContaining(['yellow-ribbon']),
    );
    expect(ADD_SCHOOL_TO_COMPARE).toEqual(
      expect.arrayContaining(['yellow-ribbon']),
    );
    expect(UPDATE_PAGE).toEqual(expect.arrayContaining(['yellow-ribbon']));
  });
});
