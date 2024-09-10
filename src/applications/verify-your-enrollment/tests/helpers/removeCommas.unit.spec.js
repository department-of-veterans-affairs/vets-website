import { expect } from 'chai';
import { removeCommas } from '../../helpers';

describe('removeCommas', () => {
  it('should remove comma from any obj key', () => {
    const obj = {
      address1: '234 some st,',
      address2: 'apt 5,',
      city: 'some city,',
      state: 'NY',
    };
    const res = removeCommas(obj);
    expect(res).to.deep.equal({
      address1: '234 some st',
      address2: 'apt 5',
      city: 'some city',
      state: 'NY',
    });
  });
});
