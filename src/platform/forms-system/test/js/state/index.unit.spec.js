import {
  CLOSE_REVIEW_CHAPTER,
  OPEN_REVIEW_CHAPTER,
  SET_DATA,
  SET_EDIT_MODE,
  SET_PRE_SUBMIT,
  SET_SUBMISSION,
  SET_SUBMITTED,
} from '../../../src/js/actions';

import createSchemaFormReducer from '../../../src/js/state';

describe('schemaform createSchemaFormReducer', () => {
  test('creates a reducer with initial state for each page', () => {
    const formConfig = {
      disableSave: true,
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
    const reducer = createSchemaFormReducer(formConfig);
    const state = reducer(undefined, {});

    expect(state.submission).not.toBeUndefined();
    expect(state.data.field).toEqual(
      formConfig.chapters.test.pages.page1.initialData.field,
    );
  });
  describe('reducer', () => {
    const formConfig = {
      disableSave: true,
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
    const reducer = createSchemaFormReducer(formConfig);

    test('adds the chapter name to openChapters on OPEN_REVIEW_CHAPTER', () => {
      const previousState = {
        reviewPageView: {
          openChapters: [],
        },
      };

      const expectedState = {
        reviewPageView: {
          openChapters: ['chapter2'],
        },
      };

      const action = {
        type: OPEN_REVIEW_CHAPTER,
        openedChapter: 'chapter2',
      };

      const testState = reducer(previousState, action);

      expect(testState).toEqual(expectedState);
    });

    test('removes the chapter name from openChapters on CLOSE_REVIEW_CHAPTER', () => {
      const viewedPages = new Set();
      const previousState = {
        reviewPageView: {
          openChapters: ['chapter1', 'chapter2', 'chapter3'],
          viewedPages,
        },
      };

      const action = {
        type: CLOSE_REVIEW_CHAPTER,
        closedChapter: 'chapter2',
        pageKeys: ['test'],
      };

      const testState = reducer(previousState, action);

      const expectedState = {
        reviewPageView: {
          openChapters: ['chapter1', 'chapter3'],
          viewedPages: viewedPages.add('test'),
        },
      };

      expect(testState).toEqual(expectedState);
    });

    test('should set data state', () => {
      const state = reducer(
        {
          pages: {
            page1: {
              schema: {
                type: 'object',
                properties: {},
              },
              uiSchema: {},
            },
          },
          data: null,
        },
        {
          type: SET_DATA,
          page: 'page1',
          data: { field: 'test2' },
        },
      );

      expect(state.data.field).toBe('test2');
    });
    test('should set edit mode', () => {
      const state = reducer(
        {
          pages: {
            page1: {
              editMode: false,
            },
          },
        },
        {
          type: SET_EDIT_MODE,
          page: 'page1',
          edit: true,
        },
      );

      expect(state.pages.page1.editMode).toBe(true);
    });
    test('should reset array edit modes', () => {
      const state = reducer(
        {
          pages: {
            page1: {
              showPagePerItem: true,
              arrayPath: 'testing',
              editMode: [true],
              schema: {
                type: 'object',
                properties: {},
              },
              uiSchema: {},
            },
          },
          data: { testing: [{}] },
        },
        {
          type: SET_DATA,
          data: { testing: [{}, {}] },
        },
      );

      expect(state.pages.page1.editMode).toEqual([false, false]);
    });
    test('should set privacy agreement', () => {
      const state = reducer(
        {
          data: {
            privacyAgreementAccepted: false,
          },
        },
        {
          type: SET_PRE_SUBMIT,
          preSubmitField: 'privacyAgreementAccepted',
          preSubmitAccepted: true,
        },
      );

      expect(state.data.privacyAgreementAccepted).toBe(true);
    });
    test('should set submission field', () => {
      const state = reducer(
        {
          submission: {
            hasAttemptedSubmit: false,
          },
        },
        {
          type: SET_SUBMISSION,
          field: 'hasAttemptedSubmit',
          value: true,
        },
      );

      expect(state.submission.hasAttemptedSubmit).toBe(true);
    });
    test('should set submitted', () => {
      const state = reducer(
        {
          submission: {
            response: null,
            status: false,
          },
        },
        {
          type: SET_SUBMITTED,
          response: { field: 'test' },
        },
      );

      expect(state.submission.status).toBe('applicationSubmitted');
      expect(state.submission.response).toEqual({ field: 'test' });
    });
  });
});
