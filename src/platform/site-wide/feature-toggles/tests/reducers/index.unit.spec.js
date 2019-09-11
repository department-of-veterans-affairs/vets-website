import { expect } from 'chai';

import { FeatureToggleReducer } from '../../reducers';
import {
  FETCH_TOGGLE_VALUES_STARTED,
  FETCH_TOGGLE_VALUES_SUCCEEDED,
} from '../../actionTypes';

describe('Feature Toggle reducer', () => {
  it('sets a loading state', () => {
    const state = FeatureToggleReducer(undefined, {
      type: FETCH_TOGGLE_VALUES_STARTED,
    });

    expect(state.loading).to.be.true;
  });

  it('adds the payload to the state', () => {
    const payload = {
      test: 'test',
    };
    const state = FeatureToggleReducer(undefined, {
      type: FETCH_TOGGLE_VALUES_SUCCEEDED,
      payload,
    });

    expect(state.loading).to.be.false;
    expect(state.test).to.equal('test');
  });
});
