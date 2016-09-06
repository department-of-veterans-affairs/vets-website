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
    seniorRotcComissioned: makeField(''),
    seniorRotcComissionYear: makeField(''),
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
    gender: makeField('')
  };
}
