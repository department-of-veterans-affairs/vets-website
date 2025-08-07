import { expect } from 'chai';
import { validateIfAvailable } from '../../../util/helpers';

describe('Validate if Available function', () => {
  it('should return the value', () => {
    expect(validateIfAvailable('Test field name', 'Test')).to.equal('Test');
  });

  it("should return 'Test field not available' when no value is passed", () => {
    expect(validateIfAvailable('Test field')).to.equal(
      'Test field not available',
    );
  });

  it('should return 0', () => {
    expect(validateIfAvailable('Test field name', 0)).to.equal(0);
  });
});
