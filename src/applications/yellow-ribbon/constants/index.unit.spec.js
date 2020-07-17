// Dependencies.
import { expect } from 'chai';
// Relative imports.
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  TOGGLE_SHOW_MOBILE_FORM,
} from './index';

describe('Yellow Ribbon constants', () => {
  it('should have `yellow-ribbon` in them', () => {
    expect(FETCH_RESULTS).to.include('yellow-ribbon');
    expect(FETCH_RESULTS_FAILURE).to.include('yellow-ribbon');
    expect(FETCH_RESULTS_SUCCESS).to.include('yellow-ribbon');
    expect(TOGGLE_SHOW_MOBILE_FORM).to.include('yellow-ribbon');
  });
});
