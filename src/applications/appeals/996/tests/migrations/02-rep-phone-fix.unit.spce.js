import { expect } from 'chai';
import { forceRepPhoneFix } from '../../migrations/02-rep-phone-fix';

import saveInProgress from '../fixtures/data/save-in-progress-v1.json';
import transformed02 from '../fixtures/data/migrated/02-migrated-v1-to-v2.json';

describe('HLR rep phone fix migration', () => {
  it('should return phone object for representative', () => {
    const data = {
      informalConference: 'rep',
      informalConferenceRep: {
        phone: saveInProgress.formData.informalConferenceRep.phone,
      },
    };
    expect(forceRepPhoneFix(data)).to.deep.equal({
      informalConference: 'rep',
      informalConferenceRep: {
        phone: transformed02.formData.informalConferenceRep.phone,
      },
    });
  });
});
