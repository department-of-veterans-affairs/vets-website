import _ from 'lodash/fp';
import { makeField } from '../../common/model/fields';
import { dateToMoment } from './helpers';

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

export function createEducationPeriod() {
  return {
    name: makeField(''),
    city: makeField(''),
    state: makeField(''),
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
    hours: makeField(''),
    hoursType: makeField(''),
    degreeReceived: makeField(''),
    major: makeField('')
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
    postHighSchoolTrainings: [],
    faaFlightCertificatesInformation: makeField(''),
    highSchoolOrGedCompletionDate: {
      month: makeField(''),
      day: makeField(''),
      year: makeField(''),
    },
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

function convertFieldToValue(field) {
  if (field.value !== undefined && field.dirty !== undefined) {
    return field.value;
  } else if (field.month !== undefined && field.year !== undefined && field.day !== undefined) {
    return dateToMoment(field).format('YYYY-MM-DD');
  } else if (_.isArray(field)) {
    return field.map(convertFieldToValue);
  } else if (_.isObject(field)) {
    return Object.keys(field).reduce((fieldData, prop) => {
      return _.set(prop, convertFieldToValue(field[prop]), fieldData);
    }, {});
  }

  return field;
}

export function veteranToApplication(data) {
  // Convert { value, dirty } to just the value
  let vetData = convertFieldToValue(data);

  // Replace Yes/No radio button values with booleans
  const yesNoFields = [
    'currentlyActiveDuty.yes',
    'currentlyActiveDuty.onTerminalLeave',
    'currentlyActiveDuty.nonVaAssistance',
    'seniorRotcCommissioned',
    'seniorRotcScholarshipProgram',
    'activeDutyRepaying',
    'serviceBefore1977.married',
    'serviceBefore1977.haveDependents',
    'serviceBefore1977.parentDependents',
    'hasNonMilitaryJobs'
  ];
  yesNoFields.forEach(field => {
    vetData = _.set(field, _.get(field, data) === 'Y', vetData);
  });

  return vetData;
}
