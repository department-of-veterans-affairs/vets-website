import { expect } from 'chai';

import { LocationData } from '../factory';

describe('health care questionnaire -- utils -- test data -- data factory -- location -- ', () => {
  it('location is created with type', () => {
    const location = new LocationData().withType('some cool type');

    expect(location).to.have.property('type');

    expect(location.type[0].text).to.equal('some cool type');
    expect(location.type[0].coding[0].display).to.equal('some cool type');
  });
});
