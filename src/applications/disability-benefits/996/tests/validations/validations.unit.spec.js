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
    const times = '';
    checkConferenceTimes(errors, times, mockFormData);
    expect(errorMessage).to.equal(errorMessages.informalConferenceTimes);
  });

  it('should not show an error if a single time is selected', () => {
    let errorMessage = '';
    const errors = {
      addError: message => {
        errorMessage = message || '';
      },
    };
    const times = 'time0800to1000';
    checkConferenceTimes(errors, times, mockFormData);
    expect(errorMessage).to.equal('');
  });

  it('should not show an error if a two time are selected', () => {
    let errorMessage = '';
    const errors = {
      addError: message => {
        errorMessage = message || '';
      },
    };
    const times = 'time1000to1230';
    checkConferenceTimes(errors, times, mockFormData);
    expect(errorMessage).to.equal('');
  });
});
