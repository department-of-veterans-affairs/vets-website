import { expect } from 'chai';

import redactPii from '../data/redactPii';

describe('redactPii', () => {
  describe('string redaction', () => {
    it('should redact email addresses', () => {
      const input = 'Contact me at john@example.com for details';
      const result = redactPii(input);
      expect(result).to.equal('Contact me at [REDACTED - email] for details');
    });

    it('should redact multiple email addresses', () => {
      const input = 'Email admin@test.com or support@example.org';
      const result = redactPii(input);
      expect(result).to.equal('Email [REDACTED - email] or [REDACTED - email]');
    });

    it('should redact SSNs', () => {
      const input = 'My SSN is 123-45-6789';
      const result = redactPii(input);
      expect(result).to.equal('My SSN is [REDACTED - ssn]');
    });

    it('should redact SSNs without dashes', () => {
      const input = 'SSN: 123456789';
      const result = redactPii(input);
      expect(result).to.equal('SSN: [REDACTED - ssn]');
    });

    it('should redact phone numbers', () => {
      const input = 'Call 555-123-4567 for help';
      const result = redactPii(input);
      expect(result).to.equal('Call [REDACTED - phone] for help');
    });

    it('should redact phone numbers with parentheses', () => {
      const input = 'Phone: (555) 123-4567';
      const result = redactPii(input);
      expect(result).to.equal('Phone: [REDACTED - phone]');
    });

    it('should redact phone numbers with dots', () => {
      const input = 'Contact 555.123.4567';
      const result = redactPii(input);
      expect(result).to.equal('Contact [REDACTED - phone]');
    });

    it('should redact phone numbers with country code', () => {
      const input = 'Call +1 555-123-4567';
      const result = redactPii(input);
      expect(result).to.equal('Call [REDACTED - phone]');
    });

    it('should redact zip codes', () => {
      const input = 'Located in 12345';
      const result = redactPii(input);
      expect(result).to.equal('Located in [REDACTED - zip]');
    });

    it('should redact ZIP+4 codes', () => {
      const input = 'ZIP: 12345-6789';
      const result = redactPii(input);
      expect(result).to.equal('ZIP: [REDACTED - zip]');
    });

    it('should redact street addresses', () => {
      const input = 'Address: 123 Main Street';
      const result = redactPii(input);
      expect(result).to.equal('Address: [REDACTED - address]');
    });

    it('should redact abbreviated street addresses', () => {
      const input = '123 Oak Ave.';
      const result = redactPii(input);
      expect(result).to.equal('[REDACTED - address].');
    });

    it('should redact multiple PII types in one string', () => {
      const input =
        'Contact john@example.com at 123 Main St or call 555-123-4567';
      const result = redactPii(input);
      expect(result).to.include('[REDACTED - email]');
      expect(result).to.include('[REDACTED - address]');
      expect(result).to.include('[REDACTED - phone]');
    });

    it('should not modify strings without PII', () => {
      const input = 'This is a normal string without any sensitive data';
      const result = redactPii(input);
      expect(result).to.equal(input);
    });

    it('should handle empty strings', () => {
      const input = '';
      const result = redactPii(input);
      expect(result).to.equal('');
    });
  });

  describe('object redaction', () => {
    it('should redact PII in object values', () => {
      const input = {
        query: 'john@example.com',
        page: 1,
      };
      const result = redactPii(input);
      expect(result).to.eql({
        query: '[REDACTED - email]',
        page: 1,
      });
    });

    it('should not mutate the original object', () => {
      const input = {
        query: 'john@example.com',
        page: 1,
      };
      const original = { ...input };
      const result = redactPii(input);
      expect(input).to.eql(original);
      expect(result).to.not.equal(input);
    });

    it('should redact PII in nested objects', () => {
      const input = {
        search: {
          query: '123-45-6789',
          filters: ['email@test.com'],
        },
      };
      const result = redactPii(input);
      expect(result).to.eql({
        search: {
          query: '[REDACTED - ssn]',
          filters: ['[REDACTED - email]'],
        },
      });
    });

    it('should redact PII in deeply nested objects', () => {
      const input = {
        level1: {
          level2: {
            level3: {
              data: '555-123-4567',
            },
          },
        },
      };
      const result = redactPii(input);
      expect(result).to.eql({
        level1: {
          level2: {
            level3: {
              data: '[REDACTED - phone]',
            },
          },
        },
      });
    });

    it('should preserve non-string values in objects', () => {
      const input = {
        query: 'test@example.com',
        count: 42,
        active: true,
        nested: null,
      };
      const result = redactPii(input);
      expect(result.query).to.equal('[REDACTED - email]');
      expect(result.count).to.equal(42);
      expect(result.active).to.equal(true);
      expect(result.nested).to.equal(null);
    });

    it('should handle objects with mixed PII types', () => {
      const input = {
        email: 'user@example.com',
        phone: '555-123-4567',
        ssn: '123-45-6789',
        zip: '12345',
        address: '123 Main Street',
      };
      const result = redactPii(input);
      expect(result.email).to.equal('[REDACTED - email]');
      expect(result.phone).to.equal('[REDACTED - phone]');
      expect(result.ssn).to.equal('[REDACTED - ssn]');
      expect(result.zip).to.equal('[REDACTED - zip]');
      expect(result.address).to.equal('[REDACTED - address]');
    });
  });

  describe('array redaction', () => {
    it('should redact PII in array elements', () => {
      const input = ['test@example.com', '555-123-4567', '12345'];
      const result = redactPii(input);
      expect(result).to.eql([
        '[REDACTED - email]',
        '[REDACTED - phone]',
        '[REDACTED - zip]',
      ]);
    });

    it('should not mutate the original array', () => {
      const input = ['test@example.com'];
      const original = [...input];
      redactPii(input);
      expect(input).to.eql(original);
    });

    it('should redact PII in nested arrays', () => {
      const input = [
        ['email1@test.com', 'email2@test.com'],
        ['555-111-1111', '555-222-2222'],
      ];
      const result = redactPii(input);
      expect(result).to.eql([
        ['[REDACTED - email]', '[REDACTED - email]'],
        ['[REDACTED - phone]', '[REDACTED - phone]'],
      ]);
    });

    it('should handle arrays with mixed types', () => {
      const input = ['test@example.com', 123, true, null];
      const result = redactPii(input);
      expect(result).to.eql(['[REDACTED - email]', 123, true, null]);
    });

    it('should redact PII in objects within arrays', () => {
      const input = [{ query: 'john@example.com' }, { query: '555-123-4567' }];
      const result = redactPii(input);
      expect(result).to.eql([
        { query: '[REDACTED - email]' },
        { query: '[REDACTED - phone]' },
      ]);
    });
  });

  describe('edge cases', () => {
    it('should handle null', () => {
      const result = redactPii(null);
      expect(result).to.equal(null);
    });

    it('should handle undefined', () => {
      const result = redactPii(undefined);
      expect(result).to.equal(undefined);
    });

    it('should handle numbers', () => {
      const result = redactPii(12345);
      expect(result).to.equal(12345);
    });

    it('should handle booleans', () => {
      expect(redactPii(true)).to.equal(true);
      expect(redactPii(false)).to.equal(false);
    });

    it('should handle empty objects', () => {
      const input = {};
      const result = redactPii(input);
      expect(result).to.eql({});
      expect(result).to.not.equal(input);
    });

    it('should handle empty arrays', () => {
      const input = [];
      const result = redactPii(input);
      expect(result).to.eql([]);
      expect(result).to.not.equal(input);
    });

    it('should handle strings that look like PII but are not valid', () => {
      const input = '000-00-0000'; // Invalid SSN pattern
      const result = redactPii(input);
      // Should not redact invalid SSN patterns
      expect(result).to.equal(input);
    });

    it('should handle strings with partial matches', () => {
      const input = 'My phone extension is 1234';
      const result = redactPii(input);
      // Should not redact 4-digit numbers that aren't part of a phone pattern
      expect(result).to.equal(input);
    });
  });

  describe('custom placeholder', () => {
    it('should use custom placeholder when provided', () => {
      const input = 'test@example.com';
      const result = redactPii(input, 'XXX');
      expect(result).to.equal('XXX - email');
    });

    it('should use custom placeholder for all PII types', () => {
      const input = {
        email: 'test@example.com',
        phone: '555-123-4567',
      };
      const result = redactPii(input, 'XXX');
      expect(result.email).to.equal('XXX - email');
      expect(result.phone).to.equal('XXX - phone');
    });
  });

  describe('complex nested structures', () => {
    it('should redact PII in complex nested structures', () => {
      const input = {
        user: {
          contact: {
            email: 'user@example.com',
            phone: '555-123-4567',
          },
          address: {
            street: '123 Main Street',
            zip: '12345',
          },
        },
        metadata: {
          ssn: '123-45-6789',
          tags: ['important', 'user@test.com'],
        },
      };
      const result = redactPii(input);
      expect(result.user.contact.email).to.equal('[REDACTED - email]');
      expect(result.user.contact.phone).to.equal('[REDACTED - phone]');
      expect(result.user.address.street).to.equal('[REDACTED - address]');
      expect(result.user.address.zip).to.equal('[REDACTED - zip]');
      expect(result.metadata.ssn).to.equal('[REDACTED - ssn]');
      expect(result.metadata.tags[1]).to.equal('[REDACTED - email]');
    });

    it('should maintain object structure while redacting', () => {
      const input = {
        a: {
          b: {
            c: 'test@example.com',
            d: 42,
          },
          e: [1, 2, 3],
        },
        f: 'normal string',
      };
      const result = redactPii(input);
      expect(result.a.b.c).to.equal('[REDACTED - email]');
      expect(result.a.b.d).to.equal(42);
      expect(result.a.e).to.eql([1, 2, 3]);
      expect(result.f).to.equal('normal string');
    });
  });

  describe('PII pattern priority', () => {
    it('should handle overlapping patterns correctly', () => {
      // SSN pattern should be checked before phone pattern
      const input = '123-45-6789';
      const result = redactPii(input);
      expect(result).to.equal('[REDACTED - ssn]');
    });

    it('should redact address before other patterns', () => {
      const input = '123 Main St, call 555-123-4567';
      const result = redactPii(input);
      expect(result).to.include('[REDACTED - address]');
      expect(result).to.include('[REDACTED - phone]');
    });
  });
});
