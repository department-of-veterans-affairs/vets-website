import sinon from 'sinon';

import localStorage from 'platform/utilities/storage/localStorage';
import {
  setData,
  SET_DATA,
  setEditMode,
  SET_EDIT_MODE,
  setSubmission,
  SET_SUBMISSION,
  setPreSubmit,
  SET_PRE_SUBMIT,
  setSubmitted,
  SET_SUBMITTED,
  submitForm,
  uploadFile,
} from '../../src/js/actions';

describe('Schemaform actions:', () => {
  beforeAll(() => {
    sinon.stub(localStorage, 'getItem');
  });

  afterAll(() => {
    localStorage.getItem.restore();
  });

  describe('setData', () => {
    test('should return action', () => {
      const data = {};
      const action = setData(data);

      expect(action.data).toBe(data);
      expect(action.type).toBe(SET_DATA);
    });
  });
  describe('setEditMode', () => {
    test('should return action', () => {
      const page = 'page';
      const edit = false;
      const action = setEditMode(page, edit);

      expect(action.page).toBe(page);
      expect(action.edit).toBe(edit);
      expect(action.type).toBe(SET_EDIT_MODE);
    });
  });
  describe('setSubmission', () => {
    test('should return action', () => {
      const field = 'page';
      const value = false;
      const action = setSubmission(field, value);

      expect(action.field).toBe(field);
      expect(action.value).toBe(value);
      expect(action.type).toBe(SET_SUBMISSION);
    });
  });
  describe('setPreSubmit', () => {
    test('should return action', () => {
      const accepted = false;
      const action = setPreSubmit('preSubmitAccepted', accepted);

      expect(action.preSubmitAccepted).toBe(accepted);
      expect(action.type).toBe(SET_PRE_SUBMIT);
    });
  });
  describe('setSubmitted', () => {
    test('should return action', () => {
      const response = false;
      const action = setSubmitted(response);

      expect(action.response).toBe(response);
      expect(action.type).toBe(SET_SUBMITTED);
    });
    test('should return action with response.data', () => {
      const response = { data: false };
      const action = setSubmitted(response);

      expect(action.response).toBe(response.data);
      expect(action.type).toBe(SET_SUBMITTED);
    });
  });
  describe('submitForm', () => {
    let xhr;
    let requests = [];

    beforeEach(() => {
      global.FormData = sinon.stub().returns({
        append: sinon.spy(),
      });
      xhr = sinon.useFakeXMLHttpRequest();
      xhr.onCreate = req => {
        requests.push(req);
      };
      window.dataLayer = [];
    });

    afterEach(() => {
      delete global.FormData;
      global.XMLHttpRequest = window.XMLHttpRequest;
      xhr.restore();
      requests = [];
      window.dataLayer = [];
    });

    test('should set submitted', () => {
      const formConfig = {
        chapters: {},
      };
      const form = {
        pages: {
          testing: {},
        },
        data: {
          test: 1,
        },
      };
      const thunk = submitForm(formConfig, form);
      const dispatch = sinon.spy();
      const response = { data: {} };

      const promise = thunk(dispatch).then(() => {
        expect(dispatch.firstCall.args[0]).toEqual({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'submitPending',
          extra: null,
        });
        expect(dispatch.secondCall.args[0]).toEqual({
          type: SET_SUBMITTED,
          response: {},
        });
      });

      requests[0].respond(200, null, JSON.stringify(response));

      return promise;
    });
    test('should set submission error', () => {
      const formConfig = {
        chapters: {},
      };
      const form = {
        pages: {
          testing: {},
        },
        data: {
          test: 1,
        },
      };
      const thunk = submitForm(formConfig, form);
      const dispatch = sinon.spy();
      const response = { data: {} };

      const promise = thunk(dispatch).then(() => {
        expect(dispatch.firstCall.args[0]).toEqual({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'submitPending',
          extra: null,
        });
        expect(dispatch.secondCall.args[0]).toEqual({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'serverError',
          extra: null,
        });
      });

      requests[0].respond(400, null, JSON.stringify(response));

      return promise;
    });
    test('should set rate limit error', () => {
      const formConfig = {
        chapters: {},
      };
      const form = {
        pages: {
          testing: {},
        },
        data: {
          test: 1,
        },
      };
      const thunk = submitForm(formConfig, form);
      const dispatch = sinon.spy();
      const response = { data: {} };

      const promise = thunk(dispatch).then(() => {
        expect(dispatch.firstCall.args[0]).toEqual({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'submitPending',
          extra: null,
        });
        expect(dispatch.secondCall.args[0]).toEqual({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'throttledError',
          extra: 2000,
        });
      });

      requests[0].respond(
        429,
        {
          'x-ratelimit-reset': '2000',
        },
        JSON.stringify(response),
      );

      return promise;
    });
    test('should use submit function instead of url when provided', () => {
      const response = { data: {} };
      const formConfig = {
        submit: sinon.stub().resolves(response),
        chapters: {},
      };
      const form = {
        pages: {
          testing: {},
        },
        data: {
          test: 1,
        },
      };
      const thunk = submitForm(formConfig, form);
      const dispatch = sinon.spy();

      const promise = thunk(dispatch).then(() => {
        expect(dispatch.firstCall.args[0]).toEqual({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'submitPending',
          extra: null,
        });
        expect(formConfig.submit.called).toBe(true);
        expect(Object.keys(requests)).toHaveLength(0);
        expect(dispatch.secondCall.args[0]).toEqual({
          type: SET_SUBMITTED,
          response: response.data,
        });
      });

      return promise;
    });
  });
  describe('uploadFile', () => {
    let xhr;
    let requests = [];

    beforeEach(() => {
      global.FormData = sinon.stub().returns({
        append: sinon.spy(),
      });
      xhr = sinon.useFakeXMLHttpRequest();
      xhr.onCreate = req => {
        requests.push(req);
      };
    });

    afterEach(() => {
      delete global.FormData;
      global.XMLHttpRequest = window.XMLHttpRequest;
      xhr.restore();
      requests = [];
    });

    test('should reject if file is too big', done => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: 'jpg',
          size: 10,
        },
        {
          fileTypes: ['jpg'],
          maxSize: 5,
        },
        f => f,
        onChange,
        () => {
          expect(onChange.firstCall.args[0]).toEqual({
            name: 'jpg',
            errorMessage: 'File is too large to be uploaded',
          });
          done();
        },
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);
    });

    test('should reject if file is too small', done => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: 'jpg',
          size: 1,
        },
        {
          minSize: 5,
          fileTypes: ['jpg'],
          maxSize: 8,
        },
        f => f,
        onChange,
        () => {
          expect(onChange.firstCall.args[0]).toEqual({
            name: 'jpg',
            errorMessage: 'File is too small to be uploaded',
          });
          done();
        },
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);
    });

    test('should reject if file is wrong type', done => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: 'jpg',
          size: 5,
        },
        {
          fileTypes: ['jpeg'],
          maxSize: 5,
        },
        f => f,
        onChange,
        () => {
          expect(onChange.firstCall.args[0]).toEqual({
            errorMessage: 'File is not one of the allowed types',
            name: 'jpg',
          });
          done();
        },
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);
    });

    test('should call set data on success', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: 'jpg',
          size: 0,
        },
        {
          endpoint: '/v0/endpoint',
          fileTypes: ['JPG'],
          maxSize: 5,
          createPayload: f => f,
          parseResponse: f => f.data.attributes,
        },
        f => f,
        onChange,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);
      requests[0].respond(
        200,
        null,
        JSON.stringify({
          data: {
            attributes: {
              name: 'Test name',
              size: 1234,
              confirmationCode: 'Test code',
            },
          },
        }),
      );

      expect(onChange.firstCall.args[0]).toEqual({
        name: 'jpg',
        uploading: true,
      });
      expect(onChange.secondCall.args[0]).toEqual({
        name: 'Test name',
        size: 1234,
        confirmationCode: 'Test code',
      });
    });

    test('should set error on failure', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: 'jpg',
          size: 0,
        },
        {
          fileTypes: ['jpg'],
          maxSize: 5,
          createPayload: f => f,
          parseResponse: f => f.data.attributes,
        },
        f => f,
        onChange,
        f => f,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);

      requests[0].respond(400);

      expect(onChange.firstCall.args[0]).toEqual({
        name: 'jpg',
        uploading: true,
      });
      expect(onChange.secondCall.args[0]).toEqual({
        name: 'jpg',
        errorMessage: 'Bad Request',
      });
    });
    test('should set error on network issue', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: 'jpg',
          size: 0,
        },
        {
          fileTypes: ['jpg'],
          maxSize: 5,
          createPayload: f => f,
          parseResponse: f => f.data.attributes,
        },
        f => f,
        onChange,
        f => f,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);

      requests[0].error();

      expect(onChange.firstCall.args[0]).toEqual({
        name: 'jpg',
        uploading: true,
      });
      expect(onChange.secondCall.args[0]).toEqual({
        name: 'jpg',
        errorMessage: 'Network request failed',
      });
    });
    test('should set error if error message is bad', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: 'jpg',
          size: 0,
        },
        {
          fileTypes: ['jpg'],
          maxSize: 5,
          createPayload: f => f,
          parseResponse: f => f.data.attributes,
        },
        f => f,
        onChange,
        f => f,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);

      requests[0].respond(500, null, undefined);

      expect(onChange.firstCall.args[0]).toEqual({
        name: 'jpg',
        uploading: true,
      });
      expect(onChange.secondCall.args[0]).toEqual({
        name: 'jpg',
        errorMessage: 'Internal Server Error',
      });
    });
  });
});
