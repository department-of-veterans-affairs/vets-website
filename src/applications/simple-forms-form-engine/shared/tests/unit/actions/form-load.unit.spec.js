import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { DATA_FILES_PATH } from 'platform/site-wide/drupal-static-data/constants';
import ENVIRONMENTS from 'site/constants/environments';
import ENVIRONMENT_CONFIGURATIONS from 'site/constants/environments-configs';
import { normalizedForm } from '../../../config/formConfig';
import {
  DIGITAL_FORMS_FILENAME,
  FORM_LOADING_SUCCEEDED,
  fetchDrupalDigitalForms,
  fetchAndBuildFormConfig,
  findFormByFormId,
} from '../../../actions/form-load';

const sinon = require('sinon');

const PROD_ENV = ENVIRONMENT_CONFIGURATIONS[ENVIRONMENTS.VAGOVPROD];
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
    it('fetches from the correct URL', async () => {
      const mock = sinon.mock(global);
      mock
        .expects('fetch')
        .once()
        .withArgs(
          `${PROD_ENV.BASE_URL}/${DATA_FILES_PATH}/${DIGITAL_FORMS_FILENAME}`,
        );

      await fetchDrupalDigitalForms();

      mock.verify();
    });
  });

  describe('fetchAndBuildFormConfig', () => {
    let store;
    let stub;

    beforeEach(() => {
      store = mockStore(initialState);
      stub = sinon.stub().resolves([normalizedForm]);
    });

    it('calls the given fetchMethod', async () => {
      await store.dispatch(
        fetchAndBuildFormConfig(
          '2121212',
          {
            rootUrl: '/some-root-url',
            trackingPrefix: 'some-tracking-prefix-',
          },
          stub,
        ),
      );
      expect(stub.calledOnce).to.be.true;
    });

    it('puts a formConfig into state', async () => {
      await store.dispatch(
        fetchAndBuildFormConfig(
          '2121212',
          {
            rootUrl: '/some-root-url',
            trackingPrefix: 'some-tracking-prefix-',
          },
          stub,
        ),
      );
      const successAction = store
        .getActions()
        .find(action => action.type === FORM_LOADING_SUCCEEDED);

      // Testing for `urlPrefix` as it is not included in the normalized data
      // structure.
      expect(successAction.formConfig.urlPrefix).to.eq('/');

      // Testing for `formId` to ensure the returned formConfig is constructed
      // from the passed-in normalized data.
      expect(successAction.formConfig.formId).to.eq('2121212');
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
