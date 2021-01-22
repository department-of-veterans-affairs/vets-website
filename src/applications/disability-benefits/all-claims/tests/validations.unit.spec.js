import sinon from 'sinon';
import { expect } from 'chai';

import {
  isValidYear,
  startedAfterServicePeriod,
  oneDisabilityRequired,
  hasMonthYear,
  validateDisabilityName,
  validateBooleanGroup,
} from '../validations';

import disabilityLabels from '../content/disabilityLabels';
import { capitalizeEachWord } from '../utils';

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

    it('should add an error if the year is less than 1900', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '1899');
      expect(err.addError.called).to.be.true;
    });

    it('should add an error if the year is more than 3000', () => {
      const err = {
        addError: sinon.spy(),
      };
      isValidYear(err, '3001');
      expect(err.addError.called).to.be.true;
    });

    it('should not add an error if the year is between 1900 and 3000', () => {
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
      isValidYear(err, '2999');
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
});
