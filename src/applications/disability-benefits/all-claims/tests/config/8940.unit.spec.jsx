import { expect } from 'chai';
import createformConfig8940 from '../../config/8940';

describe('8940 form config', () => {
  it('should return full config in test environment', () => {
    // In test environments, config should always be available
    // This allows all existing unit tests to work without modification
    const config = createformConfig8940();
    expect(config).to.be.an('object');
    expect(config).to.have.property('unemployabilityFormIntro');
    expect(config).to.have.property('pastEducationTraining');
    expect(config).to.have.property('employmentHistory');
  });
});
