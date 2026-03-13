import { expect } from 'chai';
import { transformDeathCertificateEntry } from '../../../../cave/transformers/deathCertificate';
import { EMPTY_VALUE } from '../../../../cave/transformers/helpers';

describe('cave/transformers/deathCertificate — transformDeathCertificateEntry', () => {
  it('returns two sections with correct headings', () => {
    const result = transformDeathCertificateEntry({});
    expect(result).to.have.length(2);
    expect(result[0].heading).to.equal("Veteran's information");
    expect(result[1].heading).to.equal("Veteran's death information");
  });

  it('handles null input gracefully', () => {
    const result = transformDeathCertificateEntry(null);
    expect(result).to.have.length(2);
    result.forEach(section => {
      section.rows.forEach(row => {
        expect(row.value).to.equal(EMPTY_VALUE);
      });
    });
  });

  it('handles undefined input gracefully', () => {
    const result = transformDeathCertificateEntry(undefined);
    result.forEach(section => {
      section.rows.forEach(row => {
        expect(row.value).to.equal(EMPTY_VALUE);
      });
    });
  });

  describe("Veteran's information section", () => {
    const entry = {
      DECENDENT_FULL_NAME: {
        first: 'Pat',
        middle: 'A',
        last: 'Veteran',
        suffix: '',
      },
      DECENDENT_SSN: '987654321',
    };

    it('includes first, middle, last, suffix rows', () => {
      const [section] = transformDeathCertificateEntry(entry);
      const labels = section.rows.map(r => r.label);
      expect(labels).to.include('First name');
      expect(labels).to.include('Middle name');
      expect(labels).to.include('Last name');
      expect(labels).to.include('Suffix');
    });

    it('renders first name', () => {
      const [section] = transformDeathCertificateEntry(entry);
      const row = section.rows.find(r => r.label === 'First name');
      expect(row.value).to.equal('Pat');
    });

    it('renders last name', () => {
      const [section] = transformDeathCertificateEntry(entry);
      const row = section.rows.find(r => r.label === 'Last name');
      expect(row.value).to.equal('Veteran');
    });

    it('masks SSN', () => {
      const [section] = transformDeathCertificateEntry(entry);
      const row = section.rows.find(r => r.label === 'Social Security number');
      expect(row.value).to.equal('*****4321');
    });

    it('shows EMPTY_VALUE for missing name parts', () => {
      const [section] = transformDeathCertificateEntry({});
      const first = section.rows.find(r => r.label === 'First name');
      expect(first.value).to.equal(EMPTY_VALUE);
    });
  });

  describe("Veteran's death information section", () => {
    const entry = {
      DECENDENT_DATE_OF_DISPOSITION: '2020-03-10',
      DECENDENT_DATE_OF_DEATH: '2020-03-01',
      CAUSE_OF_DEATH: 'Natural causes',
      UNDERLYING_CAUSE_OF_DEATH_B: 'Hypertension',
      UNDERLYING_CAUSE_OF_DEATH_C: '',
      UNDERLYING_CAUSE_OF_DEATH_D: null,
      MANNER_OF_DEATH: 'Natural',
      DECENDENT_MARITAL_STATUS: 'Married',
    };

    it('formats disposition date from ISO', () => {
      const [, section] = transformDeathCertificateEntry(entry);
      const row = section.rows.find(r => r.label === 'Disposition date');
      expect(row.value).to.equal('March 10, 2020');
    });

    it('formats date of death from ISO', () => {
      const [, section] = transformDeathCertificateEntry(entry);
      const row = section.rows.find(r => r.label === 'Date of death');
      expect(row.value).to.equal('March 1, 2020');
    });

    it('renders cause of death A', () => {
      const [, section] = transformDeathCertificateEntry(entry);
      const row = section.rows.find(r => r.label === 'Cause of death A');
      expect(row.value).to.equal('Natural causes');
    });

    it('renders cause of death B', () => {
      const [, section] = transformDeathCertificateEntry(entry);
      const row = section.rows.find(r => r.label === 'Cause of death B');
      expect(row.value).to.equal('Hypertension');
    });

    it('shows EMPTY_VALUE for blank cause of death C', () => {
      const [, section] = transformDeathCertificateEntry(entry);
      const row = section.rows.find(r => r.label === 'Cause of death C');
      expect(row.value).to.equal(EMPTY_VALUE);
    });

    it('shows EMPTY_VALUE for null cause of death D', () => {
      const [, section] = transformDeathCertificateEntry(entry);
      const row = section.rows.find(r => r.label === 'Cause of death D');
      expect(row.value).to.equal(EMPTY_VALUE);
    });

    it('renders manner of death', () => {
      const [, section] = transformDeathCertificateEntry(entry);
      const row = section.rows.find(r => r.label === 'Manner of death');
      expect(row.value).to.equal('Natural');
    });

    it('renders marital status', () => {
      const [, section] = transformDeathCertificateEntry(entry);
      const row = section.rows.find(
        r => r.label === 'Marital status at time of death',
      );
      expect(row.value).to.equal('Married');
    });

    it('shows EMPTY_VALUE for all missing death fields', () => {
      const [, section] = transformDeathCertificateEntry({});
      section.rows.forEach(row => {
        expect(row.value).to.equal(EMPTY_VALUE);
      });
    });
  });
});
