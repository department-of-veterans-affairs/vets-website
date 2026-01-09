import { add, format, subDays, addDays } from 'date-fns';
import sinon from 'sinon';
import { expect } from 'chai';

import { minYear, maxYear } from 'platform/forms-system/src/js/helpers';
import {
  parseDate,
  isTreatmentBeforeService,
  findEarliestServiceDate,
  isMonthOnly,
  isYearOnly,
  isYearMonth,
} from '../utils/dates';
import { DATE_TEMPLATE } from '../utils/dates/formatting';

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
import {
  validateToxicExposureGulfWar1990Dates,
  validateToxicExposureGulfWar2001Dates,
  validateToxicExposureDates,
} from '../utils/validations';

import { getDisabilityLabels } from '../content/disabilityLabels';
import { capitalizeEachWord } from '../utils';

const formatDate = date => format(date, DATE_TEMPLATE);
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
      const err = { addError: sinon.spy() };
      isValidYear(err, 'asdf');
      expect(err.addError.called).to.be.true;

      const err2 = { addError: sinon.spy() };
      isValidYear(err2, '');
      expect(err2.addError.called).to.be.true;

      const err3 = { addError: sinon.spy() };
      isValidYear(err3, null);
      expect(err3.addError.called).to.be.true;

      const err4 = { addError: sinon.spy() };
      isValidYear(err4, undefined);
      expect(err4.addError.called).to.be.true;
    });

    it('should add an error if the year contains more than just four digits', () => {
      const err = { addError: sinon.spy() };
      isValidYear(err, '1990asdf');
      expect(err.addError.called).to.be.true;
    });

    it(`should add an error if the year is less than ${minYear}`, () => {
      const err = { addError: sinon.spy() };
      isValidYear(err, minYear - 1);
      expect(err.addError.called).to.be.true;
    });

    it(`should add an error if the year is more than ${maxYear}`, () => {
      const err = { addError: sinon.spy() };
      isValidYear(err, maxYear + 1);
      expect(err.addError.called).to.be.true;
    });

    it(`should not add an error if the year is between ${minYear} and ${maxYear}`, () => {
      const err = { addError: sinon.spy() };
      isValidYear(err, '2010');
      expect(err.addError.called).to.be.false;
    });

    it('should add an error if the year is in the future', () => {
      const err = { addError: sinon.spy() };
      isValidYear(err, maxYear - 1);
      expect(err.addError.called).to.be.true;
    });

    it('should add an error for years that are not exactly 4 digits', () => {
      const err = { addError: sinon.spy() };
      isValidYear(err, '123');
      expect(err.addError.called).to.be.true;

      const err2 = { addError: sinon.spy() };
      isValidYear(err2, '12');
      expect(err2.addError.called).to.be.true;

      const err3 = { addError: sinon.spy() };
      isValidYear(err3, '12345');
      expect(err3.addError.called).to.be.true;
    });

    it('should add an error for years with leading zeros', () => {
      const err = { addError: sinon.spy() };
      isValidYear(err, '0123');
      expect(err.addError.called).to.be.true;
    });

    describe('should test boundary years correctly', () => {
      let getFullYearStub;
      beforeEach(() => {
        // make 3000 the "current" year
        getFullYearStub = sinon
          .stub(Date.prototype, 'getFullYear')
          .returns(3000);
      });
      afterEach(() => {
        getFullYearStub.restore();
      });

      it('should test exact boundaries when current year is 3000', () => {
        const err1900 = { addError: sinon.spy() };
        isValidYear(err1900, '1900');
        expect(err1900.addError.called).to.be.false;

        const err3000 = { addError: sinon.spy() };
        isValidYear(err3000, '3000');
        expect(err3000.addError.called).to.be.false;

        const err1899 = { addError: sinon.spy() };
        isValidYear(err1899, '1899');
        expect(err1899.addError.called).to.be.true;

        const err3001 = { addError: sinon.spy() };
        isValidYear(err3001, '3001');
        expect(err3001.addError.called).to.be.true;
      });
    });

    it('should test current year', () => {
      const currentYear = new Date().getFullYear();
      const err = { addError: sinon.spy() };
      isValidYear(err, currentYear.toString());
      expect(err.addError.called).to.be.false;
    });

    it('should add error for future years', () => {
      const nextYear = new Date().getFullYear() + 1;
      const err = { addError: sinon.spy() };
      isValidYear(err, nextYear.toString());
      expect(err.addError.called).to.be.true;
    });

    it('should handle numeric input types', () => {
      const err = { addError: sinon.spy() };
      isValidYear(err, 2010);
      expect(err.addError.called).to.be.false;
    });
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

    it('should not add error if treatment start date year is the same as earliest active service start date year', () => {
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

      startedAfterServicePeriod(err, '2000-XX-XX', formData);
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

    it('should add error if only treatment start date month is entered', () => {
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

      startedAfterServicePeriod(err, 'XXXX-12-XX', formData);
      expect(err.addError.calledOnce).to.be.true;
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

    describe('dates within service periods', () => {
      it('should not add an error when date range is within first service period', () => {
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

      it('should not add an error when date range is within second service period', () => {
        const err = {
          from: { addError: sinon.spy() },
          to: { addError: sinon.spy() },
        };
        isWithinServicePeriod(
          err,
          { from: '2016-01-01', to: '2016-12-31' },
          null,
          null,
          null,
          null,
          appStateData,
        );
        expect(err.from.addError.called).to.be.false;
        expect(err.to.addError.called).to.be.false;
      });

      it('should not add an error when date range spans exactly one service period', () => {
        const err = {
          from: { addError: sinon.spy() },
          to: { addError: sinon.spy() },
        };
        isWithinServicePeriod(
          err,
          { from: '2001-03-21', to: '2014-07-21' },
          null,
          null,
          null,
          null,
          appStateData,
        );
        expect(err.from.addError.called).to.be.false;
        expect(err.to.addError.called).to.be.false;
      });
    });

    describe('dates outside service periods', () => {
      it('should add an error when date range is before all service periods', () => {
        const err = {
          from: { addError: sinon.spy() },
          to: { addError: sinon.spy() },
        };
        isWithinServicePeriod(
          err,
          { from: '2000-01-01', to: '2000-12-31' },
          null,
          null,
          null,
          null,
          appStateData,
        );
        expect(err.from.addError.called).to.be.true;
        expect(err.to.addError.called).to.be.true;
      });

      it('should add an error when date range is after all service periods', () => {
        const err = {
          from: { addError: sinon.spy() },
          to: { addError: sinon.spy() },
        };
        isWithinServicePeriod(
          err,
          { from: '2018-01-01', to: '2018-12-31' },
          null,
          null,
          null,
          null,
          appStateData,
        );
        expect(err.from.addError.called).to.be.true;
        expect(err.to.addError.called).to.be.true;
      });

      it('should add an error when date range extends beyond service period end', () => {
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
    });

    describe('multiple service periods handling', () => {
      it('should correctly validate against one service period when another period would fail', () => {
        const err = {
          from: { addError: sinon.spy() },
          to: { addError: sinon.spy() },
        };
        isWithinServicePeriod(
          err,
          { from: '2002-01-01', to: '2002-12-31' }, // Only valid in first period
          null,
          null,
          null,
          null,
          appStateData,
        );
        expect(err.from.addError.called).to.be.false;
        expect(err.to.addError.called).to.be.false;
      });

      it('should handle empty service periods array', () => {
        const err = {
          from: { addError: sinon.spy() },
          to: { addError: sinon.spy() },
        };
        const emptyAppStateData = {
          serviceInformation: {
            servicePeriods: [],
          },
        };
        isWithinServicePeriod(
          err,
          { from: '2014-07-01', to: '2014-07-20' },
          null,
          null,
          null,
          null,
          emptyAppStateData,
        );
        expect(err.from.addError.called).to.be.true;
        expect(err.to.addError.called).to.be.true;
      });
    });

    describe('appropriate error messages', () => {
      it('should add correct error message to from field', () => {
        const err = {
          from: { addError: sinon.spy() },
          to: { addError: sinon.spy() },
        };
        isWithinServicePeriod(
          err,
          { from: '2018-01-01', to: '2018-12-31' },
          null,
          null,
          null,
          null,
          appStateData,
        );

        expect(err.from.addError.called).to.be.true;
      });

      it('should add correct error message to to field', () => {
        const err = {
          from: { addError: sinon.spy() },
          to: { addError: sinon.spy() },
        };
        isWithinServicePeriod(
          err,
          { from: '2018-01-01', to: '2018-12-31' },
          null,
          null,
          null,
          null,
          appStateData,
        );

        expect(
          err.to.addError.calledWith('Please provide your service periods'),
        ).to.be.true;
      });
    });

    describe('incomplete date handling', () => {
      it('should not add an error when from date is incomplete', () => {
        const err = {
          from: { addError: sinon.spy() },
          to: { addError: sinon.spy() },
        };
        isWithinServicePeriod(
          err,
          { from: '2014-07-XX', to: '2014-07-30' },
          null,
          null,
          null,
          null,
          appStateData,
        );
        expect(err.from.addError.called).to.be.false;
        expect(err.to.addError.called).to.be.false;
      });

      it('should not add an error when to date is incomplete', () => {
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

      it('should not add an error when both dates are incomplete', () => {
        const err = {
          from: { addError: sinon.spy() },
          to: { addError: sinon.spy() },
        };
        isWithinServicePeriod(
          err,
          { from: '2014-XX-XX', to: '2014-07-XX' },
          null,
          null,
          null,
          null,
          appStateData,
        );
        expect(err.from.addError.called).to.be.false;
        expect(err.to.addError.called).to.be.false;
      });
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
    it('should add an error when disability is an empty string', () => {
      const err = { addError: sinon.spy() };
      validateDisabilityName(err, '  ');
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
    it('should not allow age <= 13 years at start of service', () => {
      const errors = { addError: sinon.spy() };
      const dob = '2000-01-01';
      // 13th birthday (needs to be _after_ 13th birthday)
      const age = formatDate(add(new Date(dob), { years: 13, days: 0 }));
      validateAge(errors, age, _, _, _, _, { dob });

      expect(errors.addError.called).to.be.true;
      expect(errors.addError.args[0][0]).to.contain('after your 13th birthday');
    });
    it('should allow age > 13 years at start of service', () => {
      const errors = { addError: sinon.spy() };
      const dob = '2000-01-01';
      // Add 2 extra days to ensure we're after 13th birthday
      const age = formatDate(add(new Date(dob), { years: 13, days: 2 })); // This test was failing with days: 1
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

    it('should add error for invalid date formats', () => {
      const errors = { addError: sinon.spy() };
      validateSeparationDate(errors, 'invalid-date', _, _, _, 0, data());

      expect(errors.addError.called).to.be.true;
      expect(errors.addError.args[0][0]).to.contain('is not a real date');
    });

    it('should add error for empty date string', () => {
      const errors = { addError: sinon.spy() };
      validateSeparationDate(errors, '', _, _, _, 0, data());

      expect(errors.addError.called).to.be.true;
      expect(errors.addError.args[0][0]).to.contain('is not a real date');
    });

    it('should add error for malformed date', () => {
      const errors = { addError: sinon.spy() };
      validateSeparationDate(errors, '2025-13-45', _, _, _, 0, data());

      expect(errors.addError.called).to.be.true;
      expect(errors.addError.args[0][0]).to.contain('is not a real date');
    });

    it('should add error for null/undefined date', () => {
      const errors = { addError: sinon.spy() };
      validateSeparationDate(errors, null, _, _, _, 0, data());

      expect(errors.addError.called).to.be.true;
      expect(errors.addError.args[0][0]).to.contain('is not a real date');
    });
  });

  describe('isInFuture', () => {
    it('adds an error when entered date is in the past', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const yesterday = format(subDays(new Date(), 1), DATE_TEMPLATE);

      isInFuture(errors, yesterday);
      expect(addError.calledOnce).to.be.true;
      expect(addError.args[0][0]).to.equal('Start date must be in the future');
    });

    it('adds an error when entered date is today', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const today = format(new Date(), DATE_TEMPLATE);

      isInFuture(errors, today);

      expect(addError.calledOnce).to.be.true;
      expect(addError.args[0][0]).to.equal('Start date must be in the future');
    });

    it('does not add an error when the entered date is in the future', () => {
      const addError = sinon.spy();
      const errors = { addError };
      // Use 2 days in the future to avoid time-of-day issues
      const tomorrow = format(addDays(new Date(), 2), DATE_TEMPLATE);

      isInFuture(errors, tomorrow);
      expect(addError.callCount).to.equal(0);
    });
  });

  describe('isLessThan180DaysInFuture', () => {
    it('adds an error when date is > 180 days in the future', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 190);
      const fieldData = futureDate.toISOString().split('T')[0];

      isLessThan180DaysInFuture(errors, fieldData);
      expect(addError.calledOnce).to.be.true;
    });

    it('does not add an error when the entered date is < 180 days in the future', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 170);
      const fieldData = futureDate.toISOString().split('T')[0];

      isLessThan180DaysInFuture(errors, fieldData);
      expect(addError.callCount).to.equal(0);
    });

    it('adds error for more than 180 days in the future', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 181);
      const fieldData = futureDate.toISOString().split('T')[0];

      isLessThan180DaysInFuture(errors, fieldData);
      expect(addError.calledOnce).to.be.true;
    });

    it('adds error when separation date is in the past', () => {
      const errors = { addError: sinon.spy() };
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);
      const fieldData = pastDate.toISOString().split('T')[0];

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

    const getData = (activationDate, separationDate) => ({
      reservesNationalGuardService: {
        title10Activation: {
          title10ActivationDate: activationDate,
          anticipatedSeparationDate: separationDate,
        },
      },
    });

    describe('chronological order validation', () => {
      it('adds an error when separation date is before activation date', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);
        const fieldData = getData(daysFromToday(150), daysFromToday(140));

        title10BeforeRad(errors, fieldData);

        expect(addError.calledOnce).to.be.true;
        expect(addError.args[0][0]).to.contain('after your activation date');
      });

      it('does not add an error when separation date is after activation date', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);
        const fieldData = getData(daysFromToday(140), daysFromToday(150));

        title10BeforeRad(errors, fieldData);

        expect(addError.callCount).to.equal(0);
      });

      it('does not add an error when separation date equals activation date', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);
        const fieldData = getData(daysFromToday(140), daysFromToday(140));

        title10BeforeRad(errors, fieldData);

        expect(addError.callCount).to.equal(0);
      });
    });

    describe('invalid date handling', () => {
      it('does not add errors for invalid activation date', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);
        const fieldData = getData('invalid-date', daysFromToday(150));

        title10BeforeRad(errors, fieldData);

        expect(addError.callCount).to.equal(0);
      });

      it('does not add errors for invalid separation date', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);
        const fieldData = getData(daysFromToday(140), 'invalid-date');

        title10BeforeRad(errors, fieldData);

        expect(addError.callCount).to.equal(0);
      });

      it('does not add errors when both dates are invalid', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);
        const fieldData = getData('invalid-activation', 'invalid-separation');

        title10BeforeRad(errors, fieldData);

        expect(addError.callCount).to.equal(0);
      });
    });

    describe('missing data handling', () => {
      it('does not add errors for empty page data', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);

        title10BeforeRad(errors);

        expect(addError.callCount).to.equal(0);
      });

      it('does not add errors for missing reservesNationalGuardService', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);
        const fieldData = {};

        title10BeforeRad(errors, fieldData);

        expect(addError.callCount).to.equal(0);
      });

      it('does not add errors for missing title10Activation', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);
        const fieldData = {
          reservesNationalGuardService: {},
        };

        title10BeforeRad(errors, fieldData);

        expect(addError.callCount).to.equal(0);
      });

      it('does not add errors for missing activation date only', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);
        const fieldData = {
          reservesNationalGuardService: {
            title10Activation: {
              title10ActivationDate: null,
              anticipatedSeparationDate: daysFromToday(150),
            },
          },
        };

        title10BeforeRad(errors, fieldData);

        expect(addError.calledOnce).to.be.false;
      });

      it('does not add errors for missing separation date only', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);
        const fieldData = {
          reservesNationalGuardService: {
            title10Activation: {
              title10ActivationDate: daysFromToday(140),
              anticipatedSeparationDate: null,
            },
          },
        };

        title10BeforeRad(errors, fieldData);

        expect(addError.calledOnce).to.be.false;
      });

      it('does not add errors when both dates are null', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);
        const fieldData = getData(null, null);

        title10BeforeRad(errors, fieldData);

        expect(addError.callCount).to.equal(0);
      });

      it('does not add errors when both dates are undefined', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);
        const fieldData = getData(undefined, undefined);

        title10BeforeRad(errors, fieldData);

        expect(addError.callCount).to.equal(0);
      });

      it('does not add errors when both dates are empty strings', () => {
        const addError = sinon.spy();
        const errors = getErrors(addError);
        const fieldData = getData('', '');

        title10BeforeRad(errors, fieldData);

        expect(addError.callCount).to.equal(0);
      });
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

    it('should show an error for an activation date in the future', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const data = {
        servicePeriods: [
          { serviceBranch: 'Reserves', dateRange: { from: '2003-03-12' } },
          { serviceBranch: 'Reserves', dateRange: { from: '2000-01-14' } },
          { serviceBranch: 'Reserves', dateRange: { from: '2005-12-25' } },
        ],
      };
      validateTitle10StartDate(errors, daysFromToday(1), _, _, _, _, data);
      expect(addError.called).to.be.true;
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

    it('should not show an error for the same activation date as earliest service start', () => {
      const addError = sinon.spy();
      const errors = { addError };
      const data = {
        servicePeriods: [
          { serviceBranch: 'Reserves', dateRange: { from: '2000-01-14' } },
        ],
      };
      validateTitle10StartDate(errors, '2000-01-14', _, _, _, _, data);
      expect(addError.called).to.be.false;
    });

    it('should show an error for empty appStateData', () => {
      const addError = sinon.spy();
      const errors = { addError };

      validateTitle10StartDate(errors, '2001-01-01', _, _, _, _, {});
      expect(addError.called).to.be.true;
    });

    it('should show an error for undefined appStateData', () => {
      const addError = sinon.spy();
      const errors = { addError };

      validateTitle10StartDate(errors, '2001-01-01', _, _, _, _, undefined);
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
    const getDays = days => format(addDays(new Date(), days), DATE_TEMPLATE);
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

  describe('helper functions', () => {
    describe('isMonthOnly', () => {
      it('should return true for valid month-only format (XXXX-MM-XX)', () => {
        expect(isMonthOnly('XXXX-01-XX')).to.be.true;
        expect(isMonthOnly('XXXX-12-XX')).to.be.true;
      });

      it('should return false for complete dates', () => {
        expect(isMonthOnly('2025-01-15')).to.be.false;
        expect(isMonthOnly('2000-12-31')).to.be.false;
      });

      it('should return false for year-only format (YYYY-XX-XX)', () => {
        expect(isMonthOnly('2025-XX-XX')).to.be.false;
        expect(isMonthOnly('2000-XX-XX')).to.be.false;
      });

      it('should return false for partial year-month format (YYYY-MM-XX)', () => {
        expect(isMonthOnly('2025-01-XX')).to.be.false;
        expect(isMonthOnly('2000-12-XX')).to.be.false;
      });

      it('should return false for malformed formats', () => {
        expect(isMonthOnly('XXXX-1-XX')).to.be.false;
        expect(isMonthOnly('XXXX-01-X')).to.be.false;
        expect(isMonthOnly('XX-01-XX')).to.be.false;
      });

      it('should return false for empty or invalid inputs', () => {
        expect(isMonthOnly('')).to.be.false;
        expect(isMonthOnly(null)).to.be.false;
        expect(isMonthOnly(undefined)).to.be.false;
        expect(isMonthOnly('invalid-date')).to.be.false;
      });

      it('should return false for formats with different separators', () => {
        expect(isMonthOnly('XXXX/01/XX')).to.be.false;
        expect(isMonthOnly('XXXX.01.XX')).to.be.false;
        expect(isMonthOnly('XXXX 01 XX')).to.be.false;
      });
    });

    describe('isYearOnly', () => {
      it('should return true for valid year-only format (YYYY-XX-XX)', () => {
        expect(isYearOnly('1999-XX-XX')).to.be.true;
        expect(isYearOnly('2050-XX-XX')).to.be.true;
      });

      it('should return false for complete dates', () => {
        expect(isYearOnly('2025-07-18')).to.be.false;
        expect(isYearOnly('2000-12-31')).to.be.false;
      });

      it('should return false for month-only format (XXXX-MM-XX)', () => {
        expect(isYearOnly('XXXX-01-XX')).to.be.false;
        expect(isYearOnly('XXXX-07-XX')).to.be.false;
      });

      it('should return false for partial year-month format (YYYY-MM-XX)', () => {
        expect(isYearOnly('2025-07-XX')).to.be.false;
        expect(isYearOnly('1999-01-XX')).to.be.false;
      });

      it('should return false for malformed formats', () => {
        expect(isYearOnly('25-XX-XX')).to.be.false;
        expect(isYearOnly('2025-XX-X')).to.be.false;
        expect(isYearOnly('2025-X-XX')).to.be.false;
      });

      it('should return false for empty or invalid inputs', () => {
        expect(isYearOnly('')).to.be.false;
        expect(isYearOnly(null)).to.be.false;
        expect(isYearOnly(undefined)).to.be.false;
        expect(isYearOnly('invalid-date')).to.be.false;
      });

      it('should return false for formats with different separators', () => {
        expect(isYearOnly('2025/XX/XX')).to.be.false;
        expect(isYearOnly('2025.XX.XX')).to.be.false;
        expect(isYearOnly('2025 XX XX')).to.be.false;
      });
    });

    describe('isYearMonth', () => {
      it('should return true for valid year-month format (YYYY-MM-XX)', () => {
        expect(isYearMonth('2025-07-XX')).to.be.true;
        expect(isYearMonth('1999-12-XX')).to.be.true;
      });

      it('should return false for complete dates', () => {
        expect(isYearMonth('2025-07-18')).to.be.false;
        expect(isYearMonth('1999-01-01')).to.be.false;
      });

      it('should return false for year-only format (YYYY-XX-XX)', () => {
        expect(isYearMonth('2025-XX-XX')).to.be.false;
        expect(isYearMonth('1999-XX-XX')).to.be.false;
      });

      it('should return false for month-only format (XXXX-MM-XX)', () => {
        expect(isYearMonth('XXXX-07-XX')).to.be.false;
        expect(isYearMonth('XXXX-01-XX')).to.be.false;
      });

      it('should return false for malformed year, month or day formats', () => {
        expect(isYearMonth('25-07-XX')).to.be.false;
        expect(isYearMonth('2025-7-XX')).to.be.false;
        expect(isYearMonth('2025-07-X')).to.be.false;
        expect(isYearMonth('2025-07-xx')).to.be.false;
      });

      it('should return false for formats with different separators', () => {
        expect(isYearMonth('2025/07/XX')).to.be.false;
        expect(isYearMonth('2025.07.XX')).to.be.false;
        expect(isYearMonth('2025 07 XX')).to.be.false;
      });

      it('should return false for empty or invalid inputs', () => {
        expect(isYearMonth('')).to.be.false;
        expect(isYearMonth(null)).to.be.false;
        expect(isYearMonth(undefined)).to.be.false;
        expect(isYearMonth('invalid-date')).to.be.false;
      });
    });

    describe('isTreatmentBeforeService', () => {
      describe('year-only format (YYYY-XX-XX)', () => {
        it('should return true when treatment year is before service year', () => {
          const treatmentDate = parseDate('1999-01-01');
          const earliestServiceDate = parseDate('2000-01-01');
          const fieldData = '1999-XX-XX';

          const result = isTreatmentBeforeService(
            treatmentDate,
            earliestServiceDate,
            fieldData,
          );
          expect(result).to.be.true;
        });

        it('should return false when treatment year is after service year', () => {
          const treatmentDate = parseDate('2001-01-01');
          const earliestServiceDate = parseDate('2000-01-01');
          const fieldData = '2001-XX-XX';

          const result = isTreatmentBeforeService(
            treatmentDate,
            earliestServiceDate,
            fieldData,
          );
          expect(result).to.be.false;
        });
      });

      describe('year-month format (YYYY-MM-XX)', () => {
        it('should return true when treatment year-month is before service year-month', () => {
          const treatmentDate = parseDate('1999-12-01');
          const earliestServiceDate = parseDate('2000-01-01');
          const fieldData = '1999-12-XX';

          const result = isTreatmentBeforeService(
            treatmentDate,
            earliestServiceDate,
            fieldData,
          );
          expect(result).to.be.true;
        });

        it('should return false when treatment year-month is after service year-month', () => {
          const treatmentDate = parseDate('2000-02-01');
          const earliestServiceDate = parseDate('2000-01-01');
          const fieldData = '2000-02-XX';

          const result = isTreatmentBeforeService(
            treatmentDate,
            earliestServiceDate,
            fieldData,
          );
          expect(result).to.be.false;
        });
      });

      describe('non-matching format cases', () => {
        it('should return false for complete date format (YYYY-MM-DD)', () => {
          const treatmentDate = parseDate('1999-01-01');
          const earliestServiceDate = parseDate('2000-01-01');
          const fieldData = '1999-01-01';

          const result = isTreatmentBeforeService(
            treatmentDate,
            earliestServiceDate,
            fieldData,
          );
          expect(result).to.be.false;
        });

        it('should return false for month-only format (XXXX-MM-XX)', () => {
          const treatmentDate = parseDate('1999-01-01');
          const earliestServiceDate = parseDate('2000-01-01');
          const fieldData = 'XXXX-01-XX';

          const result = isTreatmentBeforeService(
            treatmentDate,
            earliestServiceDate,
            fieldData,
          );
          expect(result).to.be.false;
        });

        it('should return false for invalid date format', () => {
          const treatmentDate = parseDate('1999-01-01');
          const earliestServiceDate = parseDate('2000-01-01');
          const fieldData = 'invalid-date';

          const result = isTreatmentBeforeService(
            treatmentDate,
            earliestServiceDate,
            fieldData,
          );
          expect(result).to.be.false;
        });
      });
    });

    describe('findEarliestServiceDate', () => {
      it('should return the earliest service date from multiple periods', () => {
        const servicePeriods = [
          { serviceBranch: 'Army', dateRange: { from: '2003-03-12' } },
          { serviceBranch: 'Navy', dateRange: { from: '2000-01-14' } },
          { serviceBranch: 'Air Force', dateRange: { from: '2011-12-25' } },
        ];

        const result = findEarliestServiceDate(servicePeriods);
        expect(result.format(DATE_TEMPLATE)).to.equal('2000-01-14');
      });

      it('should return the single service date when only one period exists', () => {
        const servicePeriods = [
          { serviceBranch: 'Marines', dateRange: { from: '2005-06-15' } },
        ];

        const result = findEarliestServiceDate(servicePeriods);
        expect(result.format(DATE_TEMPLATE)).to.equal('2005-06-15');
      });

      it('should filter out service periods with empty serviceBranch', () => {
        const servicePeriods = [
          { serviceBranch: '', dateRange: { from: '1990-01-01' } },
          { serviceBranch: 'Navy', dateRange: { from: '2000-01-14' } },
        ];

        const result = findEarliestServiceDate(servicePeriods);
        expect(result.format(DATE_TEMPLATE)).to.equal('2000-01-14');
      });

      it('should filter out service periods with missing serviceBranch', () => {
        const servicePeriods = [
          { dateRange: { from: '1990-01-01' } },
          { serviceBranch: 'Navy', dateRange: { from: '2000-01-14' } },
        ];

        const result = findEarliestServiceDate(servicePeriods);
        expect(result.format(DATE_TEMPLATE)).to.equal('2000-01-14');
      });

      it('should filter out service periods with null serviceBranch', () => {
        const servicePeriods = [
          { serviceBranch: null, dateRange: { from: '1990-01-01' } },
          { serviceBranch: 'Navy', dateRange: { from: '2000-01-14' } },
        ];

        const result = findEarliestServiceDate(servicePeriods);
        expect(result.format(DATE_TEMPLATE)).to.equal('2000-01-14');
      });

      it('should filter out service periods with undefined dateRange', () => {
        const servicePeriods = [
          { serviceBranch: 'Army', dateRange: { from: '2003-03-12' } },
          { serviceBranch: 'Navy' },
        ];

        const result = findEarliestServiceDate(servicePeriods);
        expect(result.format(DATE_TEMPLATE)).to.equal('2003-03-12');
      });
    });
  });

  describe('toxic exposure date validations', () => {
    describe('validateToxicExposureGulfWar1990Dates', () => {
      it('should not add error for valid date range (month/year format)', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar1990Dates(errors, {
          startDate: '1990-09',
          endDate: '1991-03',
        });
        expect(errors.startDate.addError.called).to.be.false;
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should not add error for valid date range (year-only format)', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar1990Dates(errors, {
          startDate: '1990-XX',
          endDate: '1991-XX',
        });
        expect(errors.startDate.addError.called).to.be.false;
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should add error when end date is before start date', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar1990Dates(errors, {
          startDate: '1991-09',
          endDate: '1990-08',
        });
        expect(errors.startDate.addError.called).to.be.true;
      });

      it('should add error when end date month/year is before start date month/year', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar1990Dates(errors, {
          startDate: '1990-09',
          endDate: '1990-08',
        });
        expect(errors.startDate.addError.called).to.be.true;
      });

      it('should add error for future start date', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        const currentYear = new Date().getFullYear();
        const futureYear = currentYear + 1;
        validateToxicExposureGulfWar1990Dates(errors, {
          startDate: `${futureYear}-01`,
          endDate: `${futureYear}-02`,
        });
        expect(errors.startDate.addError.called).to.be.true;
      });

      it('should add error for future end date', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        const currentYear = new Date().getFullYear();
        const futureYear = currentYear + 1;
        validateToxicExposureGulfWar1990Dates(errors, {
          startDate: '1990-09',
          endDate: `${futureYear}-01`,
        });
        expect(errors.endDate.addError.called).to.be.true;
      });

      it('should add error when end date is before August 1990', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar1990Dates(errors, {
          startDate: '1988-09',
          endDate: '1989-09',
        });
        expect(errors.endDate.addError.called).to.be.true;
      });

      it('should not add error when end date is August 1990 (accepted due to month/year granularity)', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar1990Dates(errors, {
          startDate: '1988-09',
          endDate: '1990-08',
        });
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should not add error when end date is year-only 1990', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar1990Dates(errors, {
          startDate: '1988-09',
          endDate: '1990-XX',
        });
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should not add error when end date is September 1990', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar1990Dates(errors, {
          startDate: '1988-09',
          endDate: '1990-09',
        });
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should not add error when only start date is provided', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar1990Dates(errors, {
          startDate: '1990-09',
          endDate: null,
        });
        expect(errors.startDate.addError.called).to.be.false;
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should not add error when only end date is provided', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar1990Dates(errors, {
          startDate: null,
          endDate: '1990-09',
        });
        expect(errors.startDate.addError.called).to.be.false;
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should accept full date format (YYYY-MM-DD) for backward compatibility', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar1990Dates(errors, {
          startDate: '1990-09-15',
          endDate: '1991-03-20',
        });
        expect(errors.startDate.addError.called).to.be.false;
        expect(errors.endDate.addError.called).to.be.false;
      });
    });

    describe('validateToxicExposureGulfWar2001Dates', () => {
      it('should not add error for valid date range (month/year format)', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar2001Dates(errors, {
          startDate: '2001-10',
          endDate: '2002-03',
        });
        expect(errors.startDate.addError.called).to.be.false;
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should not add error for valid date range (year-only format)', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar2001Dates(errors, {
          startDate: '2001-XX',
          endDate: '2002-XX',
        });
        expect(errors.startDate.addError.called).to.be.false;
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should add error when end date is before start date', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar2001Dates(errors, {
          startDate: '2002-10',
          endDate: '2001-09',
        });
        expect(errors.startDate.addError.called).to.be.true;
      });

      it('should add error when end date month/year is before start date month/year', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar2001Dates(errors, {
          startDate: '2001-10',
          endDate: '2001-09',
        });
        expect(errors.startDate.addError.called).to.be.true;
      });

      it('should add error for future start date', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        const currentYear = new Date().getFullYear();
        const futureYear = currentYear + 1;
        validateToxicExposureGulfWar2001Dates(errors, {
          startDate: `${futureYear}-01`,
          endDate: `${futureYear}-02`,
        });
        expect(errors.startDate.addError.called).to.be.true;
      });

      it('should add error for future end date', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        const currentYear = new Date().getFullYear();
        const futureYear = currentYear + 1;
        validateToxicExposureGulfWar2001Dates(errors, {
          startDate: '2001-10',
          endDate: `${futureYear}-01`,
        });
        expect(errors.endDate.addError.called).to.be.true;
      });

      it('should add error when end date is before September 2001', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar2001Dates(errors, {
          startDate: '2000-10',
          endDate: '2001-08',
        });
        expect(errors.endDate.addError.called).to.be.true;
      });

      it('should not add error when end date is September 2001 (accepted due to month/year granularity)', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar2001Dates(errors, {
          startDate: '2000-10',
          endDate: '2001-09',
        });
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should not add error when end date is year-only 2001', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar2001Dates(errors, {
          startDate: '2000-10',
          endDate: '2001-XX',
        });
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should not add error when end date is October 2001', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar2001Dates(errors, {
          startDate: '2000-10',
          endDate: '2001-10',
        });
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should accept full date format (YYYY-MM-DD) for backward compatibility', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureGulfWar2001Dates(errors, {
          startDate: '2001-10-15',
          endDate: '2002-03-20',
        });
        expect(errors.startDate.addError.called).to.be.false;
        expect(errors.endDate.addError.called).to.be.false;
      });
    });

    describe('validateToxicExposureDates', () => {
      it('should not add error for valid date range (month/year format)', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureDates(errors, {
          startDate: '1995-06',
          endDate: '1997-08',
        });
        expect(errors.startDate.addError.called).to.be.false;
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should not add error for valid date range (year-only format)', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureDates(errors, {
          startDate: '1995-XX',
          endDate: '1997-XX',
        });
        expect(errors.startDate.addError.called).to.be.false;
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should add error when end date is before start date', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureDates(errors, {
          startDate: '1997-06',
          endDate: '1995-08',
        });
        expect(errors.startDate.addError.called).to.be.true;
      });

      it('should add error when end date month/year is before start date month/year', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureDates(errors, {
          startDate: '1995-08',
          endDate: '1995-06',
        });
        expect(errors.startDate.addError.called).to.be.true;
      });

      it('should add error for future start date', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        const currentYear = new Date().getFullYear();
        const futureYear = currentYear + 1;
        validateToxicExposureDates(errors, {
          startDate: `${futureYear}-01`,
          endDate: `${futureYear}-02`,
        });
        expect(errors.startDate.addError.called).to.be.true;
      });

      it('should add error for future end date', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        const currentYear = new Date().getFullYear();
        const futureYear = currentYear + 1;
        validateToxicExposureDates(errors, {
          startDate: '1995-06',
          endDate: `${futureYear}-01`,
        });
        expect(errors.endDate.addError.called).to.be.true;
      });

      it('should not add error when only start date is provided', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureDates(errors, {
          startDate: '1995-06',
          endDate: null,
        });
        expect(errors.startDate.addError.called).to.be.false;
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should not add error when only end date is provided', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureDates(errors, {
          startDate: null,
          endDate: '1997-08',
        });
        expect(errors.startDate.addError.called).to.be.false;
        expect(errors.endDate.addError.called).to.be.false;
      });

      it('should accept full date format (YYYY-MM-DD) for backward compatibility', () => {
        const errors = {
          startDate: { addError: sinon.spy() },
          endDate: { addError: sinon.spy() },
        };
        validateToxicExposureDates(errors, {
          startDate: '1995-06-15',
          endDate: '1997-08-20',
        });
        expect(errors.startDate.addError.called).to.be.false;
        expect(errors.endDate.addError.called).to.be.false;
      });
    });
  });
});
