import { expect } from 'chai';
import { transformDd214Entry } from '../../../../cave/transformers/dd214';
import { EMPTY_VALUE } from '../../../../cave/transformers/helpers';

describe('cave/transformers/dd214 — transformDd214Entry', () => {
  it('returns two sections with correct headings', () => {
    const result = transformDd214Entry({});
    expect(result).to.have.length(2);
    expect(result[0].heading).to.equal("Veteran's information");
    expect(result[1].heading).to.equal('Service information');
  });

  it('handles null input gracefully', () => {
    const result = transformDd214Entry(null);
    expect(result).to.have.length(2);
    // All values should be EMPTY_VALUE since there is no data
    result.forEach(section => {
      section.rows.forEach(row => {
        expect(row.value).to.equal(EMPTY_VALUE);
      });
    });
  });

  it('handles undefined input gracefully', () => {
    const result = transformDd214Entry(undefined);
    expect(result[0].rows.every(r => r.value === EMPTY_VALUE)).to.be.true;
  });

  describe("Veteran's information section", () => {
    const entry = {
      VETERAN_NAME: { first: 'John', middle: 'Q', last: 'Smith', suffix: '' },
      VETERAN_SSN: '123456789',
      VETERAN_DOB: '1950-03-15',
    };

    it('includes first, middle, last, suffix rows', () => {
      const [section] = transformDd214Entry(entry);
      const labels = section.rows.map(r => r.label);
      expect(labels).to.include('First name');
      expect(labels).to.include('Middle name');
      expect(labels).to.include('Last name');
      expect(labels).to.include('Suffix');
    });

    it('renders first name', () => {
      const [section] = transformDd214Entry(entry);
      const row = section.rows.find(r => r.label === 'First name');
      expect(row.value).to.equal('John');
    });

    it('renders last name', () => {
      const [section] = transformDd214Entry(entry);
      const row = section.rows.find(r => r.label === 'Last name');
      expect(row.value).to.equal('Smith');
    });

    it('masks SSN', () => {
      const [section] = transformDd214Entry(entry);
      const row = section.rows.find(r => r.label === 'Social Security number');
      expect(row.value).to.equal('*****6789');
    });

    it('formats date of birth from ISO', () => {
      const [section] = transformDd214Entry(entry);
      const row = section.rows.find(r => r.label === 'Date of birth');
      expect(row.value).to.equal('March 15, 1950');
    });

    it('shows EMPTY_VALUE for missing name parts', () => {
      const [section] = transformDd214Entry({});
      const first = section.rows.find(r => r.label === 'First name');
      expect(first.value).to.equal(EMPTY_VALUE);
    });
  });

  describe('Service information section', () => {
    const entry = {
      BRANCH_OF_SERVICE: 'army',
      GRADE_RATE_RANK: 'E-4',
      PAY_GRADE: 'E-4',
      DATE_INDUCTED: '1970-02-03',
      DATE_ENTERED_ACTIVE_SERVICE: '1970-02-15',
      DATE_SEPARATED_FROM_SERVICE: '1974-02-14',
      CAUSE_OF_SEPARATION: 'Expiration of term',
      SEPARATION_TYPE: 'Discharge',
      SEPARATION_CODE: 'MBK',
    };

    it('renders branch of service', () => {
      const [, section] = transformDd214Entry(entry);
      const row = section.rows.find(r => r.label === 'Branch of service');
      expect(row.value).to.equal('army');
    });

    it('renders grade/rate/rank', () => {
      const [, section] = transformDd214Entry(entry);
      const row = section.rows.find(r => r.label === 'Grade, rate, or rank');
      expect(row.value).to.equal('E-4');
    });

    it('formats date inducted from ISO', () => {
      const [, section] = transformDd214Entry(entry);
      const row = section.rows.find(r => r.label === 'Date inducted');
      expect(row.value).to.equal('February 3, 1970');
    });

    it('formats date entered active service from ISO', () => {
      const [, section] = transformDd214Entry(entry);
      const row = section.rows.find(
        r => r.label === 'Date entered active service',
      );
      expect(row.value).to.equal('February 15, 1970');
    });

    it('formats date separated active service from ISO', () => {
      const [, section] = transformDd214Entry(entry);
      const row = section.rows.find(
        r => r.label === 'Date separated active service',
      );
      expect(row.value).to.equal('February 14, 1974');
    });

    it('renders cause of separation', () => {
      const [, section] = transformDd214Entry(entry);
      const row = section.rows.find(r => r.label === 'Cause of separation');
      expect(row.value).to.equal('Expiration of term');
    });

    it('renders separation code', () => {
      const [, section] = transformDd214Entry(entry);
      const row = section.rows.find(r => r.label === 'Separation code');
      expect(row.value).to.equal('MBK');
    });

    it('shows EMPTY_VALUE for missing service fields', () => {
      const [, section] = transformDd214Entry({});
      section.rows.forEach(row => {
        expect(row.value).to.equal(EMPTY_VALUE);
      });
    });
  });
});
