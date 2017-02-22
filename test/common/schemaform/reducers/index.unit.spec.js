import { expect } from 'chai';

import { SET_DATA,
  SET_EDIT_MODE,
  SET_PRIVACY_AGREEMENT,
  SET_SUBMISSION,
  SET_SUBMITTED
} from '../../../../src/js/common/schemaform/actions';

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
                  field: {}
                }
              }
            },
            page2: {
              initialData: {},
              schema: {}
            }
          }
        }
      }
    };
    const reducer = createSchemaFormReducer(formConfig);
    const state = reducer(undefined, {});

    expect(state.submission).to.be.defined;
    expect(state.privacyAgreementAccepted).to.be.false;
    expect(state.page1.data.field).to.eql(formConfig.chapters.test.pages.page1.initialData.field);
    expect(state.page2).to.be.defined;
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
                  field: {}
                }
              }
            },
          }
        }
      }
    };
    const reducer = createSchemaFormReducer(formConfig);

    it('should set data state', () => {
      const state = reducer({
        page1: {
          schema: {},
          uiSchema: {},
          data: null
        }
      }, {
        type: SET_DATA,
        page: 'page1',
        data: { field: 'test2' }
      });

      expect(state.page1.data.field).to.equal('test2');
    });
    it('should set edit mode', () => {
      const state = reducer({
        page1: {
          editMode: false
        }
      }, {
        type: SET_EDIT_MODE,
        page: 'page1',
        edit: true
      });

      expect(state.page1.editMode).to.be.true;
    });
    it('should set privacy agreement', () => {
      const state = reducer({
        privacyAgreementAccepted: false
      }, {
        type: SET_PRIVACY_AGREEMENT,
        privacyAgreementAccepted: true
      });

      expect(state.privacyAgreementAccepted).to.be.true;
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
  });
});
