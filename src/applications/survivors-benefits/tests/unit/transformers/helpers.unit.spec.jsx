import { expect } from 'chai';
import { truncateMiddleName } from '../../../utils/transformers/helpers';

describe('truncateMiddleName', () => {
  it('should truncate the middle name to its first initial', () => {
    const name = {
      first: 'John',
      middle: 'Michael',
      last: 'Doe',
    };
    const result = truncateMiddleName(name);
    expect(result).to.deep.equal({
      first: 'John',
      middle: 'M',
      last: 'Doe',
    });
  });

  it('should return the name unchanged if there is no middle name', () => {
    const name = {
      first: 'Jane',
      last: 'Smith',
    };
    const result = truncateMiddleName(name);
    expect(result).to.deep.equal(name);
  });

  it('should return undefined if the name is undefined', () => {
    const result = truncateMiddleName(undefined);
    expect(result).to.be.undefined;
  });
});
