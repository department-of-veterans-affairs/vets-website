import sinon from 'sinon';
import { expect } from 'chai';

import {
  isValidYear,
  startedAfterServicePeriod,
  oneDisabilityRequired,
  hasMonthYear,
  validateDisabilityName,
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
    it('should not add error when regex fails but disability is in list', () => {
      const err = { addError: sinon.spy() };
      validateDisabilityName(err, disabilityLabels[5780]);
      expect(err.addError.called).to.be.false;
    });
    it('should not add error when disability is in list but capitalization is different', () => {
      const err = { addError: sinon.spy() };
      validateDisabilityName(err, capitalizeEachWord(disabilityLabels[5780]));
      expect(err.addError.called).to.be.false;
    });
    it('should not add error when disability not in list but passes regex', () => {
      const err = { addError: sinon.spy() };
      validateDisabilityName(err, 'blah. (and, blah) /blah');
      expect(err.addError.called).to.be.false;
    });
    it('should add error when disability not in list and regex fails', () => {
      const err = { addError: sinon.spy() };
      validateDisabilityName(err, 'blah -;');
      expect(err.addError.calledOnce).to.be.true;
    });
  });
});
