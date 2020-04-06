import _ from 'lodash/fp';

import {
  SET_SAVE_FORM_STATUS,
  SET_AUTO_SAVE_FORM_STATUS,
  SET_FETCH_FORM_STATUS,
  SET_IN_PROGRESS_FORM,
  SET_FETCH_FORM_PENDING,
  SET_PREFILL_UNFILLED,
  SET_START_OVER,
  SAVE_STATUSES,
  LOAD_STATUSES,
  PREFILL_STATUSES,
} from '../../save-in-progress/actions';

import { createSaveInProgressFormReducer } from '../../save-in-progress/reducers';

describe('schemaform createSaveInProgressInitialState', () => {
  test('creates a reducer with initial state for each page', () => {
    const formConfig = {
      chapters: {
        test: {
          pages: {
            page1: {
              initialData: { field: 'test' },
              schema: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                },
              },
            },
            page2: {
              initialData: {},
              schema: {
                type: 'object',
                properties: {},
              },
            },
          },
        },
      },
    };
    const reducer = createSaveInProgressFormReducer(formConfig, { data: {} });
    const state = reducer(undefined, {});

    expect(state.isStartingOver).toBe(false);
    expect(state.prefillStatus).toBe(PREFILL_STATUSES.notAttempted);
    expect(state.initialData).toBe(state.data);
  });

  test(
    'creates a reducer with initial additionalRoutes if they are present in the form config',
    () => {
      const formConfig = {
        additionalRoutes: [
          {
            path: 'route-path',
          },
        ],
        chapters: {},
      };
      const reducer = createSaveInProgressFormReducer(formConfig, { data: {} });
      const state = reducer(undefined, {});

      expect(state.additionalRoutes).toEqual([{ path: 'route-path' }]);
    }
  );

  describe('reducer', () => {
    const formConfig = {
      chapters: {
        test: {
          pages: {
            page1: {
              initialData: { field: 'test' },
              schema: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                },
              },
            },
          },
        },
      },
    };
    const reducer = createSaveInProgressFormReducer(formConfig, { data: {} });

    const data = {
      formData: {
        field: 'foo',
      },
      metadata: {
        version: 0,
        returnUrl: 'foo/bar',
      },
    };

    test('should set save form status', () => {
      const state = reducer(
        {
          savedStatus: SAVE_STATUSES.notAttempted,
        },
        {
          type: SET_SAVE_FORM_STATUS,
          status: SAVE_STATUSES.success,
        },
      );

      expect(state.savedStatus).toBe(SAVE_STATUSES.success);
      expect(state.startingOver).toBe(false);
      expect(state.prefillStatus).toBe(PREFILL_STATUSES.notAttempted);
    });

    test('should set auto save form status', () => {
      const state = reducer(
        {
          autoSavedStatus: SAVE_STATUSES.notAttempted,
        },
        {
          type: SET_AUTO_SAVE_FORM_STATUS,
          status: SAVE_STATUSES.success,
        },
      );

      expect(state.autoSavedStatus).toBe(SAVE_STATUSES.success);
    });
    test('should reset auto saved form status on error', () => {
      const state = reducer(
        {
          autoSavedStatus: SAVE_STATUSES.failure,
          savedStatus: SAVE_STATUSES.notAttempted,
        },
        {
          type: SET_SAVE_FORM_STATUS,
          status: SAVE_STATUSES.noAuth,
        },
      );

      expect(state.savedStatus).toBe(SAVE_STATUSES.noAuth);
      expect(state.autoSavedStatus).toBe(SAVE_STATUSES.notAttempted);
    });
    test('should set fetch form status', () => {
      const state = reducer(
        {
          loadedStatus: LOAD_STATUSES.notAttempted,
        },
        {
          type: SET_FETCH_FORM_STATUS,
          status: LOAD_STATUSES.pending,
        },
      );

      expect(state.loadedStatus).toBe(LOAD_STATUSES.pending);
    });
    test('should set in progress form data', () => {
      const state = reducer(
        {
          loadedStatus: LOAD_STATUSES.notAttempted,
          data: {},
          pages: {},
        },
        {
          type: SET_IN_PROGRESS_FORM,
          data,
          pages: {},
        },
      );

      expect(state.loadedStatus).toBe(LOAD_STATUSES.success);
      expect(state.loadedData).toBe(data);
      expect(state.data).toBe(data.formData);
    });
    test('should merge prefill data with current form', () => {
      const state = reducer(
        {
          data: { existingProp: true },
          prefillStatus: PREFILL_STATUSES.pending,
          pages: {},
        },
        {
          type: SET_IN_PROGRESS_FORM,
          data,
          pages: {},
        },
      );

      expect(state.data.existingProp).toBe(true);
      expect(state.data.field).toBe('foo');
      expect(state.prefillStatus).toBe(PREFILL_STATUSES.success);
    });
    test('should not mark prefill successful when data is empty', () => {
      const state = reducer(
        {
          data: {},
          prefillStatus: PREFILL_STATUSES.pending,
          pages: {},
        },
        {
          type: SET_IN_PROGRESS_FORM,
          data: _.set('formData', {}, data),
          pages: {},
        },
      );

      expect(state.prefillStatus).toBe(PREFILL_STATUSES.unfilled);
    });
    test('should handle undefined formData', () => {
      const state = reducer(
        {
          data: {},
          prefillStatus: PREFILL_STATUSES.pending,
          pages: {},
        },
        {
          type: SET_IN_PROGRESS_FORM,
          data: { formData: undefined },
          pages: {},
        },
      );

      expect(state.prefillStatus).toBe(PREFILL_STATUSES.unfilled);
    });
    test('should set fetch form pending', () => {
      const state = reducer(
        {},
        {
          type: SET_FETCH_FORM_PENDING,
        },
      );

      expect(state.loadedStatus).toBe(LOAD_STATUSES.pending);
      expect(state.prefillStatus).toBeUndefined();
    });
    test('should set fetch form pending and prefill', () => {
      const state = reducer(
        {},
        {
          type: SET_FETCH_FORM_PENDING,
          prefill: true,
        },
      );

      expect(state.loadedStatus).toBe(LOAD_STATUSES.pending);
      expect(state.prefillStatus).toBe(PREFILL_STATUSES.pending);
    });
    test('should start over form', () => {
      const initialData = { field: true };
      const state = reducer(
        {
          initialData,
          data: { field1: false },
        },
        {
          type: SET_START_OVER,
        },
      );

      expect(state.isStartingOver).toBe(true);
      expect(state.data).toBe(initialData);
      expect(state.loadedStatus).toBe(LOAD_STATUSES.pending);
    });
    test('should set prefill as unfilled', () => {
      const initialData = { field: true };
      const state = reducer(
        {
          initialData,
        },
        {
          type: SET_PREFILL_UNFILLED,
        },
      );

      expect(state.data).toBe(initialData);
      expect(state.loadedStatus).toBe(LOAD_STATUSES.notAttempted);
      expect(state.prefillStatus).toBe(PREFILL_STATUSES.unfilled);
    });
  });
});
