// Child resource prototype objects. In common so server unittests can access.
const makeField = require('./fields').makeField;

const blankChild = {
  childFullName: {
    first: makeField(''),
    middle: makeField(''),
    last: makeField(''),
    suffix: makeField('')
  },
  childRelation: makeField(''),
  childSocialSecurityNumber: makeField(''),
  childBecameDependent: {
    month: makeField(''),
    day: makeField(''),
    year: makeField('')
  },
  childDateOfBirth: {
    month: makeField(''),
    day: makeField(''),
    year: makeField('')
  },
  childDisabledBefore18: makeField(''),
  childAttendedSchoolLastYear: makeField(''),
  childEducationExpenses: makeField(''),
  childCohabitedLastYear: makeField(''),
  childReceivedSupportLastYear: makeField(''),
};

// Keep these separate so that the initialization of the fields occurs on the right page for the income fields
const blankChildIncome = {
  grossIncome: makeField(''),
  netIncome: makeField(''),
  otherIncome: makeField(''),
};

function createBlankChild() {
  return Object.assign({}, blankChild);
}

module.exports = { createBlankChild, blankChildIncome };
