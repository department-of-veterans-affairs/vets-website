import { expect } from 'chai';
import savedData from '../../migrations/02-rep-phone-fix';

import saveInProgress from '../fixtures/data/migrated/save-in-progress-v1';

describe('HLR rep phone fix migration', () => {
  it('should not change phone string for non-representative', () => {
    const data = {
      informalConference: 'yes', // self, not rep
      informalConferenceRep: {
        phone: '8005551212',
      },
    };
    expect(data).to.deep.equal(data);
  });
  it('should not change the phone string for rep', () => {
    const data = {
      informalConference: 'rep', // self, not rep
      informalConferenceRep: {
        phone: '8005551212',
      },
    };
    expect(data).to.deep.equal(data);
  });
});

describe('HLR savedData returns same data', () => {
  it('should return phone object for representative', () => {
    const data = saveInProgress();
    expect(savedData(data)).to.deep.equal(data);
  });
});
