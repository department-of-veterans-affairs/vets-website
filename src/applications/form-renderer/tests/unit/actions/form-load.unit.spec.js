import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { formConfig1, normalizedForm } from '../../../_config/formConfig';
import {
  DIGITAL_FORMS_FILENAME,
  FORM_LOADING_SUCCEEDED,
  INTEGRATION_DEPLOYMENT,
  fetchDrupalDigitalForms,
  fetchFormConfig,
  findFormByFormId,
} from '../../../actions/form-load';

const sinon = require('sinon');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const initialState = {
  formId: null,
  formConfig: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
};

describe('form-load actions', () => {
  describe('fetchDrupalDigitalForms', () => {
    let mockFetch;
    let url;

    const jsonOK = body =>
      new Response(JSON.stringify(body), {
        status: 200,
        headers: {
          'Content-type': 'application/json',
        },
      });

    beforeEach(async () => {
      mockFetch = sinon.stub(global, 'fetch').resolves(jsonOK(['test data']));

      await fetchDrupalDigitalForms();

      [[url]] = mockFetch.args;
    });

    afterEach(() => {
      global.fetch.restore();
    });

    it('fetches from the integration branch Tugboat', () => {
      expect(url).to.have.string(INTEGRATION_DEPLOYMENT);
    });

    it('fetches the correct file', () => {
      expect(url).to.have.string(DIGITAL_FORMS_FILENAME);
    });
  });

  describe('fetchFormConfig', () => {
    let store;
    let stub;

    beforeEach(() => {
      store = mockStore(initialState);
      stub = sinon.stub().resolves([formConfig1, normalizedForm]);
    });

    it('calls the given fetchMethod', async () => {
      await store.dispatch(fetchFormConfig('123-abc', stub));
      expect(stub.calledOnce).to.be.true;
    });

    it('puts a formConfig into state', async () => {
      await store.dispatch(fetchFormConfig('2121212', stub));
      const successAction = store
        .getActions()
        .find(action => action.type === FORM_LOADING_SUCCEEDED);

      // Testing for urlPrefix as it is not included in the normalized data
      // structure
      expect(successAction.formConfig.urlPrefix).to.eq('/2121212/');
    });
  });

  describe('findFormByFormId', () => {
    const forms = [
      {
        cmsId: 71159,
        title: 'Form with One Step',
        formId: '1111111',
        ombNumber: '1111-1111',
        chapters: [
          {
            id: 158252,
            chapterTitle: 'The Only Step',
            type: 'digital_form_name_and_date_of_bi',
            pageTitle: 'Name and Date of Birth',
            additionalFields: {
              includeDateOfBirth: true,
            },
          },
        ],
      },
      {
        cmsId: 71160,
        title: 'Form with Two Steps',
        formId: '2121212',
        ombNumber: '1212-1212',
        chapters: [
          {
            id: 158253,
            chapterTitle: 'First Step',
            type: 'digital_form_name_and_date_of_bi',
            pageTitle: 'Name and Date of Birth',
            additionalFields: {
              includeDateOfBirth: true,
            },
          },
          {
            id: 158254,
            chapterTitle: 'Second Step',
            type: 'digital_form_name_and_date_of_bi',
            pageTitle: 'Name and Date of Birth',
            additionalFields: {
              includeDateOfBirth: false,
            },
          },
        ],
      },
    ];

    context('when formId matches a form', () => {
      it('returns the form', () => {
        const form = findFormByFormId(forms, '1111111');

        expect(form.title).to.eq('Form with One Step');
      });
    });

    context('when formId does not match a form', () => {
      it('raises an error', () => {
        expect(() => findFormByFormId(forms, 'XXXXXX')).to.throw();
      });
    });
  });
});
