import { expect } from 'chai';
import sinon from 'sinon';
import { allFormsRetired, checkFormValidity } from '../../api';
import * as hooks from '../../hooks/useFindFormsBrowserMonitoring';

describe('find forms API methods', () => {
  const sandbox = sinon.createSandbox();

  describe('checkFormValidity', () => {
    const currentLocation = global.window.location;

    beforeEach(() => {
      global.window.location = {
        ...global.window.location,
        origin: 'http://localhost:3001',
      };
    });

    afterEach(() => {
      global.window.location = currentLocation;
      sandbox.restore();
    });

    it('should return the proper form validity markers when given a valid form', async () => {
      sandbox.stub(global, 'fetch').resolves(new Response({ status: 200 }));

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
      sandbox.stub(global, 'fetch').resolves(new Response({ status: 200 }));

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
      sandbox
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
      sandbox.stub(global, 'fetch').rejects(new Response('error'));
      const datadogStub = sandbox.stub(hooks, 'datadogLogger');

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

      expect(datadogStub.called).to.be.true;
      expect(
        datadogStub.calledWith(
          form,
          form.attributes.url,
          'Find Forms - Form Detail - onDownloadLinkClick function error',
        ),
      );
    });
  });

  describe('allFormsRetired', () => {
    it('should return false when there is at least one valid form', () => {
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

      expect(allFormsRetired(allValidForms)).to.be.false;
    });

    it('should return false when there is at least one valid form', () => {
      const allValidForms = [
        {
          attributes: {
            formName: '10-10164',
            validPDF: true,
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

      expect(allFormsRetired(allValidForms)).to.be.false;
    });
  });

  it('should return false when there is at least one valid form', () => {
    const allValidForms = [
      {
        attributes: {
          formName: '10-10164',
          validPdf: true,
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

    expect(allFormsRetired(allValidForms)).to.be.false;
  });

  it('should return false when there is at least one valid form', () => {
    const allValidForms = [
      {
        attributes: {
          formName: '10-10164',
          validPdf: false,
        },
      },
      {
        attributes: {
          formName: '10-10116c',
          validPdf: true,
        },
      },
    ];

    expect(allFormsRetired(allValidForms)).to.be.false;
  });

  it('should return true when there are no valid forms', () => {
    const allValidForms = [
      {
        attributes: {
          formName: '10-10164',
          validPdf: false,
          deletedAt: '2025-01-01',
        },
      },
      {
        attributes: {
          formName: '10-10116c',
          validPdf: false,
        },
      },
    ];

    expect(allFormsRetired(allValidForms)).to.be.true;
  });
});
