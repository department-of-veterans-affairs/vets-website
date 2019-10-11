import { expect } from 'chai';

import { checkDateRange } from '../../validations';
import { addXMonths } from '../../helpers';
import { errorMessages } from '../../constants';

const today = new Date();

describe('From Date validations', () => {
  it('should allow start dates after today', () => {
    let errorMessage = '';
    const errors = {
      from: {
        addError: message => {
          errorMessage = message;
        },
      },
    };
    const dates = {
      from: addXMonths(today, 1),
    };
    checkDateRange(errors, dates);
    expect(errorMessage).to.equal('');
  });

  it('should prevent start dates before today', () => {
    let errorMessage = '';
    const errors = {
      from: {
        addError: message => {
          errorMessage = message;
        },
      },
    };
    const dates = {
      from: addXMonths(today, -1),
    };
    checkDateRange(errors, dates);
    expect(errorMessage).to.equal(errorMessages.startDateInPast);
  });

  it('should allow end dates after the start date', () => {
    let errorMessage = '';
    const errors = {
      to: {
        addError: message => {
          errorMessage = message;
        },
      },
    };
    const dates = {
      from: addXMonths(today, 2),
      to: addXMonths(today, 3),
    };
    checkDateRange(errors, dates);
    expect(errorMessage).to.equal('');
  });

  it('should prevent end dates before the start date', () => {
    let errorMessage = '';
    const errors = {
      to: {
        addError: message => {
          errorMessage = message;
        },
      },
    };
    const dates = {
      from: addXMonths(today, 2),
      to: addXMonths(today, -1),
    };
    checkDateRange(errors, dates);
    expect(errorMessage).to.equal(errorMessages.endDateBeforeStart);
  });
});
