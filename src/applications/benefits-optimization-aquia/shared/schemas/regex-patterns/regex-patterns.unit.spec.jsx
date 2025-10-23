import { expect } from 'chai';
import {
  CHAR_PATTERNS,
  CONTACT_PATTERNS,
  DATE_PATTERNS,
  ID_PATTERNS,
  MILITARY_POSTAL_PATTERNS,
  NAME_PATTERNS,
  POSTAL_PATTERNS,
  VALIDATION_MESSAGES,
} from './regex-patterns';

describe('Regex Patterns - Validation patterns', () => {
  describe('NAME_PATTERNS', () => {
    it('validates names with special characters', () => {
      const validNames = [
        'John',
        'Mary-Jane',
        "O'Connor",
        'Jean Paul',
        'De La Cruz',
      ];

      validNames.forEach(name => {
        expect(NAME_PATTERNS.STANDARD.test(name)).to.be.true;
      });

      const invalidNames = ['John123', 'Mary@Jane', 'Test!Name'];

      invalidNames.forEach(name => {
        expect(NAME_PATTERNS.STANDARD.test(name)).to.be.false;
      });
    });

    it('validates name suffixes', () => {
      const validSuffixes = ['Jr.', 'Sr.', 'III', 'IV', ''];

      validSuffixes.forEach(suffix => {
        expect(NAME_PATTERNS.SUFFIX.test(suffix)).to.be.true;
      });

      const invalidSuffixes = ['Jr@', '123'];

      invalidSuffixes.forEach(suffix => {
        expect(NAME_PATTERNS.SUFFIX.test(suffix)).to.be.false;
      });
    });

    it('requires alphabetic first character', () => {
      const validNames = ['John', 'Mary-Jane', "O'Connor"];

      validNames.forEach(name => {
        expect(NAME_PATTERNS.WITH_FIRST_LETTER.test(name)).to.be.true;
      });

      const invalidNames = [' John', '-John', "'John"];

      invalidNames.forEach(name => {
        expect(NAME_PATTERNS.WITH_FIRST_LETTER.test(name)).to.be.false;
      });
    });
  });

  describe('CONTACT_PATTERNS', () => {
    it('validates 10-digit phone numbers', () => {
      const validPhones = ['1234567890', '5551234567'];

      validPhones.forEach(phone => {
        expect(CONTACT_PATTERNS.PHONE_US.test(phone)).to.be.true;
      });

      const invalidPhones = ['123456789', '12345678901', 'abc1234567'];

      invalidPhones.forEach(phone => {
        expect(CONTACT_PATTERNS.PHONE_US.test(phone)).to.be.false;
      });
    });

    it('validates basic email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'first+last@test.org',
      ];

      validEmails.forEach(email => {
        expect(CONTACT_PATTERNS.EMAIL_BASIC.test(email)).to.be.true;
      });

      const invalidEmails = ['invalid.email', '@domain.com', 'user@', 'user'];

      invalidEmails.forEach(email => {
        expect(CONTACT_PATTERNS.EMAIL_BASIC.test(email)).to.be.false;
      });
    });

    it('validates complete email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'first+last@test.org',
      ];

      validEmails.forEach(email => {
        expect(CONTACT_PATTERNS.EMAIL_FULL.test(email)).to.be.true;
      });

      const invalidEmails = [
        'invalid.email',
        '@domain.com',
        'user@',
        'user space@domain.com',
      ];

      invalidEmails.forEach(email => {
        expect(CONTACT_PATTERNS.EMAIL_FULL.test(email)).to.be.false;
      });
    });

    it('validates ZIP and ZIP+4 codes', () => {
      const validZips = ['12345', '12345-6789'];

      validZips.forEach(zip => {
        expect(CONTACT_PATTERNS.ZIP_CODE.test(zip)).to.be.true;
      });

      const invalidZips = ['1234', '123456', '12345-678', 'ABCDE'];

      invalidZips.forEach(zip => {
        expect(CONTACT_PATTERNS.ZIP_CODE.test(zip)).to.be.false;
      });
    });
  });

  describe('DATE_PATTERNS', () => {
    it('validates ISO date format', () => {
      const validDates = ['2024-01-01', '2023-12-31', '2022-06-15'];

      validDates.forEach(date => {
        expect(DATE_PATTERNS.ISO.test(date)).to.be.true;
        expect(DATE_PATTERNS.ISO_DATE.test(date)).to.be.true; // Test alias
      });

      const invalidDates = [
        '01-01-2024',
        '2024/01/01',
        '2024-1-1',
        '2024-001-01',
      ];

      invalidDates.forEach(date => {
        expect(DATE_PATTERNS.ISO.test(date)).to.be.false;
      });
    });
  });

  describe('ID_PATTERNS', () => {
    it('validates 9-digit SSN', () => {
      const validSSNs = ['123456789', '987654321'];

      validSSNs.forEach(ssn => {
        expect(ID_PATTERNS.SSN.test(ssn)).to.be.true;
      });

      const invalidSSNs = ['12345678', '1234567890', '12345678a'];

      invalidSSNs.forEach(ssn => {
        expect(ID_PATTERNS.SSN.test(ssn)).to.be.false;
      });
    });

    it('validates VA file numbers', () => {
      const validVANumbers = ['12345678', '123456789'];

      validVANumbers.forEach(num => {
        expect(ID_PATTERNS.VA_FILE_NUMBER.test(num)).to.be.true;
      });

      const invalidVANumbers = ['1234567', '1234567890', 'abcdefgh'];

      invalidVANumbers.forEach(num => {
        expect(ID_PATTERNS.VA_FILE_NUMBER.test(num)).to.be.false;
      });
    });
  });

  describe('POSTAL_PATTERNS', () => {
    it('validates US postal codes', () => {
      const validPostalCodes = ['12345', '12345-6789'];

      validPostalCodes.forEach(code => {
        expect(POSTAL_PATTERNS.USA.test(code)).to.be.true;
      });

      const invalidPostalCodes = ['1234', '123456', 'ABCDE'];

      invalidPostalCodes.forEach(code => {
        expect(POSTAL_PATTERNS.USA.test(code)).to.be.false;
      });
    });

    it('validates Canadian postal codes', () => {
      const validCanadianCodes = ['K1A 0B1', 'M5H 2N2', 'K1A0B1', 'k1a 0b1'];

      validCanadianCodes.forEach(code => {
        expect(POSTAL_PATTERNS.CANADA.test(code)).to.be.true;
      });

      // Note: The pattern accepts any letter, including Z, as it uses [A-Za-z]
      const invalidCanadianCodes = ['K1A 0B', '12345', 'K1 0B1'];

      invalidCanadianCodes.forEach(code => {
        expect(POSTAL_PATTERNS.CANADA.test(code)).to.be.false;
      });
    });

    it('validates Mexican postal codes', () => {
      const validMexicanCodes = ['12345', '00000', '99999'];

      validMexicanCodes.forEach(code => {
        expect(POSTAL_PATTERNS.MEXICO.test(code)).to.be.true;
      });

      const invalidMexicanCodes = ['1234', '123456', 'ABCDE'];

      invalidMexicanCodes.forEach(code => {
        expect(POSTAL_PATTERNS.MEXICO.test(code)).to.be.false;
      });
    });
  });

  describe('MILITARY_POSTAL_PATTERNS', () => {
    it('validates AA military ZIPs', () => {
      const validAAZips = ['34001', '34099', '34050'];

      validAAZips.forEach(zip => {
        expect(MILITARY_POSTAL_PATTERNS.AA.test(zip)).to.be.true;
      });

      const invalidAAZips = ['33999', '35000', '12345'];

      invalidAAZips.forEach(zip => {
        expect(MILITARY_POSTAL_PATTERNS.AA.test(zip)).to.be.false;
      });
    });

    it('validates AE military ZIPs', () => {
      const validAEZips = ['09001', '09999', '09500'];

      validAEZips.forEach(zip => {
        expect(MILITARY_POSTAL_PATTERNS.AE.test(zip)).to.be.true;
      });

      const invalidAEZips = ['08999', '10000', '12345'];

      invalidAEZips.forEach(zip => {
        expect(MILITARY_POSTAL_PATTERNS.AE.test(zip)).to.be.false;
      });
    });

    it('validates AP military ZIPs', () => {
      const validAPZips = ['96201', '96399', '96501', '96601'];

      validAPZips.forEach(zip => {
        expect(MILITARY_POSTAL_PATTERNS.AP.test(zip)).to.be.true;
      });

      const invalidAPZips = ['96199', '96700', '97000'];

      invalidAPZips.forEach(zip => {
        expect(MILITARY_POSTAL_PATTERNS.AP.test(zip)).to.be.false;
      });
    });
  });

  describe('CHAR_PATTERNS', () => {
    it('detects alphabetic characters', () => {
      expect(CHAR_PATTERNS.HAS_LETTERS.test('abc123')).to.be.true;
      expect(CHAR_PATTERNS.HAS_LETTERS.test('ABC')).to.be.true;
      expect(CHAR_PATTERNS.HAS_LETTERS.test('123')).to.be.false;
      expect(CHAR_PATTERNS.HAS_LETTERS.test('!@#')).to.be.false;
    });

    it('detects invalid phone characters', () => {
      // Valid phone characters
      expect(CHAR_PATTERNS.INVALID_PHONE_CHARS.test('123-456')).to.be.false;
      expect(CHAR_PATTERNS.INVALID_PHONE_CHARS.test('(123) 456')).to.be.false;
      expect(CHAR_PATTERNS.INVALID_PHONE_CHARS.test('123 456')).to.be.false;

      // Invalid phone characters
      expect(CHAR_PATTERNS.INVALID_PHONE_CHARS.test('123abc')).to.be.true;
      expect(CHAR_PATTERNS.INVALID_PHONE_CHARS.test('123@456')).to.be.true;
      expect(CHAR_PATTERNS.INVALID_PHONE_CHARS.test('123.456')).to.be.true;
    });
  });

  describe('VALIDATION_MESSAGES', () => {
    it('provides user-friendly messages', () => {
      expect(VALIDATION_MESSAGES.NAME_INVALID).to.include('letters');
      expect(VALIDATION_MESSAGES.SSN_FORMAT).to.include('9');
      expect(VALIDATION_MESSAGES.PHONE_FORMAT).to.include('10');
      expect(VALIDATION_MESSAGES.EMAIL_FORMAT).to.include('email');
      expect(VALIDATION_MESSAGES.ZIP_USA).to.include('12345');
      expect(VALIDATION_MESSAGES.DATE_FORMAT).to.include('YYYY-MM-DD');
    });

    it('covers all pattern types', () => {
      // Name messages
      expect(VALIDATION_MESSAGES).to.have.property('NAME_INVALID');
      expect(VALIDATION_MESSAGES).to.have.property('NAME_INVALID_FIRST');
      expect(VALIDATION_MESSAGES).to.have.property('NAME_INVALID_MIDDLE');
      expect(VALIDATION_MESSAGES).to.have.property('NAME_INVALID_LAST');

      // ID messages
      expect(VALIDATION_MESSAGES).to.have.property('SSN_FORMAT');
      expect(VALIDATION_MESSAGES).to.have.property('VA_FILE_FORMAT');

      // Contact messages
      expect(VALIDATION_MESSAGES).to.have.property('PHONE_FORMAT');
      expect(VALIDATION_MESSAGES).to.have.property('EMAIL_FORMAT');

      // Postal messages
      expect(VALIDATION_MESSAGES).to.have.property('ZIP_USA');
      expect(VALIDATION_MESSAGES).to.have.property('POSTAL_CANADA');
      expect(VALIDATION_MESSAGES).to.have.property('POSTAL_MEXICO');

      // Military postal messages
      expect(VALIDATION_MESSAGES).to.have.property('ZIP_MILITARY_AA');
      expect(VALIDATION_MESSAGES).to.have.property('ZIP_MILITARY_AE');
      expect(VALIDATION_MESSAGES).to.have.property('ZIP_MILITARY_AP');

      // Date messages
      expect(VALIDATION_MESSAGES).to.have.property('DATE_FORMAT');
    });
  });
});
