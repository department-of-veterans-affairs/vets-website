import { expect } from 'chai';
import sinon from 'sinon';
import { testkit } from 'platform/testing/unit/sentry';

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
  setFormErrors,
  SET_FORM_ERRORS,
  setItf,
  SET_ITF,
  closeReviewChapter,
  CLOSE_REVIEW_CHAPTER,
  openReviewChapter,
  OPEN_REVIEW_CHAPTER,
  toggleAllReviewChapters,
  TOGGLE_ALL_REVIEW_CHAPTERS,
} from '../../src/js/actions';

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
  describe('setPreSubmit', () => {
    it('should return action', () => {
      const accepted = false;
      const action = setPreSubmit('preSubmitAccepted', accepted);

      expect(action.preSubmitAccepted).to.equal(accepted);
      expect(action.type).to.equal(SET_PRE_SUBMIT);
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
    let xhr;
    let requests = [];

    beforeEach(() => {
      testkit.reset();
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
      testkit.reset(); // reset before and after until we can do this in a global hook
      delete global.FormData;
      global.XMLHttpRequest = window.XMLHttpRequest;
      xhr.restore();
      requests = [];
      window.dataLayer = [];
    });

    it('should set submitted', () => {
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
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'submitPending',
          extra: null,
          errorMessage: null,
        });
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_SUBMITTED,
          response: {},
        });
      });

      requests[0].respond(200, {}, JSON.stringify(response));

      return promise;
    });
    it('should set submission error', () => {
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
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'submitPending',
          extra: null,
          errorMessage: null,
        });
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'serverError',
          extra: null,
          errorMessage: 'vets_server_error: Bad Request',
        });
      });

      requests[0].respond(400, {}, JSON.stringify(response));

      return promise;
    });
    it('should send data to Sentry on submission error', () => {
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
        // Data from SiP
        loadedData: {
          metadata: {
            inProgressFormId: '123',
          },
        },
      };
      const thunk = submitForm(formConfig, form);
      const dispatch = () => {};
      const response = { data: {} };

      const promise = thunk(dispatch).then(() => {
        const sentryReports = testkit.reports();
        expect(sentryReports.length).to.equal(2);
        expect(sentryReports[1].extra.inProgressFormId).to.equal('123');
        expect(sentryReports[1].extra.errorType).to.equal('serverError');
        expect(sentryReports[1].extra.statusText).to.equal('Bad Request');
      });

      requests[0].respond(400, {}, JSON.stringify(response));

      return promise;
    });
    it('should set rate limit error', () => {
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
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'submitPending',
          extra: null,
          errorMessage: null,
        });
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'throttledError',
          extra: 2000,
          errorMessage: 'vets_throttled_error: undefined',
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
    it('should use submit function instead of url when provided', () => {
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

      return thunk(dispatch).then(() => {
        expect(dispatch.firstCall.args[0]).to.eql({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'submitPending',
          extra: null,
          errorMessage: null,
        });
        expect(formConfig.submit.called).to.be.true;
        expect(requests).to.be.empty;
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_SUBMITTED,
          response: response.data,
        });
      });
    });
  });
  describe('uploadFile when enableShortWorkflow is true', () => {
    let xhr;
    let requests = [];
    const enableShortWorkflow = true;

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

    it('should reject if file is too large', done => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
          size: 10,
        },
        {
          fileTypes: ['jpg'],
          maxSize: 5,
          maxPdfSize: 20,
        },
        f => f,
        onChange,
        () => {
          expect(onChange.firstCall.args[0]).to.eql({
            name: '1.jpg',
            errorMessage:
              'We couldn\u2019t upload your file because it\u2019s too large. ' +
              `File size must be less than 5B.`,
            size: 10,
          });
          done();
        },
        undefined,
        undefined,
        enableShortWorkflow,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);
    });

    it('should reject if PDF file is too big', done => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.pdf',
          size: 10,
        },
        {
          fileTypes: ['pdf'],
          maxSize: 20,
          maxPdfSize: 5,
        },
        f => f,
        onChange,
        () => {
          expect(onChange.firstCall.args[0]).to.eql({
            name: '1.pdf',
            errorMessage:
              'We couldn\u2019t upload your file because it\u2019s too large. ' +
              `File size must be less than 5B.`,
            size: 10,
          });
          done();
        },
        undefined,
        undefined,
        enableShortWorkflow,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);
    });

    it('should reject if file is too big & show the custom max file size text', done => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
          size: 10,
        },
        {
          fileTypes: ['jpg'],
          maxSize: 5,
          maxSizeText: '5 Bytes',
          maxPdfSize: 20,
        },
        f => f,
        onChange,
        () => {
          expect(onChange.firstCall.args[0]).to.eql({
            name: '1.jpg',
            errorMessage:
              'We couldn\u2019t upload your file because it\u2019s too large. ' +
              `File size must be less than 5 Bytes.`,
            size: 10,
          });
          done();
        },
        undefined,
        undefined,
        enableShortWorkflow,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);
    });

    it('should reject if file is too small', done => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
          size: 1,
        },
        {
          minSize: 5,
          minSizeText: '5 Bytes',
          fileTypes: ['jpg'],
          maxSize: 8,
        },
        f => f,
        onChange,
        () => {
          expect(onChange.firstCall.args[0]).to.eql({
            name: '1.jpg',
            errorMessage:
              'We couldn\u2019t upload your file because it\u2019s too small. ' +
              `Try uploading a file that\u2019s 5 Bytes or more.`,
          });
          done();
        },
        undefined,
        undefined,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);
    });

    it('should reject if file is too small & show custom min size text', done => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
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
          expect(onChange.firstCall.args[0]).to.eql({
            name: '1.jpg',
            errorMessage:
              'We couldn\u2019t upload your file because it\u2019s too small. ' +
              `Try uploading a file that\u2019s 5B or more.`,
          });
          done();
        },
        undefined,
        undefined,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);
    });

    it('should reject if file is wrong type', done => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
          size: 5,
        },
        {
          fileTypes: ['jpeg'],
          maxSize: 5,
        },
        f => f,
        onChange,
        () => {
          expect(onChange.firstCall.args[0]).to.eql({
            errorMessage:
              'We couldn\u2019t upload your file because we can\u2019t accept this type of file. ' +
              'Please make sure the file is a .jpeg file and try again.',
            name: '1.jpg',
          });
          done();
        },
        undefined,
        undefined,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);
    });

    it('should render wrong file type message with seperators', done => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
          size: 5,
        },
        {
          fileTypes: ['jpeg', 'pdf', 'img'],
          maxSize: 5,
        },
        f => f,
        onChange,
        () => {
          expect(onChange.firstCall.args[0]).to.eql({
            errorMessage:
              'We couldn\u2019t upload your file because we can\u2019t accept this type of file. ' +
              'Please make sure the file is a .jpeg, .pdf, or .img file and try again.',
            name: '1.jpg',
          });
          done();
        },
        undefined,
        undefined,
        enableShortWorkflow,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);
    });

    it('should call set data on success', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
          size: 1234,
        },
        {
          endpoint: '/v0/endpoint',
          fileTypes: ['JPG'],
          maxSize: 5000,
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
        {},
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

      expect(onChange.firstCall.args[0]).to.eql({
        name: '1.jpg',
        uploading: true,
      });
      expect(onChange.secondCall.args[0]).to.include({
        name: 'Test name',
        size: 1234,
        confirmationCode: 'Test code',
        isEncrypted: false,
      });
    });

    it('should successfully upload large PDF', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.pdf',
          size: 10,
        },
        {
          endpoint: '/v0/endpoint',
          fileTypes: ['PDF'],
          maxSize: 5,
          maxPdfSize: 15,
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
        {},
        JSON.stringify({
          data: {
            attributes: {
              name: 'Test name',
              size: 10,
              confirmationCode: 'Test code',
            },
          },
        }),
      );

      expect(onChange.firstCall.args[0]).to.eql({
        name: '1.pdf',
        uploading: true,
      });
      expect(onChange.secondCall.args[0]).to.include({
        name: 'Test name',
        size: 10,
        confirmationCode: 'Test code',
        isEncrypted: false,
      });
    });

    it('should set error on failure', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
          size: 1,
        },
        {
          fileTypes: ['1.jpg'],
          maxSize: 5,
          createPayload: f => f,
          parseResponse: f => f.data.attributes,
        },
        f => f,
        onChange,
        f => f,
        undefined,
        undefined,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);

      requests[0].respond(400);

      expect(onChange.firstCall.args[0]).to.eql({
        name: '1.jpg',
        uploading: true,
      });
      expect(onChange.secondCall.args[0]).to.eql({
        file: { name: '1.jpg', size: 1 },
        name: '1.jpg',
        size: 1,
        errorMessage: 'Bad Request',
      });
    });
    it('should set error on network issue', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
          size: 0,
        },
        {
          fileTypes: ['1.jpg'],
          maxSize: 5,
          createPayload: f => f,
          parseResponse: f => f.data.attributes,
        },
        f => f,
        onChange,
        f => f,
        undefined,
        undefined,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);

      requests[0].error();
      expect(onChange.firstCall.args[0]).to.eql({
        name: '1.jpg',
        uploading: true,
      });
      expect(onChange.secondCall.args[0]).to.eql({
        name: '1.jpg',
        errorMessage:
          'We couldn’t upload your file due to a connection problem. Try again in a few moments.',
        file: {
          name: '1.jpg',
          size: 0,
        },
      });
    });
    it('should set error if error message is bad', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
          size: 42,
        },
        {
          fileTypes: ['jpg'],
          maxSize: 50,
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

      requests[0].respond(500, {}, undefined);

      expect(onChange.firstCall.args[0]).to.eql({
        name: '1.jpg',
        uploading: true,
      });
      expect(onChange.secondCall.args[0]).to.eql({
        file: { name: '1.jpg', size: 42 },
        name: '1.jpg',
        size: 42,
        errorMessage: 'Internal Server Error',
      });
    });
    it('should NOT set custom error if network 500 response', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
          size: 42,
        },
        {
          fileTypes: ['jpg'],
          maxSize: 50,
          fileUploadNetworkErrorMessage:
            'We’re sorry. There was problem with our system and we couldn’t upload your file. You can try again later.',
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

      requests[0].respond(500, {}, undefined);

      expect(onChange.firstCall.args[0]).to.eql({
        name: '1.jpg',
        uploading: true,
      });
      expect(onChange.secondCall.args[0]).to.eql({
        file: { name: '1.jpg', size: 42 },
        name: '1.jpg',
        size: 42,
        errorMessage: 'Internal Server Error',
      });
    });
    it('should set custom error message on network error', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
          size: 42,
        },
        {
          fileTypes: ['jpg'],
          maxSize: 50,
          fileUploadNetworkErrorMessage:
            'We’re sorry. There was problem with our system and we couldn’t upload your file. You can try again later.',
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

      expect(onChange.firstCall.args[0]).to.eql({
        name: '1.jpg',
        uploading: true,
      });
      expect(onChange.secondCall.args[0]).to.eql({
        file: { name: '1.jpg', size: 42 },
        name: '1.jpg',
        errorMessage:
          'We’re sorry. There was problem with our system and we couldn’t upload your file. You can try again later.',
      });
    });
    it('should set alert on network error', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
          size: 0,
        },
        {
          fileTypes: ['1.jpg'],
          maxSize: 5,
          fileUploadNetworkErrorAlert: {
            header: 'Alert header',
            body: ['body text'],
          },
          createPayload: f => f,
          parseResponse: f => f.data.attributes,
        },
        f => f,
        onChange,
        f => f,
        undefined,
        undefined,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);

      requests[0].error();
      expect(onChange.firstCall.args[0]).to.eql({
        name: '1.jpg',
        uploading: true,
      });
      expect(onChange.secondCall.args[0]).to.eql({
        name: '1.jpg',
        errorMessage:
          'We couldn’t upload your file due to a connection problem. Try again in a few moments.',
        alert: {
          header: 'Alert header',
          body: ['body text'],
        },
        file: {
          name: '1.jpg',
          size: 0,
        },
      });
    });
    it('should not set alert on network 400 response', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        {
          name: '1.jpg',
          size: 1,
        },
        {
          fileTypes: ['1.jpg'],
          maxSize: 5,
          fileUploadNetworkErrorAlert: {
            header: 'Alert header text',
            body: ['Alert body text'],
          },
          createPayload: f => f,
          parseResponse: f => f.data.attributes,
        },
        f => f,
        onChange,
        f => f,
        undefined,
        undefined,
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: {
          data: {},
        },
      });

      thunk(dispatch, getState);

      requests[0].respond(400);

      expect(onChange.firstCall.args[0]).to.eql({
        name: '1.jpg',
        uploading: true,
      });
      expect(onChange.secondCall.args[0]).to.eql({
        file: { name: '1.jpg', size: 1 },
        name: '1.jpg',
        size: 1,
        errorMessage: 'Bad Request',
      });
    });
  });
  describe('setFormErrors', () => {
    it('should return action', () => {
      const data = { test: 'foo' };
      const action = setFormErrors(data);
      expect(action.data).to.equal(data);
      expect(action.type).to.equal(SET_FORM_ERRORS);
    });
  });

  describe('setItf', () => {
    it('should return action', () => {
      const data = { test: 'foo' };
      const action = setItf(data);
      expect(action.data).to.equal(data);
      expect(action.type).to.equal(SET_ITF);
    });
  });

  describe('closeReviewChapter', () => {
    it('should return action', () => {
      const data = { name: 'foo' };
      const action = closeReviewChapter(data);
      expect(action).to.deep.equal({
        type: CLOSE_REVIEW_CHAPTER,
        closedChapter: data,
        pageKeys: [],
      });
    });
  });

  describe('openReviewChapter', () => {
    it('should return action', () => {
      const data = { name: 'foo' };
      const action = openReviewChapter(data);
      expect(action).to.deep.equal({
        type: OPEN_REVIEW_CHAPTER,
        openedChapter: data,
      });
    });
  });

  describe('toggleAllReviewChapters', () => {
    it('should return action', () => {
      const data = { foo: true, bar: true };
      const action = toggleAllReviewChapters(data);
      expect(action).to.deep.equal({
        type: TOGGLE_ALL_REVIEW_CHAPTERS,
        chapters: data,
      });
    });
  });
  describe('uploadFile token refresh retry', () => {
    let xhr;
    let requests = [];
    let refreshStub;
    let infoTokenExistsStub;

    beforeEach(() => {
      global.FormData = sinon.stub().returns({
        append: sinon.spy(),
        set: sinon.spy(),
      });
      xhr = sinon.useFakeXMLHttpRequest();
      xhr.onCreate = req => {
        requests.push(req);
      };

      const oauthUtilities = require('platform/utilities/oauth/utilities');
      refreshStub = sinon.stub(oauthUtilities, 'refresh').resolves();
      infoTokenExistsStub = sinon
        .stub(oauthUtilities, 'infoTokenExists')
        .returns(true);
    });

    afterEach(() => {
      delete global.FormData;
      global.XMLHttpRequest = window.XMLHttpRequest;
      xhr.restore();
      requests = [];

      if (refreshStub) refreshStub.restore();
      if (infoTokenExistsStub) infoTokenExistsStub.restore();
    });

    it('should call refresh on 403 token expired error', async () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        { name: '1.jpg', size: 1234 },
        {
          fileUploadUrl: '/v0/upload',
          fileTypes: ['jpg'],
          maxSize: 5000,
          createPayload: f => f,
          parseResponse: f => f.data.attributes,
        },
        f => f,
        onChange,
        () => {},
        'test-prefix',
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: { formId: 'test-form', data: {} },
      });

      thunk(dispatch, getState);

      requests[0].respond(
        403,
        {},
        JSON.stringify({
          errors: 'Access token has expired',
        }),
      );

      expect(refreshStub.called).to.be.true;

      await refreshStub.returnValues[0];

      expect(requests.length).to.equal(2);
      expect(requests[1].url).to.equal('/v0/upload');
    });

    it('should not call refresh on 403 with different error', () => {
      const onChange = sinon.spy();
      const thunk = uploadFile(
        { name: '1.jpg', size: 1234 },
        {
          fileUploadUrl: '/v0/upload',
          fileTypes: ['jpg'],
          maxSize: 5000,
          createPayload: f => f,
          parseResponse: f => f.data.attributes,
        },
        f => f,
        onChange,
        () => {},
        'test-prefix',
      );
      const dispatch = sinon.spy();
      const getState = sinon.stub().returns({
        form: { formId: 'test-form', data: {} },
      });

      thunk(dispatch, getState);

      requests[0].respond(
        403,
        {},
        JSON.stringify({
          errors: 'Forbidden - insufficient permissions',
        }),
      );

      expect(refreshStub.called).to.be.false;
    });
  });
  describe('submitForm token refresh retry', () => {
    let xhr;
    let requests = [];
    let refreshStub;
    let infoTokenExistsStub;

    beforeEach(() => {
      testkit.reset();
      xhr = sinon.useFakeXMLHttpRequest();
      xhr.onCreate = req => {
        requests.push(req);
      };
      window.dataLayer = [];

      const oauthUtilities = require('platform/utilities/oauth/utilities');
      refreshStub = sinon.stub(oauthUtilities, 'refresh').resolves();
      infoTokenExistsStub = sinon
        .stub(oauthUtilities, 'infoTokenExists')
        .returns(true);
    });

    afterEach(() => {
      testkit.reset();
      global.XMLHttpRequest = window.XMLHttpRequest;
      xhr.restore();
      requests = [];
      window.dataLayer = [];

      if (refreshStub) refreshStub.restore();
      if (infoTokenExistsStub) infoTokenExistsStub.restore();
    });

    it('should call refresh and retry on 403 token expired error', async () => {
      const formConfig = {
        chapters: {},
        submitUrl: '/v0/submit',
        trackingPrefix: 'test-form',
      };
      const form = {
        pages: { testing: {} },
        data: { test: 1 },
      };
      const thunk = submitForm(formConfig, form);
      const dispatch = sinon.spy();
      const response = { data: { confirmationNumber: '123' } };

      const promise = thunk(dispatch);

      // First request returns 403 with token expired
      requests[0].respond(
        403,
        null,
        JSON.stringify({
          errors: 'Access token has expired',
        }),
      );

      // Wait for refresh to be called
      await refreshStub.returnValues[0];

      expect(refreshStub.called).to.be.true;
      expect(requests.length).to.equal(2);

      // Second request succeeds
      requests[1].respond(200, null, JSON.stringify(response));

      return promise.then(() => {
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_SUBMITTED,
          response: response.data,
        });
      });
    });

    it('should not call refresh on 403 with different error', () => {
      const formConfig = {
        chapters: {},
        submitUrl: '/v0/submit',
        trackingPrefix: 'test-form',
      };
      const form = {
        pages: { testing: {} },
        data: { test: 1 },
      };
      const thunk = submitForm(formConfig, form);
      const dispatch = sinon.spy();

      const promise = thunk(dispatch).then(() => {
        expect(refreshStub.called).to.be.false;
        expect(requests.length).to.equal(1);
        expect(dispatch.secondCall.args[0]).to.eql({
          type: SET_SUBMISSION,
          field: 'status',
          value: 'serverError',
          extra: null,
          errorMessage: 'vets_server_error: Forbidden',
        });
      });

      requests[0].respond(
        403,
        null,
        JSON.stringify({
          errors: 'Forbidden - insufficient permissions',
        }),
      );

      return promise;
    });

    it('should not call refresh if infoTokenExists returns false', () => {
      infoTokenExistsStub.returns(false);

      const formConfig = {
        chapters: {},
        submitUrl: '/v0/submit',
        trackingPrefix: 'test-form',
      };
      const form = {
        pages: { testing: {} },
        data: { test: 1 },
      };
      const thunk = submitForm(formConfig, form);
      const dispatch = sinon.spy();

      const promise = thunk(dispatch).then(() => {
        expect(refreshStub.called).to.be.false;
        expect(requests.length).to.equal(1);
      });

      requests[0].respond(
        403,
        null,
        JSON.stringify({
          errors: 'Access token has expired',
        }),
      );

      return promise;
    });
  });
});
