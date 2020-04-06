import { FeatureToggleReducer } from '../../reducers';
import {
  TOGGLE_VALUES_SET,
  FETCH_TOGGLE_VALUES_STARTED,
  FETCH_TOGGLE_VALUES_SUCCEEDED,
} from '../../actionTypes';

describe('Feature Toggle reducer', () => {
  test('sets a loading state', () => {
    const state = FeatureToggleReducer(undefined, {
      type: FETCH_TOGGLE_VALUES_STARTED,
    });

    expect(state.loading).toBe(true);
  });

  test('adds the payload to the state', () => {
    const payload = {
      test: 'test',
    };
    const state = FeatureToggleReducer(undefined, {
      type: FETCH_TOGGLE_VALUES_SUCCEEDED,
      payload,
    });

    expect(state.loading).toBe(false);
    expect(state.test).toBe('test');
  });

  test('adds the newToggleValues to the state', () => {
    const newToggleValues = {
      test: 'test',
    };
    const state = FeatureToggleReducer(undefined, {
      type: TOGGLE_VALUES_SET,
      newToggleValues,
    });

    expect(state.test).toBe('test');
  });
});
