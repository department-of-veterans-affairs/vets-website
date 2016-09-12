import { makeField } from '../../common/model/fields';

export function createTour() {
  return {
    toDate: {
      month: makeField(''),
      day: makeField(''),
      year: makeField(''),
    },
    fromDate: {
      month: makeField(''),
      day: makeField(''),
      year: makeField(''),
    },
    serviceBranch: makeField(''),
    serviceStatus: makeField(''),
    involuntarilyCalledToDuty: makeField(''),
    doNotApplyPeriodToSelected: false,
    applyToChapter30: false,
    applyToChapter1606: false,
    applyToChapter32: false
  };
}

export function createEmploymentPeriod() {
  return {
    name: makeField(''),
    months: makeField(''),
    licenseOrRating: makeField(''),
    postMilitaryJob: makeField('')
  };
}

export function createRotcScholarship() {
  return {
    amount: makeField(''),
    year: makeField('')
  };
}

export function createVeteran() {
  return {
    benefitsRelinquished: makeField(''),
    chapter30: false,
    chapter1606: false,
    chapter32: false,
    chapter33: false,
    serviceAcademyGraduationYear: makeField(''),
    currentlyActiveDuty: {
      yes: makeField(''),
      onTerminalLeave: makeField(''),
      nonVaAssistance: makeField('')
    },
    toursOfDuty: [],
    seniorRotcCommissioned: makeField(''),
    seniorRotc: {
      commissionYear: makeField(''),
      rotcScholarshipAmounts: []
    },
    seniorRotcScholarshipProgram: makeField(''),
    civilianBenefitsAssistance: false,
    additionalContributions: false,
    activeDutyKicker: false,
    reserveKicker: false,
    activeDutyRepaying: makeField(''),
    activeDutyRepayingPeriod: {
      toDate: {
        month: makeField(''),
        day: makeField(''),
        year: makeField(''),
      },
      fromDate: {
        month: makeField(''),
        day: makeField(''),
        year: makeField(''),
      }
    },
    serviceBefore1977: {
      married: makeField(''),
      haveDependents: makeField(''),
      parentDependent: makeField('')
    },
    veteranFullName: {
      first: makeField(''),
      middle: makeField(''),
      last: makeField(''),
      suffix: makeField(''),
    },
    veteranSocialSecurityNumber: makeField(''),
    veteranDateOfBirth: {
      month: makeField(''),
      day: makeField(''),
      year: makeField(''),
    },
    gender: makeField(''),
    hasNonMilitaryJobs: makeField(''),
    nonMilitaryJobs: [],
    veteranAddress: {
      street: makeField(''),
      city: makeField(''),
      country: makeField(''),
      state: makeField(''),
      provinceCode: makeField(''),
      zipcode: makeField(''),
      postalCode: makeField(''),
    },
    email: makeField(''),
    emailConfirmation: makeField(''),
    homePhone: makeField(''),
    mobilePhone: makeField(''),
    preferredContactMethod: makeField(''),
    educationType: makeField(''),
    school: {
      name: makeField(''),
      address: {
        street: makeField(''),
        city: makeField(''),
        country: makeField(''),
        state: makeField(''),
        provinceCode: makeField(''),
        zipcode: makeField(''),
        postalCode: makeField('')
      }
    },
    educationObjective: makeField(''),
    educationStartDate: {
      month: makeField(''),
      day: makeField(''),
      year: makeField(''),
    },
    secondaryContact: {
      fullName: makeField(''),
      sameAddress: false,
      address: {
        street: makeField(''),
        city: makeField(''),
        country: makeField(''),
        state: makeField(''),
        provinceCode: makeField(''),
        zipcode: makeField(''),
        postalCode: makeField('')
      },
      phone: makeField('')
    },
    bankAccount: {
      accountType: makeField(''),
      accountNumber: makeField(''),
      routingNumber: makeField('')
    }
  };
}

export function createPopulatedVeteran() {
  return {
    benefitsRelinquished: makeField('N'),
    chapter30: false,
    chapter1606: false,
    chapter32: false,
    chapter33: false,
    serviceAcademyGraduationYear: makeField('1904'),
    currentlyActiveDuty: {
      yes: makeField('N'),
      onTerminalLeave: makeField('N'),
      nonVaAssistance: makeField('N')
    },
    toursOfDuty: [],
    seniorRotcCommissioned: makeField('N'),
    seniorRotc: {
      commissionYear: makeField('1940'),
      rotcScholarshipAmounts: []
    },
    seniorRotcScholarshipProgram: makeField('N'),
    civilianBenefitsAssistance: true,
    additionalContributions: false,
    activeDutyKicker: false,
    reserveKicker: false,
    activeDutyRepaying: makeField('Y'),
    activeDutyRepayingPeriod: {
      toDate: {
        month: makeField(''),
        day: makeField(''),
        year: makeField(''),
      },
      fromDate: {
        month: makeField(''),
        day: makeField(''),
        year: makeField(''),
      }
    },
    serviceBefore1977: {
      married: makeField('N'),
      haveDependents: makeField('N'),
      parentDependent: makeField('N')
    },
    veteranFullName: {
      first: makeField('Joe'),
      middle: makeField(''),
      last: makeField('Veteran'),
      suffix: makeField(''),
    },
    veteranSocialSecurityNumber: makeField('123445566'),
    veteranDateOfBirth: {
      month: makeField('10'),
      day: makeField('12'),
      year: makeField('1978'),
    },
    gender: makeField('M'),
    hasNonMilitaryJobs: makeField('N'),
    nonMilitaryJobs: [],
    veteranAddress: {
      street: makeField('asdf'),
      city: makeField('adf'),
      country: makeField('USA'),
      state: makeField('VT'),
      provinceCode: makeField(''),
      zipcode: makeField('05301'),
      postalCode: makeField(''),
    },
    email: makeField('vet@test.com'),
    emailConfirmation: makeField('vet@test.com'),
    homePhone: makeField('5555555566'),
    mobilePhone: makeField('5555556655'),
    preferredContactMethod: makeField('mail'),
    educationType: makeField('college'),
    school: {
      name: makeField(''),
      address: {
        street: makeField(''),
        city: makeField(''),
        country: makeField(''),
        state: makeField(''),
        provinceCode: makeField(''),
        zipcode: makeField(''),
        postalCode: makeField('')
      }
    },
    educationObjective: makeField('Getting an education'),
    educationStartDate: {
      month: makeField(''),
      day: makeField(''),
      year: makeField(''),
    },
    secondaryContact: {
      fullName: makeField(''),
      sameAddress: false,
      address: {
        street: makeField(''),
        city: makeField(''),
        country: makeField(''),
        state: makeField(''),
        provinceCode: makeField(''),
        zipcode: makeField(''),
        postalCode: makeField('')
      },
      phone: makeField('')
    },
    bankAccount: {
      accountType: makeField(''),
      accountNumber: makeField(''),
      routingNumber: makeField('')
    }
  };
}
