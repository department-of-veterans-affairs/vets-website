import { expect } from 'chai';
import prefillTransformer from '../config/prefill-transformer';

describe('prefillTransformer', () => {
  const pages = ['page1', 'page2'];
  const metadata = { version: 1 };

  const defaultAddress = {
    street: '123 Main St',
    street2: 'Apt 1',
    city: 'Springfield',
    state: 'IL',
    country: 'UNITED STATES',
    postalCode: '62701',
  };

  describe('temporaryAddress', () => {
    it('should copy permanentAddress to temporaryAddress when temporaryAddress is missing', () => {
      const permanentAddress = { ...defaultAddress };
      const formData = {
        permanentAddress,
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.temporaryAddress).to.deep.equal(permanentAddress);
    });

    it('should copy permanentAddress to temporaryAddress when temporaryAddress is an empty object', () => {
      const permanentAddress = { ...defaultAddress };
      const formData = {
        permanentAddress,
        temporaryAddress: {},
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.temporaryAddress).to.deep.equal(permanentAddress);
    });

    it('should copy permanentAddress to temporaryAddress when temporaryAddress has empty street field', () => {
      const permanentAddress = { ...defaultAddress };
      const formData = {
        permanentAddress,
        temporaryAddress: {
          ...defaultAddress,
          street: '',
        },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.temporaryAddress).to.deep.equal(permanentAddress);
    });

    it('should copy permanentAddress to temporaryAddress when temporaryAddress street is whitespace only', () => {
      const permanentAddress = { ...defaultAddress };
      const formData = {
        permanentAddress,
        temporaryAddress: {
          ...defaultAddress,
          street: '   ',
        },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.temporaryAddress).to.deep.equal(permanentAddress);
    });

    it('should NOT copy permanentAddress when temporaryAddress has a valid street', () => {
      const permanentAddress = { ...defaultAddress };
      const temporaryAddress = {
        ...defaultAddress,
        street: '456 Elm St',
        city: 'Shelbyville',
      };
      const formData = {
        permanentAddress,
        temporaryAddress,
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.temporaryAddress).to.deep.equal(temporaryAddress);
      expect(result.formData.temporaryAddress.street).to.equal('456 Elm St');
    });
  });

  describe('country code transformation', () => {
    it('should convert country name to country code', () => {
      const formData = {
        permanentAddress: { ...defaultAddress, country: 'UNITED STATES' },
        temporaryAddress: { ...defaultAddress, country: 'UNITED STATES' },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.permanentAddress.country).to.equal('USA');
      expect(result.formData.temporaryAddress.country).to.equal('USA');
    });

    it('should set country to USA for territories', () => {
      const formData = {
        permanentAddress: { ...defaultAddress, country: 'Guam' },
        temporaryAddress: { ...defaultAddress, country: 'Guam' },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.permanentAddress.country).to.equal('USA');
      expect(result.formData.temporaryAddress.country).to.equal('USA');
    });

    it('should default to USA if country conversion fails', () => {
      const formData = {
        permanentAddress: { ...defaultAddress, country: 'UnknownCountry' },
        temporaryAddress: { ...defaultAddress, country: 'UnknownCountry' },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.permanentAddress.country).to.equal('USA');
      expect(result.formData.temporaryAddress.country).to.equal('USA');
    });
  });

  describe('military state detection', () => {
    it('should set isMilitary to true for military state (AE)', () => {
      const formData = {
        permanentAddress: { ...defaultAddress, state: 'AE' },
        temporaryAddress: { ...defaultAddress, state: 'AE' },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.permanentAddress.isMilitary).to.be.true;
      expect(result.formData.temporaryAddress.isMilitary).to.be.true;
    });

    it('should set isMilitary to true for military state (AP)', () => {
      const formData = {
        permanentAddress: { ...defaultAddress, state: 'AP' },
        temporaryAddress: { ...defaultAddress, state: 'AP' },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.permanentAddress.isMilitary).to.be.true;
      expect(result.formData.temporaryAddress.isMilitary).to.be.true;
    });

    it('should set isMilitary to false for non-military state (IL)', () => {
      const formData = {
        permanentAddress: { ...defaultAddress, state: 'IL' },
        temporaryAddress: { ...defaultAddress, state: 'IL' },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.permanentAddress.isMilitary).to.be.false;
      expect(result.formData.temporaryAddress.isMilitary).to.be.false;
    });
  });

  describe('street2 normalization', () => {
    it('should remove street2 if it is only a comma', () => {
      const formData = {
        permanentAddress: { ...defaultAddress, street2: ',' },
        temporaryAddress: { ...defaultAddress, street2: ',' },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.permanentAddress.street2).to.be.undefined;
      expect(result.formData.temporaryAddress.street2).to.be.undefined;
    });

    it('should keep street2 if it contains text besides comma', () => {
      const formData = {
        permanentAddress: { ...defaultAddress, street2: 'Apt 1, Suite A' },
        temporaryAddress: {
          ...defaultAddress,
          street2: 'Apt 2, Suite B',
        },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.permanentAddress.street2).to.equal(
        'Apt 1, Suite A',
      );
      expect(result.formData.temporaryAddress.street2).to.equal(
        'Apt 2, Suite B',
      );
    });
  });

  describe('return value', () => {
    it('should return pages and metadata unchanged', () => {
      const formData = {
        permanentAddress: { ...defaultAddress },
        temporaryAddress: { ...defaultAddress },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.pages).to.deep.equal(pages);
      expect(result.metadata).to.deep.equal(metadata);
    });

    it('should return transformed formData', () => {
      const formData = {
        permanentAddress: { ...defaultAddress, country: 'UNITED STATES' },
        temporaryAddress: { ...defaultAddress, country: 'UNITED STATES' },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData).to.exist;
      expect(result.formData.permanentAddress.country).to.equal('USA');
    });
  });

  describe('edge cases', () => {
    it('should handle missing permanentAddress gracefully', () => {
      const formData = {
        temporaryAddress: { ...defaultAddress },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData).to.exist;
    });

    it('should handle null country field', () => {
      const formData = {
        permanentAddress: { ...defaultAddress, country: null },
        temporaryAddress: { ...defaultAddress, country: null },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.permanentAddress).to.exist;
      expect(result.formData.temporaryAddress).to.exist;
    });

    it('should handle undefined state field', () => {
      const formData = {
        permanentAddress: { ...defaultAddress, state: undefined },
        temporaryAddress: { ...defaultAddress, state: undefined },
      };
      const result = prefillTransformer(pages, formData, metadata);
      expect(result.formData.permanentAddress.isMilitary).to.be.false;
      expect(result.formData.temporaryAddress.isMilitary).to.be.false;
    });
  });
});
