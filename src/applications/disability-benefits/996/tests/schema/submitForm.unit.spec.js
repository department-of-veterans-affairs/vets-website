import { expect } from 'chai';

import { buildEventData } from '../../config/submitForm';

describe('HLR submit event data', () => {
  it('should build submit event data', () => {
    expect(
      buildEventData({ sameOffice: true, informalConference: 'no' }),
    ).to.deep.equal({
      'decision-reviews-differentOffice': 'yes',
      'decision-reviews-informalConf': 'no',
    });
    expect(
      buildEventData({ sameOffice: false, informalConference: 'rep' }),
    ).to.deep.equal({
      'decision-reviews-differentOffice': 'no',
      'decision-reviews-informalConf': 'yes-with-rep',
    });
    expect(
      buildEventData({ sameOffice: false, informalConference: 'yes' }),
    ).to.deep.equal({
      'decision-reviews-differentOffice': 'no',
      'decision-reviews-informalConf': 'yes',
    });
  });
});
