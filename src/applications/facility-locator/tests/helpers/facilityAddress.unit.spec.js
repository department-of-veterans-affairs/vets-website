import { expect } from 'chai';
import { titleCaseFacilityName } from '../../utils/facilityAddress';

describe('titleCaseFacilityName', () => {
  it('Should convert all caps to title case', () => {
    const actual = titleCaseFacilityName('FAYETTEVILLE VA MEDICAL CENTER');
    expect(actual).to.equal('Fayetteville VA Medical Center');
  });
});
