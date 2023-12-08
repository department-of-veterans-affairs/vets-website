import { expect } from 'chai';
import savedData, { forceRepPhoneFix } from '../../migrations/02-rep-phone-fix';

import saveInProgress from '../fixtures/data/save-in-progress-v1';
import transformed02 from '../fixtures/data/migrated/02-migrated-v1-to-v2.json';

describe('HLR rep phone fix migration', () => {
  it('should ignore phone string for non-representative', () => {
    const data = {
      informalConference: 'yes', // self, not rep
      informalConferenceRep: {
        phone: '8005551212',
      },
    };
    expect(forceRepPhoneFix(data)).to.deep.equal(data);
  });
  it('should return phone object for representative', () => {
    const data = {
      informalConference: 'rep',
      informalConferenceRep: {
        phone: saveInProgress().formData.informalConferenceRep.phone,
      },
    };
    const result = {
      informalConference: 'rep',
      informalConferenceRep: {
        phone: transformed02.formData.informalConferenceRep.phone,
      },
    };
    expect(forceRepPhoneFix(data)).to.deep.equal(result);
  });
});

describe('HLR savedData returns phone fix', () => {
  it('should return phone object for representative', () => {
    const data = saveInProgress();
    const result = {
      formData: {
        veteran: {
          ssnLastFour: '7821',
          vaFileLastFour: '8765',
        },
        zipCode5: '94608',
        sameOffice: true,
        privacyAgreementAccepted: true,
        informalConference: 'rep',
        informalConferenceRep: {
          name: 'James P. Sullivan',
          phone: {
            areaCode: '800',
            countryCode: '1',
            phoneNumber: '5551212',
            phoneNumberExt: '',
          },
        },
        informalConferenceTimes: {
          time1: 'time0800to1000',
          time2: 'time1000to1230',
        },
        contestedIssues: transformed02.formData.contestedIssues,
      },
      metadata: saveInProgress().metadata,
    };
    expect(savedData(data)).to.deep.equal(result);
  });
});
