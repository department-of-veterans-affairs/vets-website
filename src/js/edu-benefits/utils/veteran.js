import _ from 'lodash/fp';
import { makeField } from '../../common/model/fields';
import { dateToMoment } from './helpers';

export function createTour() {
  return {
    dateRange: {
      to: {
        month: makeField(''),
        day: makeField(''),
        year: makeField(''),
      },
      from: {
        month: makeField(''),
        day: makeField(''),
        year: makeField(''),
      }
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
    dateRange: {
      to: {
        month: makeField(''),
        day: makeField(''),
        year: makeField(''),
      },
      from: {
        month: makeField(''),
        day: makeField(''),
        year: makeField(''),
      }
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
      to: {
        month: makeField(''),
        day: makeField(''),
        year: makeField(''),
      },
      from: {
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
    return field.value === '' ? undefined : field.value;
  } else if (field.month !== undefined && field.year !== undefined && field.day !== undefined) {
    if (field.month.value !== '' && field.day.value !== '' && field.year.value !== '') {
      return dateToMoment(field).format('YYYY-MM-DD');
    }
    return undefined;
  } else if (field.street !== undefined && field.country !== undefined && field.city !== undefined &&
    (field.street.value === '' || field.country.value === '' || field.city.value === '')) {
    return undefined;
  } else if (_.isArray(field)) {
    return field.map(convertFieldToValue);
  } else if (_.isObject(field)) {
    return Object.keys(field).reduce((fieldData, prop) => {
      return _.set(prop, convertFieldToValue(field[prop]), fieldData);
    }, {});
  }

  return field;
}

function convertToNumber(data, field) {
  const numString = (data[field] || '').replace(/\D/g, '');
  const num = parseInt(numString, 10);

  return isNaN(num)
    ? _.unset(field, data)
    : _.set(field, num, data);
}

function convertYesNoNA(data, field) {
  const value = data[field];
  if (value !== undefined) {
    let convertedValue;
    if (value === 'Y') {
      convertedValue = 'yes';
    } else if (value === 'N') {
      convertedValue = 'no';
    } else {
      convertedValue = 'n/a';
    }

    return _.set(field, convertedValue, data);
  }

  return _.unset(field, data);
}

function convertYesNo(data, field) {
  const value = _.get(field, data);

  return value
    ? _.set(field, value === 'Y', data)
    : _.unset(field, data);
}

export function veteranToApplication(data) {
  // Convert { value, dirty } to just the value
  let vetData = convertFieldToValue(data);

  // Replace Yes/No radio button values with booleans
  vetData = [
    'currentlyActiveDuty.yes',
    'currentlyActiveDuty.onTerminalLeave',
    'currentlyActiveDuty.nonVaAssistance',
    'seniorRotcScholarshipProgram',
    'serviceBefore1977.married',
    'serviceBefore1977.haveDependents',
    'serviceBefore1977.parentDependent',
    'seniorRotcCommissioned',
    'activeDutyRepaying'
  ].reduce(convertYesNo, vetData);

  // Convert strings to numbers
  vetData = [
    'serviceAcademyGraduationYear',
    'seniorRotc.commissionYear',
  ].reduce(convertToNumber, vetData);

  // Update growable table data rows
  vetData.toursOfDuty = vetData.toursOfDuty.map(tour => convertYesNoNA(tour, 'involuntarilyCalledToDuty'));

  vetData.nonMilitaryJobs = vetData.nonMilitaryJobs.map(job => {
    let jobData = convertToNumber(job, 'months');
    if (job.postMilitaryJob) {
      jobData = _.set('postMilitaryJob', job.postMilitaryJob === 'after', jobData);
    } else {
      jobData = _.unset('postMilitaryJob', jobData);
    }

    return jobData;
  });

  vetData.postHighSchoolTrainings = vetData.postHighSchoolTrainings.map(training => convertToNumber(training, 'hours'));

  if (!vetData.seniorRotcCommissioned) {
    vetData = _.unset('seniorRotc', vetData);
  } else {
    vetData.seniorRotc.rotcScholarshipAmounts = vetData.seniorRotc.rotcScholarshipAmounts.map(ship => {
      let shipData = convertToNumber(ship, 'amount');
      shipData = convertToNumber(ship, 'year');

      return shipData;
    });
  }

  // Individual field tweaks
  if (vetData.veteranSocialSecurityNumber) {
    vetData.veteranSocialSecurityNumber = vetData.veteranSocialSecurityNumber.replace(/\D/g, '');
  }

  if (!vetData.activeDutyRepaying) {
    vetData = _.unset('activeDutyRepayingPeriod', vetData);
  }

  // Remove UI only fields
  vetData = [
    'seniorRotcCommissioned',
    'activeDutyRepaying',
    'hasNonMilitaryJobs',
    'emailConfirmation'
  ].reduce((current, field) => _.unset(field, current), vetData);

  return vetData;
}
