import { expect } from 'chai';
import {
  concatStreets,
  getAgeInYears,
  page15aDepends,
  populateFirstApplicant,
} from '../../../../utils/helpers';

describe('page15a depends function', () => {
  const isApp = {
    certifierRole: 'applicant',
    certifierAddress: { street: '123' },
  };
  const notApp = {
    certifierRelationship: { relationshipToVeteran: { other: true } },
    certifierAddress: { street: '123' },
  };
  it('Should return false if certifier is an applicant and index is 0', () => {
    expect(page15aDepends(isApp, 0)).to.be.false;
  });
  it('Should return true if certifier is an applicant and index > 0', () => {
    expect(page15aDepends(isApp, 1)).to.be.true;
  });
  it('Should return true if certifier is NOT an applicant and index is 0', () => {
    expect(page15aDepends(notApp, 0)).to.be.true;
  });
  it('Should return true if certifier is NOT an applicant and index is > 0', () => {
    expect(page15aDepends(notApp, 0)).to.be.true;
  });
});

describe('1010d `populateFirstApplicant` util', () => {
  const newAppInfo = {
    name: { first: 'First', last: 'Last' },
    email: 'fake@va.gov',
    phone: '1231231234',
    address: { street: '123 st' },
  };
  it('Should add an applicant to the start of `formData.applicants` array', () => {
    const formData = {
      applicants: [
        {
          applicantName: { first: 'Test' },
          applicantEmailAddress: 'fake@va.gov',
        },
      ],
    };
    const result = populateFirstApplicant(
      formData,
      newAppInfo.name,
      newAppInfo.email,
      newAppInfo.phone,
      newAppInfo.address,
    );
    expect(result.applicants.length).to.equal(2);
    expect(result.applicants[0].applicantName.first).to.equal(
      newAppInfo.name.first,
    );
  });
  it('Should add the applicants array if it is undefined', () => {
    const formData = {};
    const result = populateFirstApplicant(
      formData,
      newAppInfo.name,
      newAppInfo.email,
      newAppInfo.phone,
      newAppInfo.address,
    );
    expect(result.applicants.length).to.equal(1);
  });
  it('Should override existing applicant in first slot if name matches', () => {
    const formData = {
      applicants: [{ applicantName: newAppInfo.name }],
    };
    const result = populateFirstApplicant(
      formData,
      newAppInfo.name,
      'emailoverride@va.gov',
      newAppInfo.phone,
      newAppInfo.address,
    );
    expect(result.applicants.length).to.equal(1);
    expect(result.applicants[0].applicantEmailAddress).to.equal(
      'emailoverride@va.gov',
    );
  });
  it('Should not override matching applicant if it is not the first applicant', () => {
    const formData = {
      applicants: [
        { applicantName: { first: 'test', last: 'lorem' } },
        { applicantName: newAppInfo.name },
      ],
    };
    const result = populateFirstApplicant(
      formData,
      newAppInfo.name,
      'emailoverride@va.gov',
      newAppInfo.phone,
      newAppInfo.address,
    );
    expect(result.applicants.length).to.equal(2);
    expect(result.applicants[0].applicantEmailAddress).to.equal(undefined);
    expect(result.applicants[1].applicantEmailAddress).to.equal(undefined);
  });
});

describe('1010d `getAgeInYears` util', () => {
  const asOfUTC = (y, m, d) => new Date(Date.UTC(y, m - 1, d));

  it('should return the same age for ISO and US formats', () => {
    const asOf = asOfUTC(2025, 10, 14);
    expect(getAgeInYears('2000-10-14', asOf)).to.equal(25); // yyyy-MM-dd
    expect(getAgeInYears('10-14-2000', asOf)).to.equal(25); // MM-dd-yyyy
  });

  it('should handle `on the birthday` correctly (exact boundary)', () => {
    const asOf = asOfUTC(2025, 10, 14);
    expect(getAgeInYears('1960-10-14', asOf)).to.equal(65);
  });

  it('should be one year less the day before the birthday', () => {
    const asOf = asOfUTC(2025, 10, 13);
    expect(getAgeInYears('1960-10-14', asOf)).to.equal(64);
  });

  it('should increment the day after the birthday', () => {
    const asOf = asOfUTC(2025, 10, 15);
    expect(getAgeInYears('1960-10-14', asOf)).to.equal(65);
  });

  it('should respect the provided `asOf` date (historical calc)', () => {
    const asOf = asOfUTC(2000, 1, 1);
    expect(getAgeInYears('1990-01-01', asOf)).to.equal(10);
    expect(getAgeInYears('1990-01-02', asOf)).to.equal(9);
  });

  it('should handle leap-day birthdays safely (non-leap target year)', () => {
    // Person born Feb 29, 2004:
    // On 2025-02-28 (non-leap year) they have NOT reached birthday yet -> 20
    // On 2025-03-01 they HAVE reached birthday -> 21
    expect(getAgeInYears('2004-02-29', asOfUTC(2025, 2, 28))).to.equal(20);
    expect(getAgeInYears('2004-02-29', asOfUTC(2025, 3, 1))).to.equal(21);
  });

  it('should return `NaN` for invalid or unsupported formats', () => {
    const asOf = asOfUTC(2025, 10, 14);
    const cases = [
      '',
      'not-a-date',
      '2025/10/14',
      '2000-1-01',
      '1-01-2000',
      '13-40-2000',
      '2000-13-01',
      '2000-00-01',
      null,
      undefined,
      0,
      {},
      [],
      true,
      false,
    ];
    cases.forEach(input => {
      expect(Number.isNaN(getAgeInYears(input, asOf))).to.equal(
        true,
        `Expected NaN for ${String(input)}`,
      );
    });
  });

  it('should be timezone-robust (time of day does not affect result)', () => {
    // Same calendar day in different times; function normalizes to UTC midnight.
    const dob = '1990-06-15';
    const asOfMorningUTC = new Date(Date.UTC(2025, 5, 15, 0, 5, 0)); // 2025-06-15T00:05Z
    const asOfEveningUTC = new Date(Date.UTC(2025, 5, 15, 23, 59, 59)); // same day late
    expect(getAgeInYears(dob, asOfMorningUTC)).to.equal(35);
    expect(getAgeInYears(dob, asOfEveningUTC)).to.equal(35);
  });
});

describe('1010d `concatStreets` util', () => {
  it('should join street fields with spaces by default', () => {
    const addr = { street: '123 Main', street2: 'Apt 4B' };
    const result = concatStreets(addr);
    expect(result.streetCombined).to.equal('123 Main Apt 4B');
  });

  it('should join with new lines when `options.newLines` is true', () => {
    const addr = { street: '123 Main', street2: 'Apt 4B' };
    const result = concatStreets(addr, { newLines: true });
    expect(result.streetCombined).to.equal('123 Main\nApt 4B');
  });

  it('should filter out `undefined`, `null`, and `empty-string` values', () => {
    const addr = {
      street: '123 Main',
      street2: undefined,
      street3: null,
      street4: '',
    };
    const result = concatStreets(addr);
    expect(result.streetCombined).to.equal('123 Main');
  });

  it('should trim individual street parts before joining', () => {
    const addr = { street: '  123 Main  ', street2: '  Apt 4B ' };
    const result = concatStreets(addr);
    expect(result.streetCombined).to.equal('123 Main Apt 4B');
  });

  it('should be case-insensitive for key names containing `street`', () => {
    const addr = { Street: '123 Main', sTrEeT2: 'Apt 4B', avenue: 'Ignore me' };
    const result = concatStreets(addr);
    expect(result.streetCombined).to.equal('123 Main Apt 4B');
  });

  it('should ignore non-street keys entirely', () => {
    const addr = { city: 'Indy', postalCode: '46204' };
    const result = concatStreets(addr);
    expect(result.streetCombined).to.equal('');
  });

  it('should return a new object and does not mutate the input', () => {
    const addr = { street: '123 Main' };
    const copy = { ...addr };
    const result = concatStreets(addr);
    expect(result).to.not.equal(addr);
    expect(addr).to.deep.equal(copy);
    expect(result).to.deep.equal({ ...addr, streetCombined: '123 Main' });
  });

  it('should correctly handle undefined address object', () => {
    const result = concatStreets(undefined);
    expect(result).to.deep.equal({ streetCombined: '' });
  });

  it('should correctly handle omitted options', () => {
    const addr = { street: '123 Main', street2: 'Apt 4B' };
    const result = concatStreets(addr);
    expect(result.streetCombined).to.equal('123 Main Apt 4B');
  });

  it('should avoid trailing space or newline', () => {
    const addr = { street: '123 Main', street2: '' };
    const withSpace = concatStreets(addr);
    expect(withSpace.streetCombined).to.equal('123 Main');

    const withNewline = concatStreets(addr, { newLines: true });
    expect(withNewline.streetCombined).to.equal('123 Main');
  });
});
