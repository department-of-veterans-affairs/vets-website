import { expect } from 'chai';
import {
  normalizeBranchOfService,
  normalizeCharacterOfService,
  normalizeSeparationType,
  normalizePayGrade,
  normalizeSeparationCode,
  normalizeFreeText,
  normalizeSections,
} from '../../../../cave/transformers/normalize';

describe('cave/transformers/normalize', () => {
  // ---------------------------------------------------------------------------
  // normalizeBranchOfService
  // ---------------------------------------------------------------------------
  describe('normalizeBranchOfService', () => {
    it('returns null for null', () => {
      expect(normalizeBranchOfService(null)).to.be.null;
    });

    it('returns empty string for blank string', () => {
      expect(normalizeBranchOfService('')).to.equal('');
      expect(normalizeBranchOfService('   ')).to.equal('');
    });

    it('maps "Army" to "army"', () => {
      expect(normalizeBranchOfService('Army')).to.equal('army');
    });

    it('maps "Navy" to "navy"', () => {
      expect(normalizeBranchOfService('Navy')).to.equal('navy');
    });

    it('maps "Air Force" to "airForce"', () => {
      expect(normalizeBranchOfService('Air Force')).to.equal('airForce');
    });

    it('maps "Coast Guard" to "coastGuard"', () => {
      expect(normalizeBranchOfService('Coast Guard')).to.equal('coastGuard');
    });

    it('maps "Marine Corps" to "marineCorps"', () => {
      expect(normalizeBranchOfService('Marine Corps')).to.equal('marineCorps');
    });

    it('maps "Space Force" to "spaceForce"', () => {
      expect(normalizeBranchOfService('Space Force')).to.equal('spaceForce');
    });

    it('maps "USPHS" to "usphs"', () => {
      expect(normalizeBranchOfService('USPHS')).to.equal('usphs');
    });

    it('maps "NOAA" to "noaa"', () => {
      expect(normalizeBranchOfService('NOAA')).to.equal('noaa');
    });

    it('is case-insensitive', () => {
      expect(normalizeBranchOfService('army')).to.equal('army');
      expect(normalizeBranchOfService('ARMY')).to.equal('army');
      expect(normalizeBranchOfService('air force')).to.equal('airForce');
    });

    it('trims whitespace before lookup', () => {
      expect(normalizeBranchOfService('  Army  ')).to.equal('army');
    });

    it('returns null for an unrecognized branch', () => {
      expect(normalizeBranchOfService('Starfleet')).to.be.null;
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeCharacterOfService
  // ---------------------------------------------------------------------------
  describe('normalizeCharacterOfService', () => {
    it('returns null for null', () => {
      expect(normalizeCharacterOfService(null)).to.be.null;
    });

    it('returns empty string for blank input', () => {
      expect(normalizeCharacterOfService('')).to.equal('');
      expect(normalizeCharacterOfService('   ')).to.equal('');
    });

    it('maps full-form value (case-insensitive)', () => {
      expect(normalizeCharacterOfService('Honorable')).to.equal('Honorable');
      expect(normalizeCharacterOfService('honorable')).to.equal('Honorable');
    });

    it('maps abbreviation "OTH" to full form', () => {
      expect(normalizeCharacterOfService('OTH')).to.equal(
        'Other Than Honorable',
      );
    });

    it('maps abbreviation "BCD" to full form', () => {
      expect(normalizeCharacterOfService('BCD')).to.equal(
        'Bad Conduct Discharge',
      );
    });

    it('maps abbreviation case-insensitively', () => {
      expect(normalizeCharacterOfService('oth')).to.equal(
        'Other Than Honorable',
      );
    });

    it('returns null for unrecognized value', () => {
      expect(normalizeCharacterOfService('Excellent')).to.be.null;
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeSeparationType
  // ---------------------------------------------------------------------------
  describe('normalizeSeparationType', () => {
    it('returns null for null', () => {
      expect(normalizeSeparationType(null)).to.be.null;
    });

    it('returns empty string for blank input', () => {
      expect(normalizeSeparationType('')).to.equal('');
    });

    it('maps full-form "Discharge" (case-insensitive)', () => {
      expect(normalizeSeparationType('Discharge')).to.equal('Discharge');
      expect(normalizeSeparationType('discharge')).to.equal('Discharge');
    });

    it('maps abbreviation "REFRAD" to full form', () => {
      expect(normalizeSeparationType('REFRAD')).to.equal(
        'Release from Active Duty',
      );
    });

    it('maps abbreviation "IADT" to full form', () => {
      expect(normalizeSeparationType('IADT')).to.equal(
        'Release from Initial Duty for Training',
      );
    });

    it('returns null for unrecognized value', () => {
      expect(normalizeSeparationType('Unknown')).to.be.null;
    });
  });

  // ---------------------------------------------------------------------------
  // normalizePayGrade
  // ---------------------------------------------------------------------------
  describe('normalizePayGrade', () => {
    it('returns null for null', () => {
      expect(normalizePayGrade(null)).to.be.null;
    });

    it('returns empty string for blank input', () => {
      expect(normalizePayGrade('')).to.equal('');
    });

    it('maps hyphenated canonical form "E-4" through itself', () => {
      expect(normalizePayGrade('E-4')).to.equal('E-4');
    });

    it('maps abbreviation "E4" to "E-4"', () => {
      expect(normalizePayGrade('E4')).to.equal('E-4');
    });

    it('maps abbreviation "O2" to "O-2"', () => {
      expect(normalizePayGrade('O2')).to.equal('O-2');
    });

    it('maps abbreviation "W3" to "W-3"', () => {
      expect(normalizePayGrade('W3')).to.equal('W-3');
    });

    it('is case-insensitive', () => {
      expect(normalizePayGrade('e4')).to.equal('E-4');
      expect(normalizePayGrade('o-2')).to.equal('O-2');
    });

    it('returns null for unrecognized value', () => {
      expect(normalizePayGrade('X9')).to.be.null;
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeSeparationCode
  // ---------------------------------------------------------------------------
  describe('normalizeSeparationCode', () => {
    it('returns null for null', () => {
      expect(normalizeSeparationCode(null)).to.be.null;
    });

    it('returns empty string for blank input', () => {
      expect(normalizeSeparationCode('')).to.equal('');
    });

    it('returns the code for a valid separation code', () => {
      expect(normalizeSeparationCode('MBK')).to.equal('MBK');
    });

    it('returns the code for another valid code', () => {
      expect(normalizeSeparationCode('JHJ')).to.equal('JHJ');
    });

    it('trims whitespace', () => {
      expect(normalizeSeparationCode('  MBK  ')).to.equal('MBK');
    });

    it('returns null for an unrecognized code', () => {
      expect(normalizeSeparationCode('ZZZ')).to.be.null;
    });

    it('returns null for a code in wrong case', () => {
      // Codes are stored uppercase; lowercase should not match
      expect(normalizeSeparationCode('mbk')).to.be.null;
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeFreeText
  // ---------------------------------------------------------------------------
  describe('normalizeFreeText', () => {
    it('returns null for null', () => {
      expect(normalizeFreeText(null)).to.be.null;
    });

    it('returns null for non-string', () => {
      expect(normalizeFreeText(42)).to.be.null;
    });

    it('returns empty string for blank string', () => {
      expect(normalizeFreeText('')).to.equal('');
      expect(normalizeFreeText('   ')).to.equal('');
    });

    it('trims and returns the value', () => {
      expect(normalizeFreeText('  hello world  ')).to.equal('hello world');
    });

    it('returns the value when under max', () => {
      expect(normalizeFreeText('hello', 10)).to.equal('hello');
    });

    it('returns the value when exactly at max', () => {
      expect(normalizeFreeText('hello', 5)).to.equal('hello');
    });

    it('returns null when trimmed value exceeds max', () => {
      expect(normalizeFreeText('hello world', 5)).to.be.null;
    });

    it('returns value when no max is provided', () => {
      expect(normalizeFreeText('a'.repeat(10000))).to.equal('a'.repeat(10000));
    });
  });

  // ---------------------------------------------------------------------------
  // normalizeSections (integration: full pipeline)
  // ---------------------------------------------------------------------------
  describe('normalizeSections', () => {
    it('returns empty arrays for empty input', () => {
      const result = normalizeSections();
      expect(result.dd214).to.deep.equal([]);
      expect(result.deathCertificates).to.deep.equal([]);
    });

    it('normalizes a DD-214 entry end-to-end', () => {
      const raw = {
        VETERAN_NAME: 'John Q Smith',
        VETERAN_SSN: '123-45-6789',
        VETERAN_DOB: '03/15/1950',
        BRANCH_OF_SERVICE: 'Army',
        PAY_GRADE: 'E4',
        DATE_ENTERED_ACTIVE_SERVICE: '02/15/1970',
        DATE_SEPARATED_FROM_SERVICE: '02/14/1974',
        SEPARATION_CODE: 'MBK',
      };
      const { dd214 } = normalizeSections({ dd214: [raw] });
      expect(dd214).to.have.length(1);
      const entry = dd214[0];
      expect(entry.VETERAN_NAME).to.deep.equal({
        first: 'John',
        middle: 'Q',
        last: 'Smith',
        suffix: '',
      });
      expect(entry.VETERAN_SSN).to.equal('123456789');
      expect(entry.VETERAN_DOB).to.equal('1950-03-15');
      expect(entry.BRANCH_OF_SERVICE).to.equal('army');
      expect(entry.PAY_GRADE).to.equal('E-4');
      expect(entry.DATE_ENTERED_ACTIVE_SERVICE).to.equal('1970-02-15');
      expect(entry.DATE_SEPARATED_FROM_SERVICE).to.equal('1974-02-14');
      expect(entry.SEPARATION_CODE).to.equal('MBK');
    });

    it('normalizes a death certificate entry end-to-end', () => {
      const raw = {
        DECENDENT_FULL_NAME: 'Pat A Veteran',
        DECENDENT_SSN: '987654321',
        DECENDENT_DATE_OF_DEATH: '03/01/2020',
        DECENDENT_DATE_OF_DISPOSITION: '03/10/2020',
        CAUSE_OF_DEATH: 'Natural causes',
      };
      const { deathCertificates } = normalizeSections({
        deathCertificates: [raw],
      });
      expect(deathCertificates).to.have.length(1);
      const entry = deathCertificates[0];
      expect(entry.DECENDENT_FULL_NAME).to.deep.equal({
        first: 'Pat',
        middle: 'A',
        last: 'Veteran',
        suffix: '',
      });
      expect(entry.DECENDENT_SSN).to.equal('987654321');
      expect(entry.DECENDENT_DATE_OF_DEATH).to.equal('2020-03-01');
      expect(entry.DECENDENT_DATE_OF_DISPOSITION).to.equal('2020-03-10');
      expect(entry.CAUSE_OF_DEATH).to.equal('Natural causes');
    });

    it('sets null for unrecognized branch of service', () => {
      const raw = { BRANCH_OF_SERVICE: 'Starfleet' };
      const { dd214 } = normalizeSections({ dd214: [raw] });
      expect(dd214[0].BRANCH_OF_SERVICE).to.be.null;
    });

    it('sets null for an invalid SSN', () => {
      const raw = { VETERAN_SSN: '12345' };
      const { dd214 } = normalizeSections({ dd214: [raw] });
      expect(dd214[0].VETERAN_SSN).to.be.null;
    });

    it('sets null for an unparseable date', () => {
      const raw = { VETERAN_DOB: 'not-a-date' };
      const { dd214 } = normalizeSections({ dd214: [raw] });
      expect(dd214[0].VETERAN_DOB).to.be.null;
    });

    it('sets null for a name that is null', () => {
      const raw = { VETERAN_NAME: null };
      const { dd214 } = normalizeSections({ dd214: [raw] });
      expect(dd214[0].VETERAN_NAME).to.be.null;
    });

    it('handles multiple entries in both arrays', () => {
      const result = normalizeSections({
        dd214: [{ VETERAN_NAME: 'John Smith' }, { VETERAN_NAME: 'Jane Doe' }],
        deathCertificates: [{ DECENDENT_FULL_NAME: 'Pat Veteran' }],
      });
      expect(result.dd214).to.have.length(2);
      expect(result.deathCertificates).to.have.length(1);
    });
  });
});
