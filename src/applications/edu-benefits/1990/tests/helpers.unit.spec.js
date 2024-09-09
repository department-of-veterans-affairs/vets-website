import { expect } from 'chai';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import sinon from 'sinon';
import { prefillTransformer, transform } from '../helpers';
import formConfig from '../config/form';

describe('1990 helpers', () => {
  describe('prefillTransformer', () => {
    it('should do nothing if no contact info is updated', () => {
      const formData = {};
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };
      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData).to.eql(formData);
    });
    it('should set the email', () => {
      const formData = {
        email: 'test@foo.com',
      };
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData['view:otherContactInfo'].email).to.eql(
        formData.email,
      );
    });
    it('should set the homePhone', () => {
      const formData = {
        homePhone: '999',
      };
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData['view:otherContactInfo'].homePhone).to.eql(
        formData.homePhone,
      );
    });
    it('should set the mobilePhone', () => {
      const formData = {
        mobilePhone: '999',
      };
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData['view:otherContactInfo'].mobilePhone).to.eql(
        formData.mobilePhone,
      );
    });
  });
  describe('transform', () => {
    let transformForSubmitStub;

    beforeEach(() => {
      transformForSubmitStub = sinon.stub(
        transformForSubmit,
        'transformForSubmit',
      );
    });

    afterEach(() => {
      transformForSubmitStub.restore();
    });

    it('should transform form data correctly for chapter33', () => {
      // const formConfig = {};
      const form = {
        data: { 'view:selectedBenefits': { chapter33: 'chapter33' } },
      };

      transformForSubmitStub.returns(
        JSON.stringify({ chapter33: 'chapter33' }),
      );

      const result = transform(formConfig, form);

      expect(JSON.parse(result)).to.deep.equal({
        educationBenefitsClaim: {
          form: JSON.stringify({ chapter33: true }),
        },
      });
    });

    it('should transform form data correctly for chapter30', () => {
      const form = {
        data: { 'view:selectedBenefits': { chapter33: 'chapter30' } },
      };

      transformForSubmitStub.returns(
        JSON.stringify({ chapter33: 'chapter30' }),
      );

      const result = transform(formConfig, form);

      expect(JSON.parse(result)).to.deep.equal({
        educationBenefitsClaim: {
          form: JSON.stringify({ chapter30: true }),
        },
      });
    });

    it('should transform form data correctly for chapter1606', () => {
      const form = {
        data: { 'view:selectedBenefits': { chapter33: 'chapter1606' } },
      };

      transformForSubmitStub.returns(
        JSON.stringify({ chapter33: 'chapter1606' }),
      );

      const result = transform(formConfig, form);

      expect(JSON.parse(result)).to.deep.equal({
        educationBenefitsClaim: {
          form: JSON.stringify({ chapter1606: true }),
        },
      });
    });

    it('should not modify chapter33 if it is not a string', () => {
      const form = {
        data: { 'view:selectedBenefits': { chapter33: 'chapter1606' } },
      };

      transformForSubmitStub.returns(JSON.stringify({ chapter1606: true }));

      const result = transform(formConfig, form);

      expect(JSON.parse(result)).to.deep.equal({
        educationBenefitsClaim: {
          form: JSON.stringify({ chapter1606: true }),
        },
      });
    });

    it('should delete chapter33 if it is a string but not a known chapter', () => {
      const form = {
        data: { 'view:selectedBenefits': { chapter33: '' } },
      };

      transformForSubmitStub.returns(
        JSON.stringify({ chapter33: 'someUnknownChapter' }),
      );

      const result = transform(formConfig, form);

      expect(JSON.parse(result)).to.deep.equal({
        educationBenefitsClaim: {
          form: JSON.stringify({}),
        },
      });
    });
  });
});
