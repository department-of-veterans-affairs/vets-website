import { expect } from 'chai';

import {
  SET_DATA,
  SET_EDIT_MODE,
  SET_PRE_SUBMIT,
  SET_SUBMISSION,
  SET_SUBMITTED,
  SET_FORM_ERRORS,
} from '../../../src/js/actions';

import createSchemaFormReducer from '../../../src/js/state';

describe('schemaform createSchemaFormReducer', () => {
  it('creates a reducer with initial state for each page', () => {
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

    expect(state.submission).not.to.be.undefined;
    expect(state.data.field).to.eql(
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

    it('should set data state', () => {
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

      expect(state.data.field).to.equal('test2');
    });
    it('should set edit mode', () => {
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

      expect(state.pages.page1.editMode).to.be.true;
    });
    it('should reset array edit modes', () => {
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

      expect(state.pages.page1.editMode).to.eql([false, false]);
    });
    it('should set privacy agreement', () => {
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

      expect(state.data.privacyAgreementAccepted).to.be.true;
    });
    it('should set submission field', () => {
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

      expect(state.submission.hasAttemptedSubmit).to.be.true;
      expect(state.submission.timestamp).to.exist;
    });
    it('should set submitted', () => {
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

      expect(state.submission.status).to.equal('applicationSubmitted');
      expect(state.submission.response).to.eql({ field: 'test' });
    });
    it('should set form errors', () => {
      const data = {
        rawErrors: ['raw error'],
        errors: ['error'],
      };
      const state = reducer(
        {
          formErrors: {},
        },
        {
          type: SET_FORM_ERRORS,
          data,
        },
      );
      expect(state.formErrors).to.equal(data);
    });
  });
});
