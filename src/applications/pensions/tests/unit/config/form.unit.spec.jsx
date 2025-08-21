import { expect } from 'chai';

import { parseISO } from 'date-fns';
import formConfig from '../../../config/form';

import { transform } from '../../../config/submit';
import overflowForm from '../../e2e/fixtures/data/overflow-test.json';
import {
  hasFederalTreatmentHistory,
  hasNoSocialSecurityDisability,
  hasVaTreatmentHistory,
  isEmployedUnder65,
  isInNursingHome,
  isUnder65,
  isUnemployedUnder65,
  medicaidDoesNotCoverNursingHome,
} from '../../../config/chapters/03-health-and-employment-information/helpers';
import {
  currentSpouseHasFormerMarriages,
  dependentIsOutsideHousehold,
  doesHaveDependents,
  isSeparated,
  showSpouseAddress,
} from '../../../config/chapters/04-household-information/helpers';
import {
  doesHaveCareExpenses,
  doesHaveMedicalExpenses,
  doesReceiveIncome,
  ownsHome,
} from '../../../config/chapters/05-financial-information/helpers';

describe('Pensions isUnder65', () => {
  it('should return false if date of birth and isOver65 indicate veteran is over 65', () => {
    const under65 = isUnder65(
      {
        veteranDateOfBirth: '1950-01-01',
        isOver65: true,
      },
      parseISO('2020-01-01'),
    );
    expect(under65).to.be.false;
  });

  it('should return true if veteran is less than 65 according to date of birth', () => {
    const under65 = isUnder65(
      {
        veteranDateOfBirth: '2000-01-01',
        isOver65: true,
      },
      parseISO('2020-01-01'),
    );
    expect(under65).to.be.true;
  });

  it('should return true if veteran is less than 65 according to isOver65', () => {
    const under65 = isUnder65(
      {
        veteranDateOfBirth: '1950-01-01',
        isOver65: false,
      },
      parseISO('2020-01-01'),
    );
    expect(under65).to.be.true;
  });

  it('should work when no default date is provided', () => {
    expect(
      isUnder65({
        veteranDateOfBirth: '1900-01-01',
        isOver65: true,
      }),
    ).to.be.false;
  });
});

describe('Pensions showSpouseAddress', () => {
  it('should return true if marital status is separated', () => {
    expect(
      showSpouseAddress({
        maritalStatus: 'SEPARATED',
        'view:liveWithSpouse': true,
      }),
    ).to.be.true;
  });
  it('should return true if veteran does not live with spouse', () => {
    expect(
      showSpouseAddress({
        maritalStatus: 'MARRIED',
        'view:liveWithSpouse': false,
      }),
    ).to.be.true;
  });
  it('should return false if veteran is not separated and lives with spouse', () => {
    expect(
      showSpouseAddress({
        maritalStatus: 'MARRIED',
        'view:liveWithSpouse': true,
      }),
    ).to.be.false;
  });
});

describe('Pensions isSeparated', () => {
  it('returns true if veteran is separated', () => {
    expect(isSeparated({ maritalStatus: 'SEPARATED' })).to.be.true;
  });
  it('returns false if veteran is not separated', () => {
    expect(isSeparated({ maritalStatus: 'MARRIED' })).to.be.false;
  });
});

describe('Pensions currentSpouseHasFormerMarriages', () => {
  it('returns true if current spouse was previously married', () => {
    expect(
      currentSpouseHasFormerMarriages({
        maritalStatus: 'MARRIED',
        currentSpouseMaritalHistory: 'YES',
      }),
    ).to.be.true;
  });
});

describe('Pensions hasNoSocialSecurityDisability', () => {
  it('returns true if the veteran does not receive social security disability', () => {
    expect(hasNoSocialSecurityDisability({ socialSecurityDisability: false }));
  });
});

describe('Pensions isInNursingHome', () => {
  it('returns true if the veteran is in a nursing home', () => {
    expect(isInNursingHome({ nursingHome: true })).to.be.true;
  });
});

describe('Pensions medicaidDoesNotCoverNursingHome', () => {
  it('returns true if medicaid does not pay for the nursing home', () => {
    expect(
      medicaidDoesNotCoverNursingHome({
        nursingHome: true,
        medicaidCoverage: false,
      }),
    ).to.be.true;
  });
});

describe('Pensions ownsHome', () => {
  it('returns true if veteran owns a home', () => {
    expect(ownsHome({ homeOwnership: true })).to.be.true;
  });
});

describe('Pensions hasVaTreatmentHistory', () => {
  it('returns true if has VA treatment history', () => {
    expect(hasVaTreatmentHistory({ vaTreatmentHistory: true })).to.be.true;
  });
});

describe('Pensions hasFederalTreatmentHistory', () => {
  it('returns true if has federal treatment history', () => {
    expect(hasFederalTreatmentHistory({ federalTreatmentHistory: true })).to.be
      .true;
  });
});

describe('Pensions isEmployedUnder65', () => {
  it('returns true if veteran is under 65 and employed', () => {
    expect(isEmployedUnder65({ currentEmployment: true })).to.be.true;
  });
});

describe('Pensions isUnemployedUnder65', () => {
  it('returns true if veteran is under 65 and unemployed', () => {
    expect(isUnemployedUnder65({ currentEmployment: false })).to.be.true;
  });
});

describe('Pensions doesReceiveIncome', () => {
  it('returns true if veteran receives income', () => {
    expect(doesReceiveIncome({ receivesIncome: true })).to.be.true;
  });
});

describe('Pensions doesHaveCareExpenses', () => {
  it('returns true if veteran has care expenses', () => {
    expect(doesHaveCareExpenses({ hasCareExpenses: true })).to.be.true;
  });
});

describe('Pensions doesHaveMedicalExpenses', () => {
  it('returns true if veteran has medical expenses', () => {
    expect(doesHaveMedicalExpenses({ hasMedicalExpenses: true })).to.be.true;
  });
});

describe('Pensions doesHaveDependents', () => {
  it('returns true if veteran has dependents', () => {
    expect(doesHaveDependents({ 'view:hasDependents': true })).to.be.true;
  });

  it('returns false if veteran has no dependents', () => {
    expect(doesHaveDependents({ 'view:hasDependents': false })).to.be.false;
  });
});

describe('Pensions dependentIsOutsideHousehold', () => {
  const dependents = [{ childInHousehold: false }, { childInHousehold: true }];

  it('returns true if veteran has dependents and dependent is outside household', () => {
    expect(
      dependentIsOutsideHousehold(
        { 'view:hasDependents': true, dependents },
        0,
      ),
    ).to.be.true;
  });

  it('returns false if veteran has dependents and dependent is inside household', () => {
    expect(
      dependentIsOutsideHousehold(
        { 'view:hasDependents': true, dependents },
        1,
      ),
    ).to.be.false;
  });

  it('returns false if veteran has no dependents', () => {
    expect(
      dependentIsOutsideHousehold(
        { 'view:hasDependents': false, dependents },
        0,
      ),
    ).to.be.false;
    expect(
      dependentIsOutsideHousehold(
        { 'view:hasDependents': false, dependents },
        1,
      ),
    ).to.be.false;
  });
});

describe('Pensions formConfig', () => {
  it('when transformed for submit, should remove dependents if veteran has no dependents', () => {
    const formData = {
      data: {
        'view:hasDependents': false,
        dependents: overflowForm.data.dependents,
      },
    };
    const result = transform(formConfig, formData);
    expect(JSON.parse(result).pensionClaim.form).to.equal(JSON.stringify({}));
  });
  it('when transformed for submit, should keep dependents if veteran has dependents', () => {
    const formData = {
      data: {
        'view:hasDependents': true,
        dependents: overflowForm.data.dependents,
      },
    };
    const result = transform(formConfig, formData);
    expect(JSON.parse(result).pensionClaim.form).to.equal(
      JSON.stringify({ dependents: overflowForm.data.dependents }),
    );
  });
  it('when transformed for submit, should remove homeAcreageValue if veteran owns no home', () => {
    const formData = {
      data: {
        homeOwnership: false,
        homeAcreageMoreThanTwo: true,
        homeAcreageValue: 20000,
      },
    };
    const result = transform(formConfig, formData);
    expect(JSON.parse(result).pensionClaim.form).to.equal(
      JSON.stringify({ homeOwnership: false }),
    );
  });
  it('when transformed for submit, should remove homeAcreageValue if veteran owns less than two acres', () => {
    const formData = {
      data: {
        homeOwnership: true,
        homeAcreageMoreThanTwo: false,
        homeAcreageValue: 20000,
      },
    };
    const result = transform(formConfig, formData);
    expect(JSON.parse(result).pensionClaim.form).to.equal(
      JSON.stringify({
        homeOwnership: true,
        homeAcreageMoreThanTwo: false,
      }),
    );
  });
  it('when transformed for submit, should keep homeAcreageValue if veteran owns more than two acres', () => {
    const formData = {
      data: {
        homeOwnership: true,
        homeAcreageMoreThanTwo: true,
        homeAcreageValue: 20000,
      },
    };
    const result = transform(formConfig, formData);
    expect(JSON.parse(result).pensionClaim.form).to.equal(
      JSON.stringify({
        homeOwnership: true,
        homeAcreageMoreThanTwo: true,
        homeAcreageValue: 20000,
      }),
    );
  });
  it('when transformed for submit, should NOT convert array items to null (no [null] arrays)', () => {
    const formData = {
      data: {
        serveUnderOtherNames: true,
        previousNames: [
          {
            previousFullName: {
              first: 'Joseph',
              last: 'Doe',
            },
          },
        ],
        currentEmployment: true,
        currentEmployers: [
          {
            jobType: 'Customer service',
            jobHoursWeek: 20,
          },
        ],
        vaTreatmentHistory: true,
        vaMedicalCenters: [
          {
            medicalCenter: 'Dallas Fort Worth VA Medical Center',
          },
        ],
        maritalStatus: 'SEPARATED',
        marriages: [
          {
            spouseFullName: {
              first: 'Meg',
              middle: 'Middle',
              last: 'Doe',
            },
            'view:currentMarriage': {
              dateOfMarriage: '1994-03-02',
              locationOfMarriage: 'North Adams, MA',
              marriageType: 'CEREMONIAL',
            },
          },
        ],
        'view:hasDependents': true,
        dependents: [
          {
            childInHousehold: false,
            childAddress: {
              street: '123 8th st',
              city: 'Hadley',
              country: 'USA',
              state: 'ME',
              postalCode: '01050',
            },
            personWhoLivesWithChild: {
              first: 'Joe',
              middle: 'Middle',
              last: 'Smith',
            },
            monthlyPayment: 3444,
            childPlaceOfBirth: 'Tallahassee, FL',
            childSocialSecurityNumber: '333224444',
            childRelationship: 'biological',
            previouslyMarried: true,
            married: true,
            fullName: {
              first: 'Emily',
              middle: 'Anne',
              last: 'Doe',
            },
            childDateOfBirth: '2000-03-03',
          },
        ],
        receivesIncome: true,
        incomeSources: [
          {
            typeOfIncome: 'SOCIAL_SECURITY',
            receiver: 'Jane Doe',
            payer: 'John Doe',
            amount: 278.0,
          },
        ],
      },
    };

    const result = transform(formConfig, formData);
    const payload = JSON.parse(JSON.parse(result).pensionClaim.form);

    expect(payload.previousNames).to.deep.equal([
      {
        previousFullName: {
          first: 'Joseph',
          last: 'Doe',
        },
      },
    ]);
    expect(payload.currentEmployers).to.deep.equal([
      { jobType: 'Customer service', jobHoursWeek: 20 },
    ]);
    expect(payload.vaMedicalCenters).to.deep.equal([
      { medicalCenter: 'Dallas Fort Worth VA Medical Center' },
    ]);
    expect(payload.marriages).to.deep.equal([
      {
        spouseFullName: {
          first: 'Meg',
          middle: 'Middle',
          last: 'Doe',
        },
        dateOfMarriage: '1994-03-02',
        locationOfMarriage: 'North Adams, MA',
        marriageType: 'CEREMONIAL',
      },
    ]);
    expect(payload.dependents).to.deep.equal([
      {
        childInHousehold: false,
        childAddress: {
          street: '123 8th st',
          city: 'Hadley',
          country: 'USA',
          state: 'ME',
          postalCode: '01050',
        },
        personWhoLivesWithChild: {
          first: 'Joe',
          middle: 'Middle',
          last: 'Smith',
        },
        monthlyPayment: 3444,
        childPlaceOfBirth: 'Tallahassee, FL',
        childSocialSecurityNumber: '333224444',
        childRelationship: 'biological',
        previouslyMarried: true,
        married: true,
        fullName: {
          first: 'Emily',
          middle: 'Anne',
          last: 'Doe',
        },
        childDateOfBirth: '2000-03-03',
      },
    ]);
    expect(payload.incomeSources).to.deep.equal([
      {
        typeOfIncome: 'SOCIAL_SECURITY',
        receiver: 'Jane Doe',
        payer: 'John Doe',
        amount: 278.0,
      },
    ]);

    [
      'previousNames',
      'currentEmployers',
      'vaMedicalCenters',
      'marriages',
      'dependents',
      'incomeSources',
    ].forEach(key => {
      expect((payload[key] || []).includes(null)).to.equal(false);
    });
  });
});
