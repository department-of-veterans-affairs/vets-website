import { expect } from 'chai';
import { personalInfoConfig } from '../../helpers/personalInformationConfig';

describe('personal information config', () => {
  it('should return an object with keys name, ssn, dateOfBirth', () => {
    const keys = Object.keys(personalInfoConfig());
    expect(keys.includes('name')).to.be.ok;
    expect(keys.includes('ssn')).to.be.ok;
    expect(keys.includes('dateOfBirth')).to.be.ok;
  });
});
