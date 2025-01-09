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
  it('should handle nested objects', () => {
    const input = {
      user: {
        name: 'Jane, Smith',
        location: {
          city: 'Los Angeles, CA',
          zip: '90001',
        },
      },
      age: 25,
    };
    const expected = {
      user: {
        name: 'Jane Smith',
        location: {
          city: 'Los Angeles CA',
          zip: '90001',
        },
      },
      age: 25,
    };
    expect(removeCommas(input)).to.deep.equal(expected);
  });

  it('should not modify non-string values', () => {
    const input = {
      count: 1000,
      items: ['item1', 'item2'],
      details: {
        description: 'This is a test, with commas.',
        price: 19.99,
      },
    };
    const expected = {
      count: 1000,
      items: ['item1', 'item2'],
      details: {
        description: 'This is a test with commas.',
        price: 19.99,
      },
    };
    expect(removeCommas(input)).to.deep.equal(expected);
  });

  it('should return an empty object when given an empty object', () => {
    const input = {};
    const expected = {};
    expect(removeCommas(input)).to.deep.equal(expected);
  });
});
