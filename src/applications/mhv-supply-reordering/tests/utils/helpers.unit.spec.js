import { expect } from 'chai';
import {
  suppliesReplaceSchema,
  suppliesUpdateUiSchema,
} from '../../utils/helpers';

describe('suppliesReplaceSchema', () => {
  it('handles an empty supplies array', () => {
    const result = suppliesReplaceSchema({ supplies: [] });
    expect(result).to.deep.equal({ type: 'object', properties: {} });
  });

  it('handles a null supplies value', () => {
    const result = suppliesReplaceSchema({ supplies: null });
    expect(result).to.deep.equal({ type: 'object', properties: {} });
  });

  it('handles an undefined supplies value', () => {
    const result = suppliesReplaceSchema({ supplies: undefined });
    expect(result).to.deep.equal({ type: 'object', properties: {} });
  });

  it('handles an empty object', () => {
    const result = suppliesReplaceSchema({});
    expect(result).to.deep.equal({ type: 'object', properties: {} });
  });

  it('handles an array of supply objects', () => {
    const supplies = [
      { productId: 123, productName: 'Product 123' },
      { productId: 456, productName: 'Product 456' },
    ];
    const expected = {
      type: 'object',
      properties: {
        '123': { type: 'boolean' },
        '456': { type: 'boolean' },
      },
    };
    const result = suppliesReplaceSchema({ supplies });
    expect(result).to.deep.equal(expected);
  });
});

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
    const expected = {
      '123': 'Product 123',
      '456': 'Product 456',
    };
    const result = suppliesUpdateUiSchema({ supplies });
    expect(result).to.deep.equal(expected);
  });
});
