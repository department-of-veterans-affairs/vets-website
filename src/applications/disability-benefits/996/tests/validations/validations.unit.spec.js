import { expect } from 'chai';

import { checkConferenceTimes } from '../../validations';
import { errorMessages } from '../../constants';

const mockFormData = { informalConferenceChoice: 'me' };

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
