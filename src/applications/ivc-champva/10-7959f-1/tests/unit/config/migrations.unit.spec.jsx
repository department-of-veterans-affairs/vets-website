import { expect } from 'chai';
import migrations from '../../../config/migrations';

const EXAMPLE_SIP_METADATA = {
  version: 0,
  prefill: true,
  returnUrl: '/signer-type',
};

describe('10-7959F-1 migrations', () => {
  context('migration 0 -> 1: phone number to international format', () => {
    const migration = migrations[0];

    const runMigration = formData => {
      const result = migration({ formData, metadata: EXAMPLE_SIP_METADATA });
      expect(result.metadata).to.equal(EXAMPLE_SIP_METADATA);
      return result.formData;
    };

    it('should convert string phone number to international format object', () => {
      const result = runMigration({ veteranPhoneNumber: '5555555555' });
      expect(result.veteranPhoneNumber).to.deep.equal({
        callingCode: '',
        countryCode: '',
        contact: '5555555555',
      });
    });

    it('should preserve existing international format phone number object', () => {
      const result = runMigration({
        veteranPhoneNumber: {
          callingCode: '1',
          countryCode: 'US',
          contact: '5555555555',
        },
      });
      expect(result.veteranPhoneNumber).to.deep.equal({
        callingCode: '1',
        countryCode: 'US',
        contact: '5555555555',
      });
    });

    it('should handle missing "veteranPhoneNumber" field', () => {
      const result = runMigration({ otherField: 'value' });
      expect(result).to.deep.equal({ otherField: 'value' });
    });

    it('should handle empty formData', () => {
      const result = runMigration({});
      expect(result).to.deep.equal({});
    });

    it('should preserve other formData fields during migration', () => {
      const result = runMigration({
        veteranPhoneNumber: '5555555555',
        veteranFullName: { first: 'John', last: 'Doe' },
        veteranEmailAddress: 'test@example.com',
      });
      expect(result.veteranPhoneNumber).to.deep.equal({
        callingCode: '',
        countryCode: '',
        contact: '5555555555',
      });
      expect(result.veteranFullName).to.deep.equal({
        first: 'John',
        last: 'Doe',
      });
      expect(result.veteranEmailAddress).to.equal('test@example.com');
    });
  });
});
