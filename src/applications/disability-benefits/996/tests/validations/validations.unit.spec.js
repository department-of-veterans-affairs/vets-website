import { expect } from 'chai';

import { checkDateRange, checkConferenceTimes } from '../../validations';
import { addXMonths } from '../../helpers';
import { errorMessages } from '../../constants';

const mockFormData = { informalConferenceChoice: 'me' };

describe('From Date validations', () => {
  it('should allow start dates after today', () => {
    let errorMessage = '';
    const errors = {
      from: {
        addError: message => {
          errorMessage = message || '';
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
          errorMessage = message || '';
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
          errorMessage = message || '';
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
          errorMessage = message || '';
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
          errorMessage = message || '';
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

describe('Informal conference time validation', () => {
  it('should show an error if no times are selected', () => {
    let errorMessage = '';
    const errors = {
      addError: message => {
        errorMessage = message || '';
      },
    };
    const times = {
      a: undefined,
      b: undefined,
      c: undefined,
      d: undefined,
    };
    checkConferenceTimes(errors, times, mockFormData);
    expect(errorMessage).to.equal(errorMessages.informalConferenceTimesMin);
    expect(checkConferenceTimes(null, times)).to.be.false;
  });

  it('should show an error if too many times are selected', () => {
    let errorMessage = '';
    const errors = {
      addError: message => {
        errorMessage = message || '';
      },
    };
    const times = {
      a: true,
      b: true,
      c: true,
      d: true,
    };
    checkConferenceTimes(errors, times, mockFormData);
    expect(errorMessage).to.equal(errorMessages.informalConferenceTimesMax);
    expect(checkConferenceTimes(null, times)).to.be.false;
  });

  it('should not show an error if a single time is selected', () => {
    let errorMessage = '';
    const errors = {
      addError: message => {
        errorMessage = message || '';
      },
    };
    const times = {
      a: undefined,
      b: true,
      c: undefined,
      d: undefined,
    };
    checkConferenceTimes(errors, times, mockFormData);
    expect(errorMessage).to.equal('');
    expect(checkConferenceTimes(null, times)).to.be.true;
  });
});
