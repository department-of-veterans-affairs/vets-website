import _ from 'lodash/fp';
import { expect } from 'chai';

import { SET_DATA,
  SET_EDIT_MODE,
  SET_PRIVACY_AGREEMENT,
  SET_SUBMISSION,
  SET_SUBMITTED
} from '../../../../src/js/common/schemaform/actions';

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
  PREFILL_STATUSES
} from '../../../../src/js/common/schemaform/save-in-progress/actions';

import createSchemaFormReducer from '../../../../src/js/common/schemaform/reducers';

describe('schemaform createSchemaFormReducer', () => {
  it('creates a reducer with initial state for each page', () => {
    const formConfig = {
      chapters: {
        test: {
          pages: {
            page1: {
              initialData: { field: 'test' },
              schema: {
                type: 'object',
                properties: {
                  field: { type: 'string' }
                }
              }
            },
            page2: {
              initialData: {},
              schema: {
                type: 'object',
                properties: {}
              }
            }
          }
        }
      }
    };
    const reducer = createSchemaFormReducer(formConfig);
    const state = reducer(undefined, {});

    expect(state.submission).not.to.be.undefined;
    expect(state.data.privacyAgreementAccepted).to.be.false;
    expect(state.data.field).to.eql(formConfig.chapters.test.pages.page1.initialData.field);
    expect(state.isStartingOver).to.be.false;
    expect(state.prefillStatus).to.equal(PREFILL_STATUSES.notAttempted);
    expect(state.initialData).to.equal(state.data);
  });
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
                  field: { type: 'string' }
                }
              }
            },
          }
        }
      }
    };
    const reducer = createSchemaFormReducer(formConfig);

    const data = {
      formData: {
        field: 'foo',
      },
      metadata: {
        version: 0,
        returnUrl: 'foo/bar'
      }
    };

    it('should set data state', () => {
      const state = reducer({
        pages: {
          page1: {
            schema: {
              type: 'object',
              properties: {}
            },
            uiSchema: {},
          }
        },
        data: null
      }, {
        type: SET_DATA,
        page: 'page1',
        data: { field: 'test2' }
      });

      expect(state.data.field).to.equal('test2');
    });
    it('should set edit mode', () => {
      const state = reducer({
        pages: {
          page1: {
            editMode: false
          }
        }
      }, {
        type: SET_EDIT_MODE,
        page: 'page1',
        edit: true
      });

      expect(state.pages.page1.editMode).to.be.true;
    });
    it('should reset array edit modes', () => {
      const state = reducer({
        pages: {
          page1: {
            showPagePerItem: true,
            arrayPath: 'testing',
            editMode: [true],
            schema: {
              type: 'object',
              properties: {}
            },
            uiSchema: {},
          }
        },
        data: { testing: [{}] }
      }, {
        type: SET_DATA,
        data: { testing: [{}, {}] }
      });

      expect(state.pages.page1.editMode).to.eql([false, false]);
    });
    it('should set privacy agreement', () => {
      const state = reducer({
        data: {
          privacyAgreementAccepted: false
        }
      }, {
        type: SET_PRIVACY_AGREEMENT,
        privacyAgreementAccepted: true
      });

      expect(state.data.privacyAgreementAccepted).to.be.true;
    });
    it('should set submission field', () => {
      const state = reducer({
        submission: {
          hasAttemptedSubmit: false
        }
      }, {
        type: SET_SUBMISSION,
        field: 'hasAttemptedSubmit',
        value: true
      });

      expect(state.submission.hasAttemptedSubmit).to.be.true;
    });
    it('should set submitted', () => {
      const state = reducer({
        submission: {
          response: null,
          status: false
        }
      }, {
        type: SET_SUBMITTED,
        response: { field: 'test' }
      });

      expect(state.submission.status).to.equal('applicationSubmitted');
      expect(state.submission.response).to.eql({ field: 'test' });
    });
    it('should set save form status', () => {
      const state = reducer({
        savedStatus: SAVE_STATUSES.notAttempted
      }, {
        type: SET_SAVE_FORM_STATUS,
        status: SAVE_STATUSES.success
      });

      expect(state.savedStatus).to.equal(SAVE_STATUSES.success);
      expect(state.startingOver).to.be.false;
      expect(state.prefillStatus).to.equal(PREFILL_STATUSES.notAttempted);
    });
    it('should set auto save form status', () => {
      const state = reducer({
        autoSavedStatus: SAVE_STATUSES.notAttempted
      }, {
        type: SET_AUTO_SAVE_FORM_STATUS,
        status: SAVE_STATUSES.success
      });

      expect(state.autoSavedStatus).to.equal(SAVE_STATUSES.success);
    });
    it('should reset auto saved form status on error', () => {
      const state = reducer({
        autoSavedStatus: SAVE_STATUSES.failure,
        savedStatus: SAVE_STATUSES.notAttempted
      }, {
        type: SET_SAVE_FORM_STATUS,
        status: SAVE_STATUSES.noAuth
      });

      expect(state.savedStatus).to.equal(SAVE_STATUSES.noAuth);
      expect(state.autoSavedStatus).to.equal(SAVE_STATUSES.notAttempted);
    });
    it('should set fetch form status', () => {
      const state = reducer({
        loadedStatus: LOAD_STATUSES.notAttempted
      }, {
        type: SET_FETCH_FORM_STATUS,
        status: LOAD_STATUSES.pending
      });

      expect(state.loadedStatus).to.equal(LOAD_STATUSES.pending);
    });
    it('should set in progress form data', () => {
      const state = reducer({
        loadedStatus: LOAD_STATUSES.notAttempted,
        data: {},
        pages: {}
      }, {
        type: SET_IN_PROGRESS_FORM,
        data
      });

      expect(state.loadedStatus).to.equal(LOAD_STATUSES.success);
      expect(state.loadedData).to.equal(data);
      expect(state.data).to.equal(data.formData);
    });
    it('should merge prefill data with current form', () => {
      const state = reducer({
        data: { existingProp: true },
        prefillStatus: PREFILL_STATUSES.pending,
        pages: {}
      }, {
        type: SET_IN_PROGRESS_FORM,
        data,
      });

      expect(state.data.existingProp).to.be.true;
      expect(state.data.field).to.equal('foo');
      expect(state.prefillStatus).to.equal(PREFILL_STATUSES.success);
    });
    it('should not mark prefill successful when data is empty', () => {
      const state = reducer({
        data: {},
        prefillStatus: PREFILL_STATUSES.pending,
        pages: {}
      }, {
        type: SET_IN_PROGRESS_FORM,
        data: _.set('formData', {}, data)
      });

      expect(state.prefillStatus).to.equal(PREFILL_STATUSES.unfilled);
    });
    it('should set fetch form pending', () => {
      const state = reducer({
      }, {
        type: SET_FETCH_FORM_PENDING,
      });

      expect(state.loadedStatus).to.equal(LOAD_STATUSES.pending);
      expect(state.prefillStatus).to.be.undefined;
    });
    it('should set fetch form pending and prefill', () => {
      const state = reducer({
      }, {
        type: SET_FETCH_FORM_PENDING,
        prefill: true
      });

      expect(state.loadedStatus).to.equal(LOAD_STATUSES.pending);
      expect(state.prefillStatus).to.equal(PREFILL_STATUSES.pending);
    });
    it('should start over form', () => {
      const initialData = { field: true };
      const state = reducer({
        initialData,
        data: { field1: false }
      }, {
        type: SET_START_OVER,
      });

      expect(state.isStartingOver).to.be.true;
      expect(state.data).to.equal(initialData);
      expect(state.loadedStatus).to.equal(LOAD_STATUSES.pending);
    });
    it('should set prefill as unfilled', () => {
      const initialData = { field: true };
      const state = reducer({
        initialData
      }, {
        type: SET_PREFILL_UNFILLED,
      });

      expect(state.data).to.equal(initialData);
      expect(state.loadedStatus).to.equal(LOAD_STATUSES.notAttempted);
      expect(state.prefillStatus).to.equal(PREFILL_STATUSES.unfilled);
    });
  });
});
