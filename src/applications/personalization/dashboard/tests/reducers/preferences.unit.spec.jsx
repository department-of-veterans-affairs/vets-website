import { expect } from 'chai';
import preferencesReducer from '../../reducers/preferences';
import { SET_MY_VA_LAYOUT_PREFERENCE } from '../../actions/preferences';

describe('preferences reducer', () => {
  const initialState = {};

  describe('SET_MY_VA_LAYOUT_PREFERENCE', () => {
    it('should set layout.version when action type matches', () => {
      const state = preferencesReducer(initialState, {
        type: SET_MY_VA_LAYOUT_PREFERENCE,
        layout: {
          version: 'new',
        },
      });

      expect(state.layout.version).to.equal('new');
    });

    it('should set layout.version to string value', () => {
      const state = preferencesReducer(initialState, {
        type: SET_MY_VA_LAYOUT_PREFERENCE,
        layout: {
          version: 'old',
        },
      });

      expect(state.layout.version).to.equal('old');
    });

    it('should set layout.version to number value', () => {
      const state = preferencesReducer(initialState, {
        type: SET_MY_VA_LAYOUT_PREFERENCE,
        layout: {
          version: 2,
        },
      });

      expect(state.layout.version).to.equal(2);
    });

    it('should set layout.version to boolean value', () => {
      const state = preferencesReducer(initialState, {
        type: SET_MY_VA_LAYOUT_PREFERENCE,
        layout: {
          version: true,
        },
      });

      expect(state.layout.version).to.be.true;
    });

    it('should set layout.version to null', () => {
      const state = preferencesReducer(initialState, {
        type: SET_MY_VA_LAYOUT_PREFERENCE,
        layout: {
          version: null,
        },
      });

      expect(state.layout.version).to.be.null;
    });

    it('should set layout.version to undefined', () => {
      const state = preferencesReducer(initialState, {
        type: SET_MY_VA_LAYOUT_PREFERENCE,
        layout: {
          version: undefined,
        },
      });

      expect(state.layout.version).to.be.undefined;
    });

    it('should set layout.version to empty string', () => {
      const state = preferencesReducer(initialState, {
        type: SET_MY_VA_LAYOUT_PREFERENCE,
        layout: {
          version: '',
        },
      });

      expect(state.layout.version).to.equal('');
    });

    it('should overwrite existing layout.version', () => {
      const existingState = {
        layout: {
          version: 'old',
        },
      };

      const state = preferencesReducer(existingState, {
        type: SET_MY_VA_LAYOUT_PREFERENCE,
        layout: {
          version: 'new',
        },
      });

      expect(state.layout.version).to.equal('new');
      expect(state.layout.version).to.not.equal('old');
    });

    it('should preserve other state properties', () => {
      const existingState = {
        otherProperty: 'value',
        anotherProperty: { nested: 'data' },
      };

      const state = preferencesReducer(existingState, {
        type: SET_MY_VA_LAYOUT_PREFERENCE,
        layout: {
          version: 'new',
        },
      });

      expect(state.otherProperty).to.equal('value');
      expect(state.anotherProperty).to.eql({ nested: 'data' });
      expect(state.layout.version).to.equal('new');
    });

    it('should preserve existing layout properties other than version', () => {
      const existingState = {
        layout: {
          version: 'old',
          otherSetting: 'preserved',
        },
      };

      const state = preferencesReducer(existingState, {
        type: SET_MY_VA_LAYOUT_PREFERENCE,
        layout: {
          version: 'new',
        },
      });

      expect(state.layout.version).to.equal('new');
      expect(state.layout.otherSetting).to.equal('preserved');
    });
  });

  describe('action type not matching', () => {
    it('should return state unchanged for unknown action types', () => {
      const existingState = {
        layout: {
          version: 'existing',
        },
        otherProperty: 'value',
      };

      const state = preferencesReducer(existingState, {
        type: 'UNKNOWN_ACTION_TYPE',
      });

      expect(state).to.eql(existingState);
      expect(state).to.equal(existingState);
    });

    it('should return initial state when state is undefined', () => {
      const state = preferencesReducer(undefined, {
        type: 'UNKNOWN_ACTION_TYPE',
      });

      expect(state).to.eql(initialState);
    });

    it('should return state unchanged when action type is empty string', () => {
      const existingState = {
        layout: {
          version: 'existing',
        },
      };

      const state = preferencesReducer(existingState, {
        type: '',
      });

      expect(state).to.eql(existingState);
    });

    it('should return state unchanged when action type is null', () => {
      const existingState = {
        layout: {
          version: 'existing',
        },
      };

      const state = preferencesReducer(existingState, {
        type: null,
      });

      expect(state).to.eql(existingState);
    });

    it('should return state unchanged for action with similar but different type', () => {
      const existingState = {
        layout: {
          version: 'existing',
        },
      };

      const state = preferencesReducer(existingState, {
        type: 'SET_MY_VA_LAYOUT_PREFERENCE_OTHER',
      });

      expect(state).to.eql(existingState);
    });
  });
});
