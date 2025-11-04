import { expect } from 'chai';
import formStatusReducer from '../../reducers/form-status';
import {
  FETCH_FORM_STATUS_STARTED,
  FETCH_FORM_STATUS_SUCCEEDED,
  FETCH_FORM_STATUS_FAILED,
} from '../../actions/form-status';

describe('form-status reducer', () => {
  const initialState = {
    isLoading: true,
    forms: null,
    error: null,
    errors: null,
  };

  describe('FETCH_FORM_STATUS_STARTED', () => {
    it('should set isLoading to true', () => {
      const existingState = {
        ...initialState,
        isLoading: false,
        forms: [{ id: 1 }],
      };

      const state = formStatusReducer(existingState, {
        type: FETCH_FORM_STATUS_STARTED,
      });

      expect(state.isLoading).to.be.true;
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        forms: [{ id: 1 }],
        error: null,
        errors: null,
      };

      const state = formStatusReducer(existingState, {
        type: FETCH_FORM_STATUS_STARTED,
      });

      expect(state.forms).to.eql([{ id: 1 }]);
      expect(state.error).to.be.null;
      expect(state.errors).to.be.null;
    });

    it('should overwrite existing isLoading when setting loading', () => {
      const existingState = {
        ...initialState,
        isLoading: false,
        forms: [{ id: 1 }],
      };

      const state = formStatusReducer(existingState, {
        type: FETCH_FORM_STATUS_STARTED,
      });

      expect(state.isLoading).to.be.true;
    });
  });

  describe('FETCH_FORM_STATUS_SUCCEEDED', () => {
    describe('with action.forms present', () => {
      it('should set isLoading to false and set forms when action.forms is provided', () => {
        const existingState = {
          ...initialState,
          isLoading: true,
          forms: null,
        };

        const actionForms = [
          { id: 1, form: '21-526EZ', status: 'submitted' },
          { id: 2, form: '10-10EZ', status: 'in_progress' },
        ];

        const state = formStatusReducer(existingState, {
          type: FETCH_FORM_STATUS_SUCCEEDED,
          forms: actionForms,
          errors: [],
        });

        expect(state.isLoading).to.be.false;
        expect(state.forms).to.eql(actionForms);
      });

      it('should use action.forms when provided even if it is an empty array', () => {
        const existingState = {
          ...initialState,
          forms: [{ id: 1 }],
        };

        const state = formStatusReducer(existingState, {
          type: FETCH_FORM_STATUS_SUCCEEDED,
          forms: [],
          errors: [],
        });

        expect(state.forms).to.eql([]);
      });
    });

    describe('with action.forms null/undefined (fallback to [])', () => {
      it('should set forms to empty array when action.forms is null', () => {
        const existingState = {
          ...initialState,
          forms: [{ id: 1 }],
        };

        const state = formStatusReducer(existingState, {
          type: FETCH_FORM_STATUS_SUCCEEDED,
          forms: null,
          errors: [],
        });

        expect(state.isLoading).to.be.false;
        expect(state.forms).to.eql([]);
      });

      it('should set forms to empty array when action.forms is undefined', () => {
        const existingState = {
          ...initialState,
          forms: [{ id: 1 }],
        };

        const state = formStatusReducer(existingState, {
          type: FETCH_FORM_STATUS_SUCCEEDED,
          errors: [],
        });

        expect(state.isLoading).to.be.false;
        expect(state.forms).to.eql([]);
      });

      it('should set forms to empty array when action.forms is missing', () => {
        const existingState = {
          ...initialState,
          forms: [{ id: 1 }],
        };

        const state = formStatusReducer(existingState, {
          type: FETCH_FORM_STATUS_SUCCEEDED,
          errors: [],
        });

        expect(state.forms).to.eql([]);
      });
    });

    describe('with action.errors present', () => {
      it('should set errors when action.errors is provided', () => {
        const existingState = {
          ...initialState,
          errors: null,
        };

        const actionErrors = [
          { code: '500', status: 'Internal Server Error' },
          { code: '422', status: 'Validation Error' },
        ];

        const state = formStatusReducer(existingState, {
          type: FETCH_FORM_STATUS_SUCCEEDED,
          forms: [],
          errors: actionErrors,
        });

        expect(state.isLoading).to.be.false;
        expect(state.errors).to.eql(actionErrors);
      });

      it('should use action.errors when provided even if it is an empty array', () => {
        const existingState = {
          ...initialState,
          errors: [{ code: '500' }],
        };

        const state = formStatusReducer(existingState, {
          type: FETCH_FORM_STATUS_SUCCEEDED,
          forms: [],
          errors: [],
        });

        expect(state.errors).to.eql([]);
      });
    });

    describe('with action.errors null/undefined (fallback to [])', () => {
      it('should set errors to empty array when action.errors is null', () => {
        const existingState = {
          ...initialState,
          errors: [{ code: '500' }],
        };

        const state = formStatusReducer(existingState, {
          type: FETCH_FORM_STATUS_SUCCEEDED,
          forms: [],
          errors: null,
        });

        expect(state.isLoading).to.be.false;
        expect(state.errors).to.eql([]);
      });

      it('should set errors to empty array when action.errors is undefined', () => {
        const existingState = {
          ...initialState,
          errors: [{ code: '500' }],
        };

        const state = formStatusReducer(existingState, {
          type: FETCH_FORM_STATUS_SUCCEEDED,
          forms: [],
        });

        expect(state.isLoading).to.be.false;
        expect(state.errors).to.eql([]);
      });

      it('should set errors to empty array when action.errors is missing', () => {
        const existingState = {
          ...initialState,
          errors: [{ code: '500' }],
        };

        const state = formStatusReducer(existingState, {
          type: FETCH_FORM_STATUS_SUCCEEDED,
          forms: [],
        });

        expect(state.errors).to.eql([]);
      });
    });

    it('should handle both forms and errors together', () => {
      const existingState = {
        ...initialState,
        isLoading: true,
        forms: null,
        errors: null,
      };

      const actionForms = [{ id: 1, form: '21-526EZ' }];
      const actionErrors = [{ code: '422', status: 'Validation Error' }];

      const state = formStatusReducer(existingState, {
        type: FETCH_FORM_STATUS_SUCCEEDED,
        forms: actionForms,
        errors: actionErrors,
      });

      expect(state.isLoading).to.be.false;
      expect(state.forms).to.eql(actionForms);
      expect(state.errors).to.eql(actionErrors);
    });

    it('should handle both forms and errors as null/undefined (both fallback to [])', () => {
      const existingState = {
        ...initialState,
        forms: [{ id: 1 }],
        errors: [{ code: '500' }],
      };

      const state = formStatusReducer(existingState, {
        type: FETCH_FORM_STATUS_SUCCEEDED,
        forms: null,
        errors: null,
      });

      expect(state.isLoading).to.be.false;
      expect(state.forms).to.eql([]);
      expect(state.errors).to.eql([]);
    });
  });

  describe('FETCH_FORM_STATUS_FAILED', () => {
    it('should set isLoading to false and set error when action.error is provided', () => {
      const existingState = {
        ...initialState,
        isLoading: true,
        error: null,
      };

      const actionError = { message: 'Network error', code: '500' };

      const state = formStatusReducer(existingState, {
        type: FETCH_FORM_STATUS_FAILED,
        error: actionError,
      });

      expect(state.isLoading).to.be.false;
      expect(state.error).to.eql(actionError);
    });

    it('should overwrite existing error', () => {
      const existingState = {
        ...initialState,
        error: { message: 'Previous error' },
      };

      const newError = { message: 'New error', code: '404' };

      const state = formStatusReducer(existingState, {
        type: FETCH_FORM_STATUS_FAILED,
        error: newError,
      });

      expect(state.error).to.eql(newError);
      expect(state.error).to.not.eql({ message: 'Previous error' });
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        forms: [{ id: 1 }],
        errors: [{ code: '422' }],
      };

      const state = formStatusReducer(existingState, {
        type: FETCH_FORM_STATUS_FAILED,
        error: { message: 'Error occurred' },
      });

      expect(state.forms).to.eql([{ id: 1 }]);
      expect(state.errors).to.eql([{ code: '422' }]);
    });

    it('should set error to null when action.error is null', () => {
      const existingState = {
        ...initialState,
        error: { message: 'Previous error' },
      };

      const state = formStatusReducer(existingState, {
        type: FETCH_FORM_STATUS_FAILED,
        error: null,
      });

      expect(state.isLoading).to.be.false;
      expect(state.error).to.be.null;
    });

    it('should set error to undefined when action.error is undefined', () => {
      const existingState = {
        ...initialState,
        error: { message: 'Previous error' },
      };

      const state = formStatusReducer(existingState, {
        type: FETCH_FORM_STATUS_FAILED,
        error: undefined,
      });

      expect(state.isLoading).to.be.false;
      expect(state.error).to.be.undefined;
    });
  });

  describe('default case', () => {
    it('should return state unchanged for unknown action types', () => {
      const existingState = {
        ...initialState,
        forms: [{ id: 1 }],
        error: null,
        errors: null,
      };

      const state = formStatusReducer(existingState, {
        type: 'UNKNOWN_ACTION_TYPE',
      });

      expect(state).to.eql(existingState);
      expect(state).to.equal(existingState);
    });

    it('should return initial state when state is undefined', () => {
      const state = formStatusReducer(undefined, {
        type: 'UNKNOWN_ACTION_TYPE',
      });

      expect(state).to.eql(initialState);
    });

    it('should return state unchanged when action type is empty string', () => {
      const existingState = {
        ...initialState,
        forms: [{ id: 1 }],
      };

      const state = formStatusReducer(existingState, {
        type: '',
      });

      expect(state).to.eql(existingState);
    });

    it('should return state unchanged when action type is null', () => {
      const existingState = {
        ...initialState,
        forms: [{ id: 1 }],
      };

      const state = formStatusReducer(existingState, {
        type: null,
      });

      expect(state).to.eql(existingState);
    });

    it('should return state unchanged for action with similar but different type', () => {
      const existingState = {
        ...initialState,
        forms: [{ id: 1 }],
      };

      const state = formStatusReducer(existingState, {
        type: 'FETCH_FORM_STATUS_OTHER',
      });

      expect(state).to.eql(existingState);
    });
  });
});
