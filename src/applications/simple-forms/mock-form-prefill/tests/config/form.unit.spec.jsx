import { expect } from 'chai';
import sinon from 'sinon';
import formConfig from '../../config/form';

describe('mock-form-prefill form config', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should have correct form data', () => {
    expect(formConfig.rootUrl).to.exist;
    expect(formConfig.urlPrefix).to.eq('/');
    expect(formConfig.submitUrl).to.eq('/v0/api');
    expect(formConfig.trackingPrefix).to.eq('mock-prefill-');
    expect(formConfig.formId).to.eq('FORM-MOCK-PREFILL');
  });

  it('should have correct form title and subtitle', () => {
    expect(formConfig.title).to.exist;
    expect(formConfig.title).to.eq('Mock Form with Prefill');
    expect(formConfig.subTitle).to.exist;
    expect(formConfig.subTitle).to.eq(
      'mock prefill testing (VA Form FORM_MOCK_PREFILL)',
    );
  });

  it('should have introduction and confirmation containers', () => {
    expect(formConfig.introduction).to.exist;
    expect(formConfig.confirmation).to.exist;
  });

  it('should have prefill enabled', () => {
    expect(formConfig.prefillEnabled).to.be.true;
  });

  it('should have pages configured', () => {
    const { pages } = formConfig.chapters.contactInfo;
    expect(pages).to.exist;
    expect(Object.keys(pages).length).to.be.greaterThan(0);
  });

  it('should have dev options configured', () => {
    expect(formConfig.dev).to.exist;
    expect(formConfig.dev.showNavLinks).to.be.true;
    expect(formConfig.dev.collapsibleNavLinks).to.be.true;
    expect(formConfig.dev.disableWindowUnloadInCI).to.be.true;
  });

  it('should have saved form messages', () => {
    expect(formConfig.savedFormMessages).to.exist;
    expect(formConfig.savedFormMessages.notFound).to.exist;
    expect(formConfig.savedFormMessages.noAuth).to.exist;
  });

  describe('submit function', () => {
    it('should return a promise with confirmation number', async () => {
      const result = await formConfig.submit();
      expect(result).to.exist;
      expect(result.attributes).to.exist;
      expect(result.attributes.confirmationNumber).to.eq('123123123');
    });
  });

  describe('prefillTransformer', () => {
    it('should transform form data correctly with SSN and VA file number', () => {
      const pages = {};
      const formData = {
        data: {
          attributes: {
            veteran: {
              ssn: '123456789',
              vaFileNumber: 'c12345678',
            },
          },
        },
      };
      const metadata = { test: 'metadata' };

      const result = formConfig.prefillTransformer(pages, formData, metadata);

      expect(result.formData.ssn).to.eq('123456789');
      expect(result.formData.vaFileNumber).to.eq('c12345678');
      expect(result.metadata).to.deep.eq(metadata);
      expect(result.pages).to.deep.eq(pages);
    });

    it('should handle missing SSN', () => {
      const pages = {};
      const formData = {
        data: {
          attributes: {
            veteran: {
              vaFileNumber: 'c12345678',
            },
          },
        },
      };
      const metadata = {};

      const result = formConfig.prefillTransformer(pages, formData, metadata);

      expect(result.formData.ssn).to.be.undefined;
      expect(result.formData.vaFileNumber).to.eq('c12345678');
    });

    it('should handle missing VA file number', () => {
      const pages = {};
      const formData = {
        data: {
          attributes: {
            veteran: {
              ssn: '123456789',
            },
          },
        },
      };
      const metadata = {};

      const result = formConfig.prefillTransformer(pages, formData, metadata);

      expect(result.formData.ssn).to.eq('123456789');
      expect(result.formData.vaFileNumber).to.be.undefined;
    });

    it('should handle empty form data', () => {
      const pages = {};
      const formData = {};
      const metadata = {};

      const result = formConfig.prefillTransformer(pages, formData, metadata);

      expect(result.formData.ssn).to.be.undefined;
      expect(result.formData.vaFileNumber).to.be.undefined;
    });
  });
});
