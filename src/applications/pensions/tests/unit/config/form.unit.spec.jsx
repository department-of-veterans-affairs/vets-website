import moment from 'moment';
import { expect } from 'chai';

import {
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
} from '../../../config/form';

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
