import { expect } from 'chai';
import sinon from 'sinon-v20';
import {
  createModalTitleOrDescription,
  getAgeInMonths,
  getAgeInYears,
  isOfCollegeAge,
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

describe('1010d `getAgeInMonths` util', () => {
  const setClock = date =>
    sinon.useFakeTimers(new Date(`${date}T12:00:00Z`).getTime());
  let clock;

  afterEach(() => {
    if (clock) clock.restore();
  });

  it('should return the correct age in months', () => {
    clock = setClock('2025-10-14');
    expect(getAgeInMonths('2023-10-14')).to.equal(24);
    expect(getAgeInMonths('2023-09-14')).to.equal(25);
  });

  it('should handle `on the monthly anniversary` correctly (exact boundary)', () => {
    clock = setClock('2025-10-14');
    expect(getAgeInMonths('2020-10-14')).to.equal(60);
  });

  it('should be one month less the day before the monthly anniversary', () => {
    clock = setClock('2025-10-13');
    expect(getAgeInMonths('2020-10-14')).to.equal(59);
  });

  it('should remain the same the day after the monthly anniversary', () => {
    clock = setClock('2025-10-15');
    expect(getAgeInMonths('2020-10-14')).to.equal(60);
  });

  it('should respect the provided `asOf` date (historical calc)', () => {
    clock = setClock('2020-06-01');
    const asOf = new Date(Date.UTC(2020, 5, 1));
    expect(getAgeInMonths('2020-01-01', asOf)).to.equal(5);
    expect(getAgeInMonths('2020-01-02', asOf)).to.equal(4);
  });

  it('should handle leap-day birthdays safely (non-leap target year)', () => {
    clock = setClock('2025-02-28');
    expect(getAgeInMonths('2024-02-29')).to.equal(11);
    clock.restore();
    clock = setClock('2025-03-01');
    expect(getAgeInMonths('2024-02-29')).to.equal(12);
  });

  it('should return `NaN` for invalid or unsupported formats', () => {
    clock = setClock('2025-10-14');
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
      expect(Number.isNaN(getAgeInMonths(input))).to.equal(
        true,
        `Expected NaN for ${String(input)}`,
      );
    });
  });

  it('should be timezone-robust (time of day does not affect result)', () => {
    clock = sinon.useFakeTimers(
      new Date(Date.UTC(2025, 5, 15, 0, 5, 0)).getTime(),
    );
    const dob = '2024-06-15';
    const morningResult = getAgeInMonths(dob);

    clock.restore();
    clock = sinon.useFakeTimers(
      new Date(Date.UTC(2025, 5, 15, 23, 59, 59)).getTime(),
    );
    const eveningResult = getAgeInMonths(dob);

    expect(morningResult).to.equal(12);
    expect(eveningResult).to.equal(12);
  });

  it('should handle short time periods accurately', () => {
    clock = setClock('2025-03-15');
    expect(getAgeInMonths('2025-01-15')).to.equal(2);
    expect(getAgeInMonths('2025-02-15')).to.equal(1);
    expect(getAgeInMonths('2025-03-15')).to.equal(0);
    expect(getAgeInMonths('2025-03-14')).to.equal(0);
  });
});

describe('1010d `getAgeInYears` util', () => {
  const setClock = date =>
    sinon.useFakeTimers(new Date(`${date}T12:00:00Z`).getTime());
  let clock;

  afterEach(() => {
    if (clock) clock.restore();
  });

  it('should return the same age for ISO and U.S. formats', () => {
    clock = setClock('2025-10-14');
    expect(getAgeInYears('2000-10-14')).to.equal(25);
    expect(getAgeInYears('10-14-2000')).to.equal(25);
  });

  it('should handle `on the birthday` correctly (exact boundary)', () => {
    clock = setClock('2025-10-14');
    expect(getAgeInYears('1960-10-14')).to.equal(65);
  });

  it('should be one year less the day before the birthday', () => {
    clock = setClock('2025-10-13');
    expect(getAgeInYears('1960-10-14')).to.equal(64);
  });

  it('should increment the day after the birthday', () => {
    clock = setClock('2025-10-15');
    expect(getAgeInYears('1960-10-14')).to.equal(65);
  });

  it('should respect the provided `asOf` date (historical calc)', () => {
    clock = setClock('2000-01-01');
    const asOf = new Date(Date.UTC(2000, 0, 1));
    expect(getAgeInYears('1990-01-01', asOf)).to.equal(10);
    expect(getAgeInYears('1990-01-02', asOf)).to.equal(9);
  });

  it('should handle leap-day birthdays safely (non-leap target year)', () => {
    clock = setClock('2025-02-28');
    expect(getAgeInYears('2004-02-29')).to.equal(20);

    clock.restore();
    clock = setClock('2025-03-01');
    expect(getAgeInYears('2004-02-29')).to.equal(21);
  });

  it('should return `NaN` for invalid or unsupported formats', () => {
    clock = setClock('2025-10-14');
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
      expect(Number.isNaN(getAgeInYears(input))).to.equal(
        true,
        `Expected NaN for ${String(input)}`,
      );
    });
  });

  it('should be timezone-robust (time of day does not affect result)', () => {
    clock = sinon.useFakeTimers(
      new Date(Date.UTC(2025, 5, 15, 0, 5, 0)).getTime(),
    );
    const dob = '1990-06-15';
    const morningResult = getAgeInYears(dob);

    clock.restore();
    clock = sinon.useFakeTimers(
      new Date(Date.UTC(2025, 5, 15, 23, 59, 59)).getTime(),
    );
    const eveningResult = getAgeInYears(dob);

    expect(morningResult).to.equal(35);
    expect(eveningResult).to.equal(35);
  });
});

describe('1010d `isOfCollegeAge` util', () => {
  it('should return `false` when birthdate is greater than 23 years from testdate', () => {
    const testdate = new Date('2023-06-01');
    expect(isOfCollegeAge('1986-06-01', testdate)).to.be.false;
  });

  it('should return `false` when birthdate is less than 18 years from testdate', () => {
    const testdate = new Date('2023-06-01');
    expect(isOfCollegeAge('2005-06-02', testdate)).to.be.false;
  });

  it('should return `true` when birthdate is exactly 18 years from testdate', () => {
    const testdate = new Date('2023-06-01');
    expect(isOfCollegeAge('2005-06-01', testdate)).to.be.true;
  });

  it('should return `true` when birthdate is exactly 23 years from testdate', () => {
    const testdate = new Date('2023-06-01');
    expect(isOfCollegeAge('2000-06-01', testdate)).to.be.true;
  });

  it('should return `true` when birthdate is between 18 and 23 years from testdate', () => {
    const testdate = new Date('2023-06-01');
    expect(isOfCollegeAge('2003-06-01', testdate)).to.be.true;
  });
});

describe('1010d `createModalTitleOrDescription` util', () => {
  const createMockProps = (itemName = null, nounSingular = 'plan') => ({
    getItemName: sinon.stub().returns(itemName),
    itemData: itemName ? { provider: itemName } : {},
    index: 0,
    formData: {},
    nounSingular,
  });

  const itemKey = 'health-insurance--cancel-edit-item-title';
  const nounKey = 'health-insurance--cancel-edit-noun-title';

  it('should return a function', () => {
    const result = createModalTitleOrDescription(itemKey, nounKey);
    expect(result).to.be.a('function');
  });

  it('should use itemKey and replace with item name when it exists', () => {
    const modalFn = createModalTitleOrDescription(itemKey, nounKey);
    const props = createMockProps('Blue Cross');
    const result = modalFn(props);
    sinon.assert.calledOnceWithExactly(
      props.getItemName,
      props.itemData,
      props.index,
      props.formData,
    );
    expect(result).to.include('Blue Cross');
    expect(result).to.not.include('{{XX');
  });

  [
    { value: null, description: 'null' },
    { value: undefined, description: 'undefined' },
    { value: '', description: 'empty string' },
  ].forEach(({ value, description }) => {
    it(`should use nounKey and replace with noun when item name is ${description}`, () => {
      const modalFn = createModalTitleOrDescription(itemKey, nounKey);
      const props = createMockProps(value, 'insurance plan');
      const result = modalFn(props);
      expect(result).to.include('insurance plan');
      expect(result).to.not.include('{{XX');
    });
  });

  it('should call getItemName with correct arguments', () => {
    const modalFn = createModalTitleOrDescription(itemKey, nounKey);
    const props = createMockProps('Aetna');
    modalFn(props);
    sinon.assert.calledOnceWithExactly(
      props.getItemName,
      props.itemData,
      props.index,
      props.formData,
    );
  });
});
