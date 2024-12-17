import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  createLiteralMap,
  formatDate,
  maskSSN,
  normalizeFullName,
  replaceStrValues,
} from '../../../../utils/helpers';

describe('hca `createLiteralMap` method', () => {
  it('should create an object with correct properties based on array data', () => {
    const data = [['value1', ['key1', 'key2']], ['value2', ['key3', 'key4']]];
    const result = createLiteralMap(data);
    expect(result).to.have.property('key1', 'value1');
    expect(result).to.have.property('key2', 'value1');
    expect(result).to.have.property('key3', 'value2');
    expect(result).to.have.property('key4', 'value2');
  });

  it('should create an empty object when array data is empty', () => {
    const data = [];
    const result = createLiteralMap(data);
    expect(result).to.deep.equal({});
  });

  it('should correctly handle data with no duplicates', () => {
    const data = [['value1', ['key1']], ['value2', ['key2']]];
    const result = createLiteralMap(data);
    expect(result).to.have.property('key1', 'value1');
    expect(result).to.have.property('key2', 'value2');
  });

  it('should gracefully handle array data with empty key lists', () => {
    const data = [['value1', []], ['value2', ['key2', 'key3']]];
    const result = createLiteralMap(data);
    expect(result).to.not.have.property('undefined');
    expect(result).to.have.property('key2', 'value2');
    expect(result).to.have.property('key3', 'value2');
  });
});

describe('hca `formatDate` method', () => {
  it('should correctly format a valid date string', () => {
    const value = '2024-11-19T15:30:00Z';
    const result = formatDate(value, 'yyyy-MM-dd');
    expect(result).to.equal('2024-11-19');
  });

  it('should correctly format a valid date string without a time component', () => {
    const value = '2024-11-19';
    const result = formatDate(value, 'yyyy-MM-dd');
    expect(result).to.equal('2024-11-19');
  });
});

describe('hca `maskSSN` method', () => {
  const subject = ({ value = undefined }) => {
    const { container } = render(maskSSN(value));
    const selectors = () => ({
      visual: container.querySelector('[aria-hidden]'),
      srOnly: container.querySelector('.sr-only'),
    });
    return { selectors };
  };

  context('when a value is omitted from the function', () => {
    it('should gracefully return an element with screenreader text that declares a blank value was provided', () => {
      const { selectors } = subject({});
      const { visual, srOnly } = selectors();
      expect(visual).to.contain.text('');
      expect(srOnly).to.contain.text('is blank');
    });
  });

  context('when a value of `null` is passed to the function', () => {
    it('should gracefully return an element with screenreader text that declares a blank value was provided', () => {
      const { selectors } = subject({ value: null });
      const { visual, srOnly } = selectors();
      expect(visual).to.contain.text('');
      expect(srOnly).to.contain.text('is blank');
    });
  });

  context('when a value is provided to the function', () => {
    it('should return a masked value with the last 4 chars and screenreader text that will read the last 4 chars', () => {
      const { selectors } = subject({ value: '211111111' });
      const { visual, srOnly } = selectors();
      expect(visual).to.contain.text('●●●–●●–1111');
      expect(srOnly).to.contain.text('ending with 1 1 1 1');
    });
  });
});

describe('hca `normalizeFullName` method', () => {
  const fullName = {
    first: 'John',
    middle: 'William',
    last: 'Smith',
    suffix: 'Jr.',
  };

  it('should gracefully return an empty string when name object is omitted from the function', () => {
    expect(normalizeFullName()).to.be.empty;
  });

  it('should return first name, last name and suffix when the `outputMiddle` param is excluded', () => {
    expect(normalizeFullName(fullName)).to.equal('John Smith Jr.');
  });

  it('should return first name, last name and suffix when `outputMiddle` is set to `false`', () => {
    expect(normalizeFullName(fullName, false)).to.equal('John Smith Jr.');
  });

  it('should return first name, middle name, last name and suffix when `outputMiddle` is set to `true`', () => {
    expect(normalizeFullName(fullName, true)).to.equal(
      'John William Smith Jr.',
    );
  });

  it('should return first name, last name and suffix when middle name is `null`', () => {
    const fullNameWithoutMiddle = { ...fullName, middle: null };
    expect(normalizeFullName(fullNameWithoutMiddle, true)).to.equal(
      'John Smith Jr.',
    );
  });
});

describe('hca `replaceStrValues` method', () => {
  it('should successfully replace the placeholder with the given value', () => {
    const src = 'Hello, %s!';
    const val = 'World';
    const result = replaceStrValues(src, val);
    expect(result).to.equal('Hello, World!');
  });

  it('should return an empty string if the source is null or undefined', () => {
    expect(replaceStrValues(null, 'Test')).to.equal('');
    expect(replaceStrValues(undefined, 'Test')).to.equal('');
  });

  it('should return an empty string if the value is null or undefined', () => {
    const src = 'Hello, %s!';
    expect(replaceStrValues(src, null)).to.equal('');
    expect(replaceStrValues(src, undefined)).to.equal('');
  });

  it('should successfully replace a custom placeholder with the given value', () => {
    const src = 'Value is %d';
    const val = '42';
    const result = replaceStrValues(src, val, '%d');
    expect(result).to.equal('Value is 42');
  });

  it('should return an empty string if both source and value are null or undefined', () => {
    expect(replaceStrValues(null, null)).to.equal('');
    expect(replaceStrValues(undefined, undefined)).to.equal('');
  });
});
