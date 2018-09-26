import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import {
  hasGuardOrReservePeriod,
  ReservesGuardDescription,
  isInFuture,
  getDisabilityName,
} from '../utils.jsx';

describe('526 helpers', () => {
  describe('hasGuardOrReservePeriod', () => {
    it('should return true when reserve period present', () => {
      const formData = {
        servicePeriods: [
          {
            serviceBranch: 'Air Force Reserve',
            dateRange: {
              to: '2011-05-06',
              from: '2015-05-06',
            },
          },
        ],
      };

      expect(hasGuardOrReservePeriod(formData)).to.be.true;
    });

    it('should return true when national guard period present', () => {
      const formData = {
        servicePeriods: [
          {
            serviceBranch: 'Air National Guard',
            dateRange: {
              to: '2011-05-06',
              from: '2015-05-06',
            },
          },
        ],
      };

      expect(hasGuardOrReservePeriod(formData)).to.be.true;
    });

    it('should return false when no reserves or guard period present', () => {
      const formData = {
        servicePeriods: [
          {
            serviceBranch: 'Air Force',
            dateRange: {
              from: '2011-05-06',
              to: '2015-05-06',
            },
          },
        ],
      };

      expect(hasGuardOrReservePeriod(formData)).to.be.false;
    });

    it('should return false when no service history present', () => {
      const formData = {};

      expect(hasGuardOrReservePeriod(formData)).to.be.false;
    });
  });

  describe('reservesGuardDescription', () => {
    it('should pick the most recent service branch', () => {
      const form = {
        formData: {
          servicePeriods: [
            {
              serviceBranch: 'Air Force',
              dateRange: {
                from: '2010-05-08',
                to: '2018-10-08',
              },
            },
            {
              serviceBranch: 'Air Force Reserve',
              dateRange: {
                from: '2000-05-08',
                to: '2011-10-08',
              },
            },
            {
              serviceBranch: 'Marine Corps Reserve',
              dateRange: {
                from: '2000-05-08',
                to: '2018-10-08',
              },
            },
          ],
        },
      };

      const renderedText = shallow(ReservesGuardDescription(form))
        .render()
        .text();
      expect(renderedText).to.contain('Marine Corps Reserve');
    });

    it('should return null when no service periods present', () => {
      const form = {
        formData: {},
      };

      expect(ReservesGuardDescription(form)).to.equal(null);
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

  describe('getDisabilityName', () => {
    it('should return string with each word capitalized when name supplied', () => {
      expect(getDisabilityName('some disability - some detail')).to.equal(
        'Some Disability - Some Detail',
      );
    });
    it('should return Unknown Condition with undefined name', () => {
      expect(getDisabilityName()).to.equal('Unknown Condition');
    });
    it('should return Unknown Condition when input is empty string', () => {
      expect(getDisabilityName('')).to.equal('Unknown Condition');
    });
    it('should return Unknown Condition when name is not a string', () => {
      expect(getDisabilityName(249481)).to.equal('Unknown Condition');
    });
  });
});
