// Node modules.
import { expect } from 'chai';
// Relative imports.
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
} from './index';

describe('Constants', () => {
  it('should be scoped', () => {
    expect(FETCH_RESULTS).to.include('third-party-apps');
    expect(FETCH_RESULTS_FAILURE).to.include('third-party-apps');
    expect(FETCH_RESULTS_SUCCESS).to.include('third-party-apps');
  });
});
