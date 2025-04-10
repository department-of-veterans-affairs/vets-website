import { expect } from 'chai';
import { suppliesUpdateUiSchema } from '../../utils/helpers';

describe('suppliesUpdateUiSchema', () => {
  it('handles an empty supplies array', () => {
    const result = suppliesUpdateUiSchema({ supplies: [] });
    expect(result).to.deep.equal({});
  });

  it('handles a null supplies value', () => {
    const result = suppliesUpdateUiSchema({ supplies: null });
    expect(result).to.deep.equal({});
  });

  it('handles an undefined supplies value', () => {
    const result = suppliesUpdateUiSchema({ supplies: undefined });
    expect(result).to.deep.equal({});
  });

  it('handles an empty object', () => {
    const result = suppliesUpdateUiSchema({});
    expect(result).to.deep.equal({});
  });

  it('handles an array of supply objects', () => {
    const supplies = [
      { productId: 123, productName: 'Product 123' },
      { productId: 456, productName: 'Product 456' },
    ];
    const expectedKeys = ['123', '456'];
    const result = suppliesUpdateUiSchema({ supplies });
    expect(Object.keys(result)).to.deep.equal(expectedKeys);
  });
});
