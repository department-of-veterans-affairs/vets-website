import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

describe('21P-0537 prefillTransformer', () => {
  const pages = [];
  const formData = {};
  const metadata = {};

  describe('authenticated user with complete profile', () => {
    it('should prefill data from user profile', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'Jennifer',
              middle: 'Marie',
              last: 'Smith',
            },
          },
        },
      };

      const prefilledformData = {
        claimantEmail: 'jennifer.smith@example.com',
        claimantPhone: '5551234567',
      };

      const result = prefillTransformer(
        pages,
        prefilledformData,
        metadata,
        state,
      );

      expect(result.formData['view:recipientName'].first).to.include(
        'Jennifer',
      );
      expect(result.formData['view:recipientName'].middle).to.include('Marie');
      expect(result.formData['view:recipientName'].last).to.include('Smith');
      expect(result.formData.emailAddress).to.include(
        'jennifer.smith@example.com',
      );
      expect(result.formData.primaryPhone).to.include('5551234567');
    });
  });

  describe('unauthenticated user', () => {
    it('should return empty data when profile is undefined', () => {
      const state = {
        user: {
          profile: undefined,
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData['view:recipientName'].first).to.equal('');
      expect(result.formData['view:recipientName'].last).to.equal('');
      expect(result.formData.emailAddress).to.equal('');
      expect(result.formData.primaryPhone).to.equal('');
    });

    it('should return empty data when user is undefined', () => {
      const state = {
        user: undefined,
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData['view:recipientName'].first).to.equal('');
      expect(result.formData['view:recipientName'].last).to.equal('');
    });

    it('should return empty data when state is undefined', () => {
      const result = prefillTransformer(pages, formData, metadata, undefined);

      expect(result.formData['view:recipientName'].first).to.equal('');
      expect(result.formData['view:recipientName'].last).to.equal('');
    });

    it('should return empty data when profile is empty object', () => {
      const state = {
        user: {
          profile: {},
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData['view:recipientName'].first).to.equal('');
      expect(result.formData['view:recipientName'].last).to.equal('');
    });
  });

  describe('partial profile data', () => {
    it('should handle missing email', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'John',
              last: 'Doe',
            },
          },
        },
      };

      const prefilledFormData = { claimantPhone: '5551234567' };
      const result = prefillTransformer(
        pages,
        prefilledFormData,
        metadata,
        state,
      );

      expect(result.formData['view:recipientName'].first).to.include('John');
      expect(result.formData['view:recipientName'].last).to.include('Doe');
      expect(result.formData.emailAddress).to.equal('');
      expect(result.formData.primaryPhone).to.include('5551234567');
    });

    it('should handle missing phone number', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'John',
              last: 'Doe',
            },
          },
        },
      };
      const prefilledFormData = {
        claimantEmail: 'john.doe@example.com',
      };

      const result = prefillTransformer(
        pages,
        prefilledFormData,
        metadata,
        state,
      );

      expect(result.formData['view:recipientName'].first).to.include('John');
      expect(result.formData['view:recipientName'].last).to.include('Doe');
      expect(result.formData.emailAddress).to.include('john.doe@example.com');
      expect(result.formData.primaryPhone).to.equal('');
    });

    it('should handle missing both email and phone', () => {
      const state = {
        user: {
          profile: {
            userFullName: {
              first: 'John',
              last: 'Doe',
            },
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData['view:recipientName'].first).to.include('John');
      expect(result.formData['view:recipientName'].last).to.include('Doe');
      expect(result.formData.emailAddress).to.equal('');
      expect(result.formData.primaryPhone).to.equal('');
    });
  });

  describe('pages and metadata preservation', () => {
    it('should preserve pages parameter', () => {
      const testPages = [{ path: 'test' }];
      const state = {};

      const result = prefillTransformer(testPages, formData, metadata, state);

      expect(result.pages).to.exist;
      expect(result.pages.length).to.be.greaterThan(0);
    });

    it('should preserve metadata parameter', () => {
      const testMetadata = { test: 'value' };
      const state = {};

      const result = prefillTransformer(pages, formData, testMetadata, state);

      expect(result.metadata).to.exist;
      expect(result.metadata.test).to.include('value');
    });

    it('should return all three required properties', () => {
      const state = {};

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result).to.have.property('pages');
      expect(result).to.have.property('formData');
      expect(result).to.have.property('metadata');
    });
  });
});
