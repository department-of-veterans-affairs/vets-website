import { add, format } from 'date-fns';
import sinon from 'sinon';
import { expect } from 'chai';

import {
  isValidYear,
  isWithinServicePeriod,
  startedAfterServicePeriod,
  oneDisabilityRequired,
  hasMonthYear,
  validateDisabilityName,
  validateBooleanGroup,
  validateAge,
  validateSeparationDate,
} from '../validations';

import disabilityLabels from '../content/disabilityLabels';
import { capitalizeEachWord } from '../utils';
import { minYear, maxYear } from 'platform/forms-system/src/js/helpers';

const formatDate = date => format(date, 'yyyy-MM-dd');
const daysFromToday = days => formatDate(add(new Date(), { days }));

describe('526 All Claims validations', () => {
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
    it('should add error if treatment start date is before earliest service start date', () => {
      const err = { addError: sinon.spy() };

      const formData = {
        serviceInformation: {
          servicePeriods: [
            { dateRange: { from: '2003-03-12' } },
            { dateRange: { from: '2000-01-14' } },
            { dateRange: { from: '2011-12-25' } },
          ],
        },
      };

      startedAfterServicePeriod(err, '1999-12-XX', formData);
      expect(err.addError.calledOnce).to.be.true;
    });

    it('should not add error if treatment start date monthYear is the same as earliest service start date', () => {
      const err = { addError: sinon.spy() };

      const formData = {
        serviceInformation: {
          servicePeriods: [
            { dateRange: { from: '2003-03-12' } },
            { dateRange: { from: '2000-01-14' } },
            { dateRange: { from: '2011-12-25' } },
          ],
        },
      };

      startedAfterServicePeriod(err, '2000-01-XX', formData);
      expect(err.addError.called).to.be.false;
    });

    it('should not add error if treatment start date is after earliest service start date', () => {
      const err = { addError: sinon.spy() };

      const formData = {
        serviceInformation: {
          servicePeriods: [
            { dateRange: { from: '2003-03-12' } },
            { dateRange: { from: '2000-01-14' } },
            { dateRange: { from: '2011-12-25' } },
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
    });
  });

  describe('hasMonthYear', () => {
    it('should add an error if the year is missing', () => {
      const err = {
        addError: sinon.spy(),
      };
      hasMonthYear(err, 'XXXX-12-XX');
      expect(err.addError.called).to.be.true;
    });

    it('should add an error if the month is missing', () => {
      const err = {
        addError: sinon.spy(),
      };
      hasMonthYear(err, '1980-XX-XX');
      expect(err.addError.called).to.be.true;
    });

    it('should not add an error if the month and year are present', () => {
      const err = {
        addError: sinon.spy(),
      };
      hasMonthYear(err, '1980-12-XX');
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
    it('should not add error when disability is in list', () => {
      const err = { addError: sinon.spy() };
      validateDisabilityName(err, disabilityLabels[7100]);
      expect(err.addError.called).to.be.false;
    });
    it('should not add error when disability is in list but capitalization is different', () => {
      const err = { addError: sinon.spy() };
      validateDisabilityName(err, capitalizeEachWord(disabilityLabels[7100]));
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
      allowBDD: bdd,
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
        data({ branch: 'Army Reserve' }),
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
          branch: 'Army Reserve',
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
    it('should allow future end service dates > 180 days if in the reserves', () => {
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
          branch: 'Army National Guard',
        }),
      );

      expect(errors.addError.called).to.be.false;
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
  });
});
