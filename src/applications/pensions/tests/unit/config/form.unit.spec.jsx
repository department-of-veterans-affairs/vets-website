import moment from 'moment';
import { expect } from 'chai';

import formConfig, {
  currentSpouseHasFormerMarriages,
  isSeparated,
  isUnder65,
  showSpouseAddress,
  hasNoSocialSecurityDisability,
  isInNursingHome,
  medicaidDoesNotCoverNursingHome,
  ownsHome,
  hasVaTreatmentHistory,
  hasFederalTreatmentHistory,
  isEmployedUnder65,
  isUnemployedUnder65,
  doesReceiveIncome,
  doesHaveCareExpenses,
  doesHaveMedicalExpenses,
  doesHaveDependents,
  dependentIsOutsideHousehold,
} from '../../../config/form';

import { transform } from '../../../helpers';
import overflowForm from '../../e2e/fixtures/data/overflow-test.json';

describe('Pensions isUnder65', () => {
  it('should return false if date of birth and isOver65 indicate veteran is over 65', () => {
    const under65 = isUnder65(
      {
        veteranDateOfBirth: '1950-01-01',
        isOver65: true,
      },
      moment('2020-01-01'),
    );
    expect(under65).to.be.false;
  });

  it('should return true if veteran is less than 65 according to date of birth', () => {
    const under65 = isUnder65(
      {
        veteranDateOfBirth: '2000-01-01',
        isOver65: true,
      },
      moment('2020-01-01'),
    );
    expect(under65).to.be.true;
  });

  it('should return true if veteran is less than 65 according to isOver65', () => {
    const under65 = isUnder65(
      {
        veteranDateOfBirth: '1950-01-01',
        isOver65: false,
      },
      moment('2020-01-01'),
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
        maritalStatus: 'Separated',
        'view:liveWithSpouse': true,
      }),
    ).to.be.true;
  });
  it('should return true if veteran does not live with spouse', () => {
    expect(
      showSpouseAddress({
        maritalStatus: 'Married',
        'view:liveWithSpouse': false,
      }),
    ).to.be.true;
  });
  it('should return false if veteran is not separated and lives with spouse', () => {
    expect(
      showSpouseAddress({
        maritalStatus: 'Married',
        'view:liveWithSpouse': true,
      }),
    ).to.be.false;
  });
});

describe('Pensions isSeparated', () => {
  it('returns true if veteran is separated', () => {
    expect(isSeparated({ maritalStatus: 'Separated' })).to.be.true;
  });
  it('returns false if veteran is not separated', () => {
    expect(isSeparated({ maritalStatus: 'Married' })).to.be.false;
  });
});

describe('Pensions currentSpouseHasFormerMarriages', () => {
  it('returns true if current spouse was previously married', () => {
    expect(
      currentSpouseHasFormerMarriages({
        maritalStatus: 'Married',
        currentSpouseMaritalHistory: 'Yes',
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
});
