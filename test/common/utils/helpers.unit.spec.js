import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import { isActivePage, dateToMoment, dateDiffDesc } from '../../../src/js/common/utils/helpers.js';

describe('Helpers unit tests', () => {
  describe('isActivePage', () => {
    it('matches against data', () => {
      const page = {
        depends: { testData: 'Y' }
      };
      const data = {
        testData: 'Y'
      };

      const result = isActivePage(page, data);

      expect(result).to.be.true;
    });
    it('false with mismatched data', () => {
      const page = {
        depends: { testData: 'Y' }
      };
      const data = {
        testData: 'N'
      };

      const result = isActivePage(page, data);

      expect(result).to.be.false;
    });
    it('matches using function', () => {
      const matcher = sinon.stub().returns(true);
      const page = {
        depends: matcher
      };
      const data = {
        testData: 'Y'
      };

      const result = isActivePage(page, data);

      expect(result).to.be.true;
      expect(matcher.calledWith(data)).to.be.true;
    });
    it('matches against array', () => {
      const page = {
        depends: [
          { testData: 'N' },
          { testData: 'Y' }
        ]
      };
      const data = {
        testData: 'Y'
      };

      const result = isActivePage(page, data);

      expect(result).to.be.true;
    });
  });
  describe('dateToMoment', () => {
    it('should convert date to moment', () => {
      const date = dateToMoment({
        month: {
          value: 2
        },
        day: {
          value: 3
        },
        year: {
          value: '1901'
        }
      });

      expect(date.isValid()).to.be.true;
      expect(date.year()).to.equal(1901);
      expect(date.month()).to.equal(1);
      expect(date.date()).to.equal(3);
    });
    it('should convert partial date to moment', () => {
      const date = dateToMoment({
        month: {
          value: 2
        },
        year: {
          value: '1901'
        }
      });

      expect(date.isValid()).to.be.true;
      expect(date.year()).to.equal(1901);
      expect(date.month()).to.equal(1);
      expect(date.date()).to.equal(1);
    });
  });
  describe('dateDiffDesc', () => {
    const today = moment();
    it('should display time in days', () => {
      expect(dateDiffDesc(moment(today).add(30, 'days'), today)).to.equal('30 days');
    });
    it('should display time in hours', () => {
      expect(dateDiffDesc(moment(today).add(23, 'hours'), today)).to.equal('23 hours');
    });
    it('should display time in minutes', () => {
      expect(dateDiffDesc(moment(today).add(59, 'minutes'), today)).to.equal('59 minutes');
    });
    it('should display time as less than a minute', () => {
      expect(dateDiffDesc(moment(today).add(59, 'seconds'), today)).to.equal('less than a minute');
    });
  });
});
