import { expect } from 'chai';

import { checkDateRange } from '../../validations';
import { addXMonths } from '../../helpers';
import { errorMessages } from '../../constants';

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
      from: addXMonths(1),
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
      from: addXMonths(-1),
    };
    checkDateRange(errors, dates);
    expect(errorMessage).to.equal(errorMessages.startDateInPast);
  });

  it('should prevent end dates before today', () => {
    let errorMessage = '';
    const errors = {
      to: {
        addError: message => {
          errorMessage = message;
        },
      },
    };
    const dates = {
      to: addXMonths(-1),
    };
    checkDateRange(errors, dates);
    expect(errorMessage).to.equal(errorMessages.endDateInPast);
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
      from: addXMonths(2),
      to: addXMonths(3),
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
      from: addXMonths(2),
      to: addXMonths(-1),
    };
    checkDateRange(errors, dates);
    expect(errorMessage).to.equal(errorMessages.endDateBeforeStart);
  });
});
