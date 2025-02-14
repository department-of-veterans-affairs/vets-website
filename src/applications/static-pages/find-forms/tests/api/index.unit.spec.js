import { expect } from 'chai';
import sinon from 'sinon';
import * as apiHelpers from 'platform/utilities/api';
import { checkFormValidity, fetchFormsApi } from '../../api';
import * as sentryLogger from '../../helpers/sentryLogger';

describe('find forms API methods', () => {
  describe('checkFormValidity', () => {
    const currentLocation = global.window.location;
    const currentFetch = global.fetch;
    let fetchStub;
    let sentryStub;

    beforeEach(() => {
      global.window.location = {
        ...global.window.location,
        origin: 'http://localhost:3001',
      };
    });

    afterEach(() => {
      global.window.location = currentLocation;
      global.fetch = currentFetch;
      fetchStub.restore();
      sentryStub?.restore();
    });

    it('should return the proper form validity markers when given a valid form', async () => {
      fetchStub = sinon
        .stub(global, 'fetch')
        .resolves(new Response({ status: 200 }));

      const form = {
        attributes: {
          formName: '10-10169',
          url:
            'http://localhost:3001/vaforms/medical/pdf/10-10169%20Volunteer%20Consent%20Form.pdf',
          validPdf: true,
        },
      };

      const result = await checkFormValidity(form, 'Form Detail');

      expect(result).to.deep.eq({
        formPdfIsValid: true,
        formPdfUrlIsValid: true,
        networkRequestError: false,
      });
    });

    it('should return the proper form validity markers when given a form with an invalid PDF', async () => {
      fetchStub = sinon
        .stub(global, 'fetch')
        .resolves(new Response({ status: 200 }));

      const form = {
        attributes: {
          formName: '10-10169',
          url:
            'http://localhost:3001/vaforms/medical/pdf/10-10169%20Volunteer%20Consent%20Form.pdf',
          validPdf: false,
        },
      };

      const result = await checkFormValidity(form, 'Form Detail');

      expect(result).to.deep.eq({
        formPdfIsValid: false,
        formPdfUrlIsValid: true,
        networkRequestError: false,
      });
    });

    it('should return the proper form validity markers when given a form with a valid PDF but an invalid URL', async () => {
      fetchStub = sinon
        .stub(global, 'fetch')
        .resolves(new Response('error', { status: 500 }));

      const form = {
        attributes: {
          formName: '10-10169',
          url: 'http://localhost:3001/an/invalid/url.pdf',
          validPdf: true,
        },
      };

      const result = await checkFormValidity(form, 'Form Detail');

      expect(result).to.deep.eq({
        formPdfIsValid: true,
        formPdfUrlIsValid: false,
        networkRequestError: false,
      });
    });

    it('should return the proper form validity markers when given a valid form but the fetch call fails', async () => {
      fetchStub = sinon.stub(global, 'fetch').rejects(new Response('error'));
      sentryStub = sinon.stub(sentryLogger, 'sentryLogger');

      const form = {
        attributes: {
          formName: '10-10169',
          url:
            'http://localhost:3001/vaforms/medical/pdf/10-10169%20Volunteer%20Consent%20Form.pdf',
          validPdf: true,
        },
      };

      const result = await checkFormValidity(form, 'Form Detail');

      expect(result).to.deep.eq({
        formPdfIsValid: true,
        formPdfUrlIsValid: true,
        networkRequestError: true,
      });

      expect(sentryStub.called).to.be.true;
      expect(
        sentryStub.calledWith(
          form,
          form.attributes.formName,
          form.attributes.url,
          'Find Forms - Form Detail - onDownloadLinkClick function error',
        ),
      );
    });
  });

  describe('fetchFormsApi', () => {
    const dispatchSpy = sinon.spy();
    let apiStub;

    afterEach(() => {
      dispatchSpy.reset();
      apiStub.restore();
    });

    it('should set the correct valid forms when given a response with all valid forms', async () => {
      const allValidForms = [
        {
          attributes: {
            formName: '10-10164',
            validPdf: true,
            deletedAt: null,
          },
        },
        {
          attributes: {
            formName: '10-10116c',
            validPdf: true,
            deletedAt: null,
          },
        },
      ];

      apiStub = sinon
        .stub(apiHelpers, 'apiRequest')
        .resolves({ data: allValidForms });

      await fetchFormsApi('1010', dispatchSpy);

      expect(dispatchSpy.called).to.be.true;
      expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
        results: allValidForms,
        hasOnlyRetiredForms: false,
        type: 'findVAForms/FETCH_FORMS_SUCCESS',
      });
    });

    it('should set the correct valid forms when given a response with 1 valid form', async () => {
      const mixedValidForms = [
        {
          attributes: {
            formName: '10-10164',
            validPdf: true,
            deletedAt: null,
          },
        },
        {
          attributes: {
            formName: '10-10116c',
            validPdf: false,
            deletedAt: null,
          },
        },
      ];

      apiStub = sinon
        .stub(apiHelpers, 'apiRequest')
        .resolves({ data: mixedValidForms });

      await fetchFormsApi('1010', dispatchSpy);

      expect(dispatchSpy.called).to.be.true;
      expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
        results: mixedValidForms,
        hasOnlyRetiredForms: false,
        type: 'findVAForms/FETCH_FORMS_SUCCESS',
      });
    });

    it('should set the correct valid forms when given a response with 1 deleted form', async () => {
      const forms = [
        {
          attributes: {
            formName: '10-10164',
            validPdf: true,
            deletedAt: '2025-01-01',
          },
        },
      ];

      apiStub = sinon.stub(apiHelpers, 'apiRequest').resolves({ data: forms });

      await fetchFormsApi('1010', dispatchSpy);

      expect(dispatchSpy.called).to.be.true;
      expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
        results: forms,
        hasOnlyRetiredForms: true,
        type: 'findVAForms/FETCH_FORMS_SUCCESS',
      });
    });

    it('should dispatch a failure when the API request fails', async () => {
      apiStub = sinon.stub(apiHelpers, 'apiRequest').rejects();

      await fetchFormsApi('1010', dispatchSpy);

      expect(dispatchSpy.called).to.be.true;
      expect(dispatchSpy.firstCall.args[0].error.replace(/’/g, "'")).to.equal(
        "We're sorry. Something went wrong on our end. Please try again later.",
      );
      expect(dispatchSpy.firstCall.args[0].type).to.equal(
        'findVAForms/FETCH_FORMS_FAILURE',
      );
    });
  });
});
