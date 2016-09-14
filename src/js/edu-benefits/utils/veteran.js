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

export function veteranToApplication(data) {
  console.log(data);
  // Convert { value, dirty } to just the value
  let vetData = convertFieldToValue(data);

  // Replace Yes/No radio button values with booleans
  const yesNoFields = [
    'currentlyActiveDuty.yes',
    'currentlyActiveDuty.onTerminalLeave',
    'currentlyActiveDuty.nonVaAssistance',
    'seniorRotcScholarshipProgram',
    'serviceBefore1977.married',
    'serviceBefore1977.haveDependents',
    'serviceBefore1977.parentDependent',
    'seniorRotcCommissioned',
    'activeDutyRepaying'
  ];
  yesNoFields.forEach(field => {
    vetData = _.set(field, _.get(field, vetData) === 'Y', vetData);
  });

  // Convert strings to numbers
  const numberFields = [
    'serviceAcademyGraduationYear',
    'seniorRotc.commissionYear',
  ];
  numberFields.forEach(field => {
    const num = parseInt(_.get(field, vetData), 10);
    if (isNaN(num)) {
      _.unset(field, vetData);
    } else {
      vetData = _.set(field, num, vetData);
    }
  });

  vetData.seniorRotc.rotcScholarshipAmounts = vetData.seniorRotc.rotcScholarshipAmounts.map(ship => ({
    amount: ship.amount !== '' ? parseInt(ship.amount.replace(/\D/g, ''), 10) : undefined,
    year: parseInt(ship.year, 10)
  }));

  vetData.veteranSocialSecurityNumber = vetData.veteranSocialSecurityNumber.replace(/\D/g, '');

  vetData.toursOfDuty = vetData.toursOfDuty.map(tour => {
    let involuntarilyCalledToDuty;
    if (tour.involuntarilyCalledToDuty === 'Y') {
      involuntarilyCalledToDuty = 'yes';
    } else if (tour.involuntarilyCalledToDuty === 'N') {
      involuntarilyCalledToDuty = 'no';
    } else {
      involuntarilyCalledToDuty = 'n/a';
    }

    return _.set('involuntarilyCalledToDuty', involuntarilyCalledToDuty, tour);
  });

  vetData.nonMilitaryJobs = vetData.nonMilitaryJobs.map(job => {
    const num = parseInt(job.months, 10);
    let jobData;
    if (isNaN(num)) {
      jobData = _.unset('months', job);
    } else {
      jobData = _.set('months', num, job);
    }
    jobData = _.set('postMilitaryJob', job.postMilitaryJob === 'after', jobData);

    return jobData;
  });

  vetData.postHighSchoolTrainings = vetData.postHighSchoolTrainings.map(training => {
    const num = parseInt(training.hours, 10);
    let trainingData;
    if (isNaN(num)) {
      trainingData = _.unset('hours', training);
    } else {
      trainingData = _.set('hours', num, training);
    }

    return trainingData;
  });

  if (!vetData.seniorRotcCommissioned) {
    vetData = _.unset('seniorRotc', vetData);
  }

  if (!vetData.activeDutyRepaying) {
    vetData = _.unset('activeDutyRepayingPeriod', vetData);
  }

  // Remove UI only fields
  const fieldsToRemove = [
    'seniorRotcCommissioned',
    'activeDutyRepaying',
    'hasNonMilitaryJobs',
    'emailConfirmation'
  ];
  fieldsToRemove.forEach(field => {
    vetData = _.unset(field, vetData);
  });

  return vetData;
}
