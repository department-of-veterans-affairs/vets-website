import { add, format } from 'date-fns';
import sinon from 'sinon';
import { expect } from 'chai';
import moment from 'moment';

import { minYear, maxYear } from 'platform/forms-system/src/js/helpers';

import {
  isValidYear,
  isWithinServicePeriod,
  startedAfterServicePeriod,
  oneDisabilityRequired,
  validateDisabilityName,
  validateBooleanGroup,
  validateAge,
  validateSeparationDate,
  isInFuture,
  isLessThan180DaysInFuture,
  title10BeforeRad,
  validateTitle10StartDate,
  requireRatedDisability,
  hasTrainingPay,
  isValidZIP,
  validateZIP,
  limitNewDisabilities,
  requireSeparationLocation,
} from '../validations';

import { getDisabilityLabels } from '../content/disabilityLabels';
import { capitalizeEachWord } from '../utils';

const formatDate = date => format(date, 'yyyy-MM-dd');
const daysFromToday = days => formatDate(add(new Date(), { days }));

describe('526 All Claims validations', () => {
  describe('hasTrainingPay', () => {
    it('returns true when form data has training pay', () => {
      const formData = {
        'view:hasTrainingPay': true,
      };
      expect(hasTrainingPay(formData)).to.be.true;
    });

    it('returns false when form data does not have training pay', () => {
      expect(hasTrainingPay({})).to.be.false;
    });
  });

  describe('isValidZIP', () => {
    it('returns true for valid 5 digit zip', () => {
      expect(isValidZIP(12345)).to.be.true;
    });

    it('returns true for valid 9 digit zip', () => {
      expect(isValidZIP('12345-7890')).to.be.true;
    });

    it('returns false for invalid zip', () => {
      expect(isValidZIP('test')).to.be.false;
    });

    it('returns true for null zip', () => {
      expect(isValidZIP(null)).to.be.true;
    });
  });

  describe('validateZIP', () => {
    it('does not add error for valid zip', () => {
      const err = {
        addError: sinon.spy(),
      };

      validateZIP(err, '12345');
      expect(err.addError.called).to.be.false;
    });

    it('adds error for invalid zip', () => {
      const err = {
        addError: sinon.spy(),
      };

      validateZIP(err, 'happy halloween!');
      expect(err.addError.called).to.be.true;
    });
  });

  describe('isValidYear', () => {
    it('should add an error if the year is not a number', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, 'asdf');
      expect(err.addError.called).to.be.true;
    });

    it('should add an error if the year contains more than just four digits', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '1990asdf');
      expect(err.addError.called).to.be.true;
    });

    it(`should add an error if the year is less than ${minYear}`, () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, minYear - 1);
      expect(err.addError.called).to.be.true;
    });

    it(`should add an error if the year is more than ${maxYear}`, () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, maxYear + 1);
      expect(err.addError.called).to.be.true;
    });

    it(`should not add an error if the year is between ${minYear} and ${maxYear}`, () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '2010');
      expect(err.addError.called).to.be.false;
    });

    it('should add an error if the year is in the future', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, maxYear - 1);
      expect(err.addError.called).to.be.true;
    });
    describe('oneDisabilityRequired', () => {
      it('should not add an error if at least one disability is selected', () => {
        const err = {
          addError: sinon.spy(),
        };
        const formData = {
          ratedDisabilities: [
            {
              unemployabilityDisability: true,
            },
          ],
          newDisabilities: [
            {
              unemployabilityDisability: false,
            },
          ],
        };
        oneDisabilityRequired('rated')(err, null, formData);
        expect(err.addError.called).to.be.false;
      });
      it('should add an error if no disabilities are selected', () => {
        const err = {
          addError: sinon.spy(),
        };
        const formData = {
          ratedDisabilities: [],
          newDisabilities: [],
        };
        oneDisabilityRequired('rated')(err, null, formData);
        expect(err.addError.called).to.be.true;
      });
    });
  });

  describe('startedAfterServicePeriod', () => {
    it('should add error if treatment start date is before earliest active service start date', () => {
      const err = { addError: sinon.spy() };

      const formData = {
        serviceInformation: {
          servicePeriods: [
            { dateRange: { from: '2003-03-12' }, serviceBranch: 'Army' },
            {
              dateRange: { from: '2000-01-14' },
              serviceBranch: 'Army Reserves',
            },
            { dateRange: { from: '2011-12-25' }, serviceBranch: 'Army' },
            // ignored
            {
              dateRange: { from: '1990-10-11' },
              serviceBranch: '', // missing branch name
            },
          ],
        },
      };

      startedAfterServicePeriod(err, '1999-12-XX', formData);
      expect(err.addError.calledOnce).to.be.true;
    });

    it('should not add error if treatment start date monthYear is the same as earliest active service start date', () => {
      const err = { addError: sinon.spy() };

      const formData = {
        serviceInformation: {
          servicePeriods: [
            { dateRange: { from: '2003-03-12' }, serviceBranch: 'Army' },
            {
              dateRange: { from: '2000-01-14' },
              serviceBranch: 'Coast Guard Reserves',
            },
            { dateRange: { from: '2011-12-25' }, serviceBranch: 'Coast Guard' },
            // ignored
            {
              dateRange: { from: '1990-10-11' },
              serviceBranch: '',
            },
          ],
        },
      };

      startedAfterServicePeriod(err, '2000-01-XX', formData);
      expect(err.addError.called).to.be.false;
    });

    it('should not add error if treatment start date is after earliest active service start date', () => {
      const err = { addError: sinon.spy() };

      const formData = {
        serviceInformation: {
          servicePeriods: [
            { dateRange: { from: '2003-03-12' }, serviceBranch: 'Army' },
            {
              dateRange: { from: '2000-01-14' },
              serviceBranch: 'Army National Guard',
            },
            { dateRange: { from: '2011-12-25' }, serviceBranch: 'Army' },
            // ignored
            {
              dateRange: { from: '1990-10-11' },
              serviceBranch: '',
            },
          ],
        },
      };

      startedAfterServicePeriod(err, '2000-02-XX', formData);
      expect(err.addError.called).to.be.false;
    });

    it('should not add error if serviceInformation is missing', () => {
      const err = { addError: sinon.spy() };

      const formData = {};

      startedAfterServicePeriod(err, '1999-12-XX', formData);
      expect(err.addError.called).to.be.false;
    });

    it('should not add error if servicePeriod is missing', () => {
      const err = { addError: sinon.spy() };

      const formData = { serviceInformation: {} };

      startedAfterServicePeriod(err, '1999-12-XX', formData);
      expect(err.addError.called).to.be.false;
    });

    it('should not add error if servicePeriod is not an array', () => {
      const err = { addError: sinon.spy() };

      const formData = {
        serviceInformation: {
          servicePeriods: 12,
        },
      };

      startedAfterServicePeriod(err, '1999-12-XX', formData);
      expect(err.addError.called).to.be.false;
    });

    it('should not add error if servicePeriod is empty', () => {
      const err = { addError: sinon.spy() };

      const formData = {
        serviceInformation: { servicePeriods: [] },
      };

      startedAfterServicePeriod(err, '1999-12-XX', formData);
      expect(err.addError.called).to.be.false;
    });
  });

  describe('isWithinServicePeriod', () => {
    const appStateData = {
      serviceInformation: {
        servicePeriods: [
          { dateRange: { from: '2001-03-21', to: '2014-07-21' } },
          { dateRange: { from: '2015-01-01', to: '2017-05-13' } },
        ],
      },
    };

    it('should not add an error when date range is within a service period', () => {
      const err = {
        from: { addError: sinon.spy() },
        to: { addError: sinon.spy() },
      };
      isWithinServicePeriod(
        err,
        { from: '2014-07-01', to: '2014-07-20' },
        null,
        null,
        null,
        null,
        appStateData,
      );
      expect(err.from.addError.called).to.be.false;
      expect(err.to.addError.called).to.be.false;
    });

    it('should not add an error when with incomplete date ranges', () => {
      const err = {
        from: { addError: sinon.spy() },
        to: { addError: sinon.spy() },
      };
      isWithinServicePeriod(
        err,
        { from: '2014-07-01', to: '2014-07-XX' },
        null,
        null,
        null,
        null,
        appStateData,
      );
      expect(err.from.addError.called).to.be.false;
      expect(err.to.addError.called).to.be.false;
    });

    it('should add an error when date range is within a service period', () => {
      const err = {
        from: { addError: sinon.spy() },
        to: { addError: sinon.spy() },
      };
      isWithinServicePeriod(
        err,
        { from: '2014-07-01', to: '2014-07-30' },
        null,
        null,
        null,
        null,
        appStateData,
      );
      expect(err.from.addError.called).to.be.true;
      expect(err.to.addError.called).to.be.true;
    });

    it('should add an error when date range is within a service period', () => {
      const err = {
        from: { addError: sinon.spy() },
        to: { addError: sinon.spy() },
      };
      isWithinServicePeriod(
        err,
        { from: '2014-08-01', to: '2014-08-10' },
        null,
        null,
        null,
        null,
        appStateData,
      );
      expect(err.from.addError.called).to.be.true;
      expect(err.to.addError.called).to.be.true;
    });
  });

  describe('validateDisabilityName', () => {
    const tooLong =
      'et pharetra pharetra massa massa ultricies mi quis hendrerit dolor magna eget est lorem ipsum dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas integer eget aliquet nibh praesent';

    it('should not throw a JS error when there is no data', () => {
      const err = { addError: sinon.spy() };
      validateDisabilityName(err);
      expect(err.addError.calledOnce).to.be.true;
    });
    it('should not add error when disability is in list', () => {
      const err = { addError: sinon.spy() };
      validateDisabilityName(err, getDisabilityLabels()[300]);
      expect(err.addError.called).to.be.false;
    });
    it('should not add error when disability is in list but capitalization is different', () => {
      const err = { addError: sinon.spy() };
      validateDisabilityName(
        err,
        capitalizeEachWord(getDisabilityLabels()[300]),
      );
      expect(err.addError.called).to.be.false;
    });
    it('should not add error when disability not in list but length OK', () => {
      const err = { addError: sinon.spy() };
      validateDisabilityName(err, 'blah. (and, blah/blah)’- blah');
      expect(err.addError.called).to.be.false;
    });
    it('should add error when disability not in list and length too long', () => {
      const err = { addError: sinon.spy() };
      validateDisabilityName(err, tooLong);
      expect(err.addError.calledOnce).to.be.true;
    });
    it('should add error when duplicate names are encountered', () => {
      const _ = null;
      const err = { addError: sinon.spy() };
      const test = condition =>
        validateDisabilityName(err, condition, _, _, _, _, {
          newDisabilities: [{ condition: 'diabetes type 2' }, { condition }],
        });

      test('DiaBeTes type 2');
      expect(err.addError.callCount).to.eq(1);
      test('DIABETES TYPE 2');
      expect(err.addError.callCount).to.eq(2);
      test('diabetes type (2)');
      expect(err.addError.callCount).to.eq(3);
    });
  });

  describe('validateBooleanGroup', () => {
    it('should add error if no props are true', () => {
      const errors = { addError: sinon.spy() };
      validateBooleanGroup(errors, { tests: false }, null, {
        properties: { tests: 'string' },
      });

      expect(errors.addError.called).to.be.true;
    });

    it('should add error if empty object', () => {
      const errors = { addError: sinon.spy() };
      validateBooleanGroup(errors, {}, null, {
        properties: { tests: 'string' },
      });

      expect(errors.addError.called).to.be.true;
    });

    it('should add error if true prop isnt in the schema', () => {
      const errors = { addError: sinon.spy() };
      validateBooleanGroup(errors, { testz: true, tests: false }, null, {
        properties: { tests: 'string' },
      });

      expect(errors.addError.called).to.be.true;
    });

    it('should not add error if at least one prop is true', () => {
      const errors = { addError: sinon.spy() };
      validateBooleanGroup(errors, { tests: true }, null, {
        properties: { tests: 'string' },
      });

      expect(errors.addError.called).to.be.false;
    });

    it('should use custom message', () => {
      const errors = { addError: sinon.spy() };
      validateBooleanGroup(
        errors,
        { tests: false },
        null,
        {
          properties: { tests: 'string' },
        },
        {
          atLeastOne: 'testing',
        },
      );

      expect(errors.addError.firstCall.args[0]).to.equal('testing');
    });

    it('should add error if user group and props missing', () => {
      const errors = { addError: sinon.spy() };
      validateBooleanGroup(errors, { tests: false }, null, {});

      expect(errors.addError.called).to.be.true;
    });
  });

  describe('validateAge', () => {
    const _ = null;
    it('should not allow age < 13 years at start of service', () => {
      const errors = { addError: sinon.spy() };
      const dob = '2000-01-01';
      // 13th birthday (needs to be _after_ 13th birthday)
      const age = formatDate(add(new Date(dob), { years: 13, days: -1 }));
      validateAge(errors, age, _, _, _, _, { dob });

      expect(errors.addError.called).to.be.true;
      expect(errors.addError.args[0][0]).to.contain('after your 13th birthday');
    });
    it('should allow age 13 years at start of service', () => {
      const errors = { addError: sinon.spy() };
      const dob = '2000-01-01';
      // Add 1 extra day to ensure we're after 13th birthday
      const age = formatDate(add(new Date(dob), { years: 13, days: 1 }));
      validateAge(errors, age, _, _, _, _, { dob });

      expect(errors.addError.called).to.be.false;
    });
  });

  describe('validateSeparationDate', () => {
    const _ = null;
    // builds the appStateData object
    const data = ({ bdd = false, branch = 'Army' } = {}) => ({
      isBDD: bdd,
      servicePeriods: [{ serviceBranch: branch }],
    });

    const pastDate = daysFromToday(-100);
    const futureDate = daysFromToday(100);

    it('should allow past end service dates for all-claims', () => {
      const errors = { addError: sinon.spy() };
      validateSeparationDate(errors, pastDate, _, _, _, 0, data());

      expect(errors.addError.called).to.be.false;
    });

    it('should not allow future end service dates for active service all-claims', () => {
      const errors = { addError: sinon.spy() };
      const index = 0;
      validateSeparationDate(errors, futureDate, _, _, _, index, data());

      expect(errors.addError.called).to.be.true;
      expect(errors.addError.args[0][index]).to.contain('be in the past');
    });

    it('should allow future end service dates for all-claims when in the reserves', () => {
      const errors = { addError: sinon.spy() };
      validateSeparationDate(
        errors,
        futureDate,
        _,
        _,
        _,
        0,
        data({ branch: 'Army Reserves' }),
      );

      expect(errors.addError.called).to.be.false;
    });

    it('should allow past end service dates for BDD', () => {
      const errors = { addError: sinon.spy() };
      validateSeparationDate(errors, pastDate, _, _, _, 0, data({ bdd: true }));

      expect(errors.addError.called).to.be.false;
    });

    it('should allow future end service dates for BDD', () => {
      const err = { addError: sinon.spy() };
      validateSeparationDate(err, futureDate, _, _, _, 0, data({ bdd: true }));

      expect(err.addError.called).to.be.false;
    });

    // assuming this person has been activated
    it('should allow future end service dates for BDD when in the reserves', () => {
      const errors = { addError: sinon.spy() };
      validateSeparationDate(
        errors,
        futureDate,
        _,
        _,
        _,
        0,
        data({
          bdd: true,
          branch: 'Army Reserves',
        }),
      );

      expect(errors.addError.called).to.be.false;
    });

    it('should not allow future end service dates > 180 days', () => {
      const errors = { addError: sinon.spy() };
      const index = 0;
      validateSeparationDate(
        errors,
        daysFromToday(181),
        _,
        _,
        _,
        index,
        data({
          bdd: true,
          branch: 'Army',
        }),
      );

      expect(errors.addError.called).to.be.true;
      expect(errors.addError.args[0][index]).to.contain('before 180 days');
    });

    it('should allow non-BDD future end service dates < 90 days for any type of service', () => {
      const errors = { addError: sinon.spy() };
      const index = 0;
      validateSeparationDate(
        errors,
        daysFromToday(89),
        _,
        _,
        _,
        index,
        data({ branch: 'Army' }),
      );

      expect(errors.addError.called).to.be.false;
    });

    it('should set error for reservist with separation date > 180 days', () => {
      const errors = { addError: sinon.spy() };
      const index = 0;
      validateSeparationDate(
        errors,
        daysFromToday(181),
        _,
        _,
        _,
        index,
        data({
          bdd: false,
          branch: 'Reserve',
        }),
      );

      expect(errors.addError.called).to.be.true;
      expect(errors.addError.args[0][index]).to.contain(
        'you will need to wait',
      );
    });
  });

  describe('isInFuture', () => {
    it('adds an error when entered date is today or earlier', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const fieldData = '2018-04-12';

      isInFuture(errors, fieldData);
      expect(addError.calledOnce).to.be.true;
    });

    it('does not add an error when the entered date is in the future', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const fieldData = '2099-04-12';

      isInFuture(errors, fieldData);
      expect(addError.callCount).to.equal(0);
    });
  });

  describe('isLessThan180DaysInFuture', () => {
    it('adds an error when date is > 180 days in the future', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const fieldData = daysFromToday(190);

      isLessThan180DaysInFuture(errors, fieldData);
      expect(addError.calledOnce).to.be.true;
    });

    it('does not add an error when the entered date is < 180 days in the future', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const fieldData = daysFromToday(170);

      isLessThan180DaysInFuture(errors, fieldData);
      expect(addError.callCount).to.equal(0);
    });

    it('adds error when separation date is in the past', () => {
      const errors = { addError: sinon.spy() };
      const fieldData = daysFromToday(-10);

      isLessThan180DaysInFuture(errors, fieldData);

      expect(errors.addError.called).to.be.true;
    });
  });

  describe('title10BeforeRad', () => {
    const getErrors = addError => ({
      reservesNationalGuardService: {
        title10Activation: {
          anticipatedSeparationDate: {
            addError,
          },
        },
      },
    });
    const getData = (start, end) => ({
      reservesNationalGuardService: {
        title10Activation: {
          title10ActivationDate: daysFromToday(start),
          anticipatedSeparationDate: daysFromToday(end),
        },
      },
    });
    it('adds an error when date is > 180 days in the future', () => {
      const addError = sinon.spy();
      const errors = getErrors(addError);
      const fieldData = getData(150, 140);

      title10BeforeRad(errors, fieldData);
      expect(addError.calledOnce).to.be.true;
    });

    it('does not add an error when the entered date is < 180 days in the future', () => {
      const addError = sinon.spy();
      const errors = getErrors(addError);
      const fieldData = getData(140, 150);

      title10BeforeRad(errors, fieldData);
      expect(addError.callCount).to.equal(0);
    });

    it('does not add errors for empty page data', () => {
      const addError = sinon.spy();
      const errors = getErrors(addError);

      title10BeforeRad(errors);
      expect(addError.callCount).to.equal(0);
    });
  });

  describe('validateTitle10StartDate', () => {
    const _ = null;
    it('should not show an error for an activation date after start date', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const formData = {
        servicePeriods: [
          { serviceBranch: 'Reserves', dateRange: { from: '2003-03-12' } },
          { serviceBranch: 'Reserves', dateRange: { from: '2000-01-14' } },
        ],
      };
      validateTitle10StartDate(errors, '2001-01-01', _, _, _, _, formData);
      expect(addError.called).to.be.false;
    });

    it('should show an error for an activation date before start date', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const data = {
        servicePeriods: [
          { serviceBranch: 'Reserves', dateRange: { from: '2003-03-12' } },
          { serviceBranch: 'Reserves', dateRange: { from: '2000-01-14' } },
          { serviceBranch: 'Reserves', dateRange: { from: '2005-12-25' } },
        ],
      };
      validateTitle10StartDate(errors, '1999-12-31', _, _, _, _, data);
      expect(addError.called).to.be.true;
    });

    it('should show an error for an activation date before start date after filtering out active duty periods', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const data = {
        servicePeriods: [
          { serviceBranch: 'Army', dateRange: { from: '2000-01-14' } },
          { serviceBranch: 'Reserves', dateRange: { from: '2003-03-12' } },
          { serviceBranch: 'Navy', dateRange: { from: '2005-12-25' } },
        ],
      };
      validateTitle10StartDate(errors, '2001-12-31', _, _, _, _, data);
      expect(addError.called).to.be.true;
    });

    // should never happen since the page is only shown if a Veteran includes
    // a Reserve/National Guard period
    it('should show an error if there are no Reserve/National Guard periods', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const data = {
        servicePeriods: [
          { serviceBranch: 'Army', dateRange: { from: '2003-03-12' } },
          { serviceBranch: 'Navy', dateRange: { from: '2000-01-14' } },
          { serviceBranch: 'Marines', dateRange: { from: '2005-12-25' } },
        ],
      };
      validateTitle10StartDate(errors, '2010-12-31', _, _, _, _, data);
      expect(addError.called).to.be.true;
    });
  });

  describe('requireRatedDisability', () => {
    it('should add error when claiming increase and a rated disability is not selected', () => {
      const err = { addError: sinon.spy() };
      const formData = {
        'view:claimType': {
          'view:claimingIncrease': true,
        },
        ratedDisabilities: [
          {
            unemployabilityDisability: false,
          },
        ],
        newDisabilities: [
          {
            unemployabilityDisability: false,
          },
        ],
      };

      requireRatedDisability(err, {}, formData);
      expect(err.addError.called).to.be.true;
    });
  });

  describe('limitNewDisabilities', () => {
    it('should add error when more than 100 disabilities', () => {
      const err = { addError: sinon.spy() };
      const newDisabilities = Array(101);
      const formData = { newDisabilities };

      limitNewDisabilities(err, null, formData);
      expect(err.addError.called).to.be.true;
    });
  });

  describe('requireSeparationLocation', () => {
    const getDays = days =>
      moment()
        .add(days, 'days')
        .format('YYYY-MM-DD');
    const getFormData = (activeDate, reserveDate) => ({
      serviceInformation: {
        servicePeriods: [{ dateRange: { to: activeDate } }],
        reservesNationalGuardService: {
          title10Activation: {
            anticipatedSeparationDate: reserveDate,
          },
        },
      },
    });

    it('should add error when missing separation location selection', () => {
      const err = { addError: sinon.spy() };

      requireSeparationLocation(err, {}, getFormData('', getDays(1)));
      expect(err.addError.called).to.be.true;
    });
  });
});
