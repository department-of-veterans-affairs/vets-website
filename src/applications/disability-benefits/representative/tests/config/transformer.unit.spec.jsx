import { expect } from 'chai';
import { buildForm526Payload, transform } from '../../config/transformer';

describe('Representative 526EZ Transformer', () => {
  describe('buildForm526Payload', () => {
    it('builds payload with all fields populated', () => {
      const formData = {
        fullName: {
          first: 'John',
          middle: 'Robert',
          last: 'Doe',
        },
        ssn: '123-45-6789',
        dateOfBirth: '1980-01-15',
        veteranIcn: 'test-icn-123',
        phoneAndEmail: {
          primaryPhone: '555-123-4567',
          emailAddress: 'john.doe@example.com',
        },
        mailingAddress: {
          country: 'USA',
          addressLine1: '123 Main St',
          addressLine2: 'Apt 4',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
        },
        newDisabilities: [
          { condition: 'Back pain' },
          { condition: 'Hearing loss' },
        ],
      };

      const payload = buildForm526Payload(formData);

      // Veteran section
      expect(payload.veteran.fullName.first).to.equal('John');
      expect(payload.veteran.fullName.middle).to.equal('Robert');
      expect(payload.veteran.fullName.last).to.equal('Doe');
      expect(payload.veteran.ssn).to.equal('123456789'); // Digits only
      expect(payload.veteran.dateOfBirth).to.equal('1980-01-15');
      expect(payload.veteran.icn).to.equal('test-icn-123');
      expect(payload.veteran.postalCode).to.equal('62701');

      // Form526 section
      const form526 = payload.form526.form526;
      expect(form526.isVaEmployee).to.be.false;
      expect(form526.standardClaim).to.be.false;
      expect(form526.phoneAndEmail.primaryPhone).to.equal('5551234567');
      expect(form526.phoneAndEmail.emailAddress).to.equal(
        'john.doe@example.com',
      );
      expect(form526.mailingAddress.country).to.equal('USA');
      expect(form526.mailingAddress.addressLine1).to.equal('123 Main St');
      expect(form526.mailingAddress.city).to.equal('Springfield');
      expect(form526.mailingAddress.state).to.equal('IL');
      expect(form526.mailingAddress.zipCode).to.equal('62701');

      // Disabilities
      expect(form526.disabilities).to.have.length(2);
      expect(form526.disabilities[0].name).to.equal('Back pain');
      expect(form526.disabilities[0].disabilityActionType).to.equal('NEW');
      expect(form526.disabilities[1].name).to.equal('Hearing loss');
    });

    it('builds payload with minimal required fields', () => {
      const formData = {
        fullName: {
          first: 'Jane',
          last: 'Smith',
        },
        veteranIcn: 'icn-minimal',
        phoneAndEmail: {
          emailAddress: 'jane@example.com',
        },
      };

      const payload = buildForm526Payload(formData);

      expect(payload.veteran.fullName.first).to.equal('Jane');
      expect(payload.veteran.fullName.last).to.equal('Smith');
      expect(payload.veteran.icn).to.equal('icn-minimal');
      expect(payload.form526.form526.phoneAndEmail.emailAddress).to.equal(
        'jane@example.com',
      );
    });

    it('handles missing optional fields gracefully', () => {
      const formData = {
        fullName: {
          first: 'Test',
          last: 'User',
        },
      };

      const payload = buildForm526Payload(formData);

      expect(payload.veteran.fullName.first).to.equal('Test');
      expect(payload.veteran.fullName.last).to.equal('User');
      expect(payload.veteran.middle).to.be.undefined;
      expect(payload.veteran.icn).to.be.undefined;
    });

    it('sanitizes SSN by removing non-digits', () => {
      const formData = {
        fullName: { first: 'Test', last: 'User' },
        ssn: '123-45-6789',
      };

      const payload = buildForm526Payload(formData);
      expect(payload.veteran.ssn).to.equal('123456789');
    });

    it('sanitizes phone number by removing non-digits', () => {
      const formData = {
        fullName: { first: 'Test', last: 'User' },
        phoneAndEmail: {
          primaryPhone: '(555) 123-4567',
        },
      };

      const payload = buildForm526Payload(formData);
      expect(payload.form526.form526.phoneAndEmail.primaryPhone).to.equal(
        '5551234567',
      );
    });

    it('trims whitespace from string values', () => {
      const formData = {
        fullName: {
          first: '  John  ',
          last: '  Doe  ',
        },
        phoneAndEmail: {
          emailAddress: '  test@example.com  ',
        },
      };

      const payload = buildForm526Payload(formData);

      expect(payload.veteran.fullName.first).to.equal('John');
      expect(payload.veteran.fullName.last).to.equal('Doe');
      expect(payload.form526.form526.phoneAndEmail.emailAddress).to.equal(
        'test@example.com',
      );
    });

    it('filters out empty conditions from disabilities', () => {
      const formData = {
        fullName: { first: 'Test', last: 'User' },
        newDisabilities: [
          { condition: 'Valid condition' },
          { condition: '' },
          { condition: '   ' },
          null,
          { condition: 'Another valid' },
        ],
      };

      const payload = buildForm526Payload(formData);

      expect(payload.form526.form526.disabilities).to.have.length(2);
      expect(payload.form526.form526.disabilities[0].name).to.equal(
        'Valid condition',
      );
      expect(payload.form526.form526.disabilities[1].name).to.equal(
        'Another valid',
      );
    });

    it('returns undefined fullName when first or last name is missing', () => {
      const formDataNoFirst = {
        fullName: { last: 'User' },
      };

      const formDataNoLast = {
        fullName: { first: 'Test' },
      };

      const payloadNoFirst = buildForm526Payload(formDataNoFirst);
      const payloadNoLast = buildForm526Payload(formDataNoLast);

      expect(payloadNoFirst.veteran).to.be.undefined;
      expect(payloadNoLast.veteran).to.be.undefined;
    });

    it('handles empty formData', () => {
      const payload = buildForm526Payload({});
      // Base form526 structure is always included with required defaults
      expect(payload.form526.form526.isVaEmployee).to.be.false;
      expect(payload.form526.form526.standardClaim).to.be.false;
      expect(payload.veteran).to.be.undefined;
    });

    it('handles null formData', () => {
      const payload = buildForm526Payload(null);
      // Base form526 structure is always included with required defaults
      expect(payload.form526.form526.isVaEmployee).to.be.false;
      expect(payload.form526.form526.standardClaim).to.be.false;
      expect(payload.veteran).to.be.undefined;
    });
  });

  describe('transform', () => {
    it('returns JSON stringified payload', () => {
      const form = {
        data: {
          fullName: { first: 'Test', last: 'User' },
          veteranIcn: 'test-icn',
          phoneAndEmail: { emailAddress: 'test@test.com' },
        },
      };

      const result = transform({}, form);
      const parsed = JSON.parse(result);

      expect(parsed.veteran.fullName.first).to.equal('Test');
      expect(parsed.veteran.icn).to.equal('test-icn');
    });
  });
});
