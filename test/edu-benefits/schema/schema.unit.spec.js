import { expect } from 'chai';
import Ajv from 'ajv';
import schema from '../../../schema/dist/edu-benefits-schema.json';
import qc from 'quick_check';
import _ from 'lodash';

import {
  createVeteran,
  veteranToApplication,
  createTour,
  createEducationPeriod,
  createRotcScholarship,
  createEmploymentPeriod
} from '../../../src/js/edu-benefits/utils/veteran';

import {
  relinquishableBenefits,
  states, contactOptions,
  schoolTypes,
  accountTypes,
  suffixes,
  serviceBranches,
  hoursTypes,
  ownBenefitsOptions
} from '../../../src/js/edu-benefits/utils/options-for-select';

const ajv = new Ajv();
const validate = ajv.compile(schema);
const makeField = gen => qc.objectLike({
  dirty: true,
  value: gen
});
const yesNoGen = () => qc.choose('Y', 'N', '');
const routingNumbers = [
  '114923756',
  '122105045',
  '265473812',
  '211174123'
];
const dateGen = () => qc.objectLike({
  month: makeField(qc.int.between(1, 12)),
  day: makeField(qc.int.between(1, 28)),
  year: makeField(qc.int.between(1900, 2016)),
});
const nameGen = () => qc.objectLike({
  first: makeField(qc.string.matching(/^.{4,30}$/)),
  middle: makeField(qc.string.matching(/^.{4,30}$/)),
  last: makeField(qc.string.matching(/^.{4,30}$/)),
  suffix: makeField(qc.choose(...suffixes)),
});
const addressGen = () => qc.objectLike({
  street: makeField(qc.string.matching(/^.{4,50}$/)),
  city: makeField(qc.string.matching(/^.{4,50}$/)),
  country: makeField('USA'),
  state: makeField(qc.choose(...states.USA.map(x => x.value))),
  postalCode: makeField(qc.string.matching(/^(\d{5}|\d{9})$/)),
});
const tourOfDutyGen = () => qc.objectLike({
  dateRange: qc.objectLike({
    to: dateGen(),
    from: dateGen()
  }),
  serviceBranch: makeField(qc.choose(...serviceBranches.map(x => x.value))),
  serviceStatus: makeField(qc.string),
  applyPeriodToSelected: qc.bool,
  benefitsToApplyTo: makeField(qc.string)
});
const scholarshipGen = () => qc.objectLike({
  amount: makeField(qc.string.matching(/^[$]{0,1}\d{1,5}\.\d{1,2}$/)),
  year: makeField(qc.int.between(1900, 2016))
});
const educationGen = () => qc.objectLike({
  name: makeField(qc.string),
  city: makeField(qc.string),
  state: makeField(qc.choose(...states.USA.map(x => x.value))),
  dateRange: qc.objectLike({
    to: dateGen(),
    from: dateGen()
  }),
  hours: makeField(qc.int.between(1, 500)),
  hoursType: makeField(qc.choose(...hoursTypes.map(x => x.value))),
  degreeReceived: makeField(qc.string),
  major: makeField(qc.string)
});
const employmentGen = () => qc.objectLike({
  name: makeField(qc.string),
  months: makeField(qc.int.between(1, 600)),
  licenseOrRating: makeField(qc.string),
  postMilitaryJob: makeField(qc.string)
});
const matches = (source, target) => {
  if (!_.isUndefined(source) && !_.isUndefined(target)) {
    if (_.isObject(source)) {
      return Object.keys(source).every(key => matches(source[key], target[key]));
    }

    return true;
  }

  return false;
};

function createTestVeteran() {
  return {
    benefitsRelinquished: makeField(qc.choose(...relinquishableBenefits.map(x => x.value))),
    chapter30: qc.bool,
    chapter1606: true,
    chapter32: qc.bool,
    chapter33: qc.bool,
    checkedBenefit: makeField(''),
    serviceAcademyGraduationYear: makeField(qc.int.between(1900, 2016)),
    currentlyActiveDuty: qc.objectLike({
      yes: makeField(yesNoGen()),
      onTerminalLeave: makeField(yesNoGen()),
      nonVaAssistance: makeField(yesNoGen())
    }),
    toursOfDuty: qc.arrayOf(tourOfDutyGen()),
    postHighSchoolTrainings: qc.arrayOf(educationGen()),
    faaFlightCertificatesInformation: makeField(qc.string),
    highSchoolOrGedCompletionDate: dateGen(),
    seniorRotcCommissioned: makeField(yesNoGen()),
    seniorRotc: qc.objectLike({
      commissionYear: makeField(qc.int.between(1900, 2016)),
      rotcScholarshipAmounts: qc.arrayOf(scholarshipGen())
    }),
    seniorRotcScholarshipProgram: makeField(yesNoGen()),
    civilianBenefitsAssistance: qc.bool,
    additionalContributions: qc.bool,
    activeDutyKicker: qc.bool,
    reserveKicker: qc.bool,
    activeDutyRepaying: makeField(yesNoGen()),
    activeDutyRepayingPeriod: qc.objectLike({
      to: dateGen(),
      from: dateGen()
    }),
    serviceBefore1977: qc.objectLike({
      married: makeField(yesNoGen()),
      haveDependents: makeField(yesNoGen()),
      parentDependent: makeField(yesNoGen())
    }),
    veteranFullName: nameGen(),
    veteranSocialSecurityNumber: makeField(qc.except(qc.string.matching(/^\d{9}$/), '123456789')),
    veteranDateOfBirth: dateGen(),
    gender: makeField(qc.choose('M', 'F', '')),
    hasNonMilitaryJobs: makeField(yesNoGen()),
    nonMilitaryJobs: qc.arrayOf(employmentGen()),
    veteranAddress: addressGen(),
    email: makeField('test@test.com'),
    emailConfirmation: makeField('test@test.com'),
    homePhone: makeField(qc.string.matching(/^\d{10}$/)),
    mobilePhone: makeField(qc.string.matching(/^\d{10}$/)),
    preferredContactMethod: makeField(qc.choose(...contactOptions.map(x => x.value))),
    educationType: makeField(qc.choose(...schoolTypes.map(x => x.value))),
    school: qc.objectLike({
      name: makeField(qc.string),
      address: addressGen()
    }),
    educationObjective: makeField(qc.string),
    educationStartDate: dateGen(),
    secondaryContact: qc.objectLike({
      fullName: makeField(qc.string),
      sameAddress: qc.bool,
      address: addressGen(),
      phone: makeField(qc.string.matching(/^\d{10}$/))
    }),
    bankAccount: qc.objectLike({
      accountType: makeField(qc.choose(...accountTypes.map(x => x.value))),
      accountNumber: makeField(qc.string),
      routingNumber: makeField(qc.choose(...routingNumbers))
    }),
    applyingUsingOwnBenefits: makeField(qc.choose(...ownBenefitsOptions.map(x => x.value))),
    benefitsRelinquishedDate: dateGen()
  };
}

describe('Edu benefits json schema', () => {
  it('should have matching test veteran and blank veteran shape', () => {
    const testForm = qc.objectLike(createTestVeteran())(1);
    const blankForm = createVeteran();

    expect(matches(blankForm, testForm)).to.be.true;
  });
  describe('should have matching test veteran and blank veteran shape for', () => {
    it('toursOfDuty', () => {
      const testForm = tourOfDutyGen()(1);
      const blankForm = createTour();

      expect(matches(blankForm, testForm)).to.be.true;
    });
    it('postHighSchoolTrainings', () => {
      const testForm = educationGen()(1);
      const blankForm = createEducationPeriod();

      expect(matches(blankForm, testForm)).to.be.true;
    });
    it('nonMilitaryJobs', () => {
      const testForm = employmentGen()(1);
      const blankForm = createEmploymentPeriod();

      expect(matches(blankForm, testForm)).to.be.true;
    });
    it('rotcScholarshipAmounts', () => {
      const testForm = scholarshipGen()(1);
      const blankForm = createRotcScholarship();

      expect(matches(blankForm, testForm)).to.be.true;
    });
  });
  it('should not validate a blank veteran form', () => {
    const application = JSON.parse(veteranToApplication(createVeteran()));
    const result = validate(application);
    expect(result).to.be.false;
  });
  it('should validate with minimum required fields', () => {
    const form = createVeteran();

    form.veteranFullName.first = 'Jane';
    form.veteranFullName.last = 'Testing';
    form.veteranAddress.street = '123 Test st';
    form.veteranAddress.country = 'USA';
    form.veteranAddress.state = 'VT';
    form.veteranAddress.city = 'Somewhere';
    form.veteranAddress.postalCode = '12345';

    const application = JSON.parse(veteranToApplication(form));
    const result = validate(application);
    expect(result).to.be.true;
  });
  it('should pass validation with valid generated data', function schemaTest() {
    this.timeout(10000);
    qc.forAll(qc.objectLike(createTestVeteran()), (vetForm) => {
      const application = JSON.parse(veteranToApplication(vetForm));
      const result = validate(application);

      if (!result) {
        /* eslint-disable no-console */
        console.log(JSON.stringify(application, null, 2));
        console.log(validate.errors);
        /* eslint-enable no-console */
      }
      expect(result).to.be.true;
    });
  });
});
