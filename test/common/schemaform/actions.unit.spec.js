import { expect } from 'chai';
import sinon from 'sinon';

import {
  setData,
  SET_DATA,
  setEditMode,
  SET_EDIT_MODE,
  setSubmission,
  SET_SUBMISSION,
  setPrivacyAgreement,
  SET_PRIVACY_AGREEMENT,
  setSubmitted,
  SET_SUBMITTED,
  submitForm,
  uploadFile
} from '../../../src/js/common/schemaform/actions';

describe('Schemaform actions:', () => {
  describe('setData', () => {
    it('should return action', () => {
      const data = {};
      const action = setData(data);

      expect(action.data).to.equal(data);
      expect(action.type).to.equal(SET_DATA);
    });
  });
  describe('setEditMode', () => {
    it('should return action', () => {
      const page = 'page';
      const edit = false;
      const action = setEditMode(page, edit);

      expect(action.page).to.equal(page);
      expect(action.edit).to.equal(edit);
      expect(action.type).to.equal(SET_EDIT_MODE);
    });
  });
  describe('setSubmission', () => {
    it('should return action', () => {
      const field = 'page';
      const value = false;
      const action = setSubmission(field, value);

      expect(action.field).to.equal(field);
      expect(action.value).to.equal(value);
      expect(action.type).to.equal(SET_SUBMISSION);
    });
  });
  describe('setPrivacyAgreement', () => {
    it('should return action', () => {
      const accepted = false;
      const action = setPrivacyAgreement(accepted);

      expect(action.privacyAgreementAccepted).to.equal(accepted);
      expect(action.type).to.equal(SET_PRIVACY_AGREEMENT);
    });
  });
  describe('setSubmitted', () => {
    it('should return action', () => {
      const response = false;
      const action = setSubmitted(response);

      expect(action.response).to.equal(response);
      expect(action.type).to.equal(SET_SUBMITTED);
    });
    it('should return action with response.data', () => {
      const response = { data: false };
      const action = setSubmitted(response);

      expect(action.response).to.equal(response.data);
      expect(action.type).to.equal(SET_SUBMITTED);
    });
  });
  describe('submitForm', () => {
    let fetchMock;
    let oldFetch;

    beforeEach(() => {
      oldFetch = global.fetch;
      fetchMock = sinon.stub();
      global.fetch = fetchMock;
      window.dataLayer = [];
    });

    afterEach(() => {
      global.fetch = oldFetch;
    });

    it('should set submitted', () => {
      const formConfig = {
        chapters: {}
      };
      const form = {
        pages: {
          testing: {},
        },
        data: {
          test: 1
        }
      };
      const thunk = submitForm(formConfig, form);
      const dispatch = sinon.spy();
      const response = { data: {} };
      fetchMock.returns({
        then: (fn) => fn(
          {
            ok: true,
            status: 200,
            json: () => Promise.resolve(response)
          }
        )
      });

      return thunk(dispatch).then(() => {
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'submitPending'
        });
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_SUBMITTED,
          response: {}
        });
      });
    });
    it('should submit with auth header', () => {
      const formConfig = {
        chapters: {}
      };
      const form = {
        pages: {
          testing: {},
        },
        data: {
          test: 1
        }
      };
      global.sessionStorage = { userToken: 'testing' };
      const thunk = submitForm(formConfig, form);
      const dispatch = sinon.spy();
      const response = { data: {} };
      fetchMock.returns({
        then: (fn) => fn(
          {
            ok: true,
            status: 200,
            json: () => Promise.resolve(response)
          }
        )
      });

      return thunk(dispatch).then(() => {
        expect(fetchMock.firstCall.args[1].headers.Authorization).to.equal('Token token=testing');
      });
    });
    it('should set submission error', () => {
      const formConfig = {
        chapters: {}
      };
      const form = {
        pages: {
          testing: {},
        },
        data: {
          test: 1
        }
      };
      const thunk = submitForm(formConfig, form);
      const dispatch = sinon.spy();
      const response = { data: {} };
      fetchMock.returns({
        then: (fn) => fn(
          {
            ok: false,
            status: 500,
            json: () => Promise.resolve(response)
          }
        )
      });

      return thunk(dispatch).then(() => {
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'submitPending'
        });
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'error'
        });
      });
    });
  });
  describe('uploadFile', () => {
    let xhr;
    let requests = [];

    beforeEach(() => {
      global.FormData = sinon.stub().returns({
        append: sinon.spy()
      });
      xhr = sinon.useFakeXMLHttpRequest();
      xhr.onCreate = (req) => {
        requests.push(req);
      };
    });

    afterEach(() => {
      delete global.FormData;
      global.XMLHttpRequest = window.XMLHttpRequest;
      xhr.restore();
      requests = [];
    });

    it('should reject if file is too big', (done) => {
      const thunk = uploadFile(
        {
          name: 'jpg',
          size: 10
        },
        ['fileField', 0],
        {
          fileTypes: ['jpg'],
          maxSize: 5
        }
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {}
        }
      });

      thunk(dispatch, getState).then(() => {
        done('Should have failed on a file that is too big');
      }).catch(() => {
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_DATA,
          data: {
            fileField: [
              {
                errorMessage: 'File is too large to be uploaded'
              }
            ]
          }
        });
        done();
      });
    });

    it('should reject if file is too small', (done) => {
      const thunk = uploadFile(
        {
          name: 'jpg',
          size: 1
        },
        ['fileField', 0],
        {
          minSize: 5,
          fileTypes: ['jpg'],
          maxSize: 8
        }
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {}
        }
      });

      thunk(dispatch, getState).then(() => {
        done('Should have failed on a file that is too small');
      }).catch(() => {
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_DATA,
          data: {
            fileField: [
              {
                errorMessage: 'File is too small to be uploaded'
              }
            ]
          }
        });
        done();
      });
    });

    it('should reject if file is wrong type', () => {
      const thunk = uploadFile(
        {
          name: 'jpg',
          size: 5
        },
        ['fileField', 0],
        {
          fileTypes: ['jpeg'],
          maxSize: 5
        }
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {}
        }
      });

      return thunk(dispatch, getState).then(() => {
        throw new Error('Should have failed on non-allowed file type');
      }).catch(() => {
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_DATA,
          data: {
            fileField: [
              {
                errorMessage: 'File is not one of the allowed types'
              }
            ]
          }
        });
      });
    });
    it('should call set data on success', () => {
      const thunk = uploadFile(
        {
          name: 'jpg',
          size: 0
        },
        ['fileField', 0],
        {
          endpoint: '/v0/endpoint',
          fileTypes: ['JPG'],
          maxSize: 5
        }
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {}
        }
      });

      const promise = thunk(dispatch, getState).then(() => {
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_DATA,
          data: {
            fileField: [
              {
                name: 'jpg',
                uploading: true
              }
            ]
          }
        });
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_DATA,
          data: {
            fileField: [
              {
                name: 'Test name',
                size: 1234,
                confirmationCode: 'Test code'
              }
            ]
          }
        });
      });

      requests[0].respond(200, null, JSON.stringify({
        data: {
          attributes: {
            name: 'Test name',
            size: 1234,
            confirmationCode: 'Test code'
          }
        }
      }));

      return promise;
    });

    it('should set error on failure', () => {
      const thunk = uploadFile(
        {
          name: 'jpg',
          size: 0
        },
        ['fileField', 0],
        {
          fileTypes: ['jpg'],
          maxSize: 5
        }
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {}
        }
      });

      const promise = thunk(dispatch, getState).then(() => {
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_DATA,
          data: {
            fileField: [
              {
                name: 'jpg',
                uploading: true
              }
            ]
          }
        });
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_DATA,
          data: {
            fileField: [
              {
                errorMessage: 'Bad Request'
              }
            ]
          }
        });
      });

      requests[0].respond(400);

      return promise;
    });
    it('should set error on network issue', () => {
      const thunk = uploadFile(
        {
          name: 'jpg',
          size: 0
        },
        ['fileField', 0],
        {
          fileTypes: ['jpg'],
          maxSize: 5
        }
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {}
        }
      });

      const promise = thunk(dispatch, getState).then(() => {
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_DATA,
          data: {
            fileField: [
              {
                name: 'jpg',
                uploading: true
              }
            ]
          }
        });
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_DATA,
          data: {
            fileField: [
              {
                errorMessage: 'Network request failed'
              }
            ]
          }
        });
      });

      requests[0].error();

      return promise;
    });
  });
});
