import { expect } from 'chai';
import { normalizeFullName, replaceStrValues } from '../../../../utils/helpers';

describe('CG `normalizeFullName` method', () => {
  const fullName = {
    first: 'John',
    middle: 'David',
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
    expect(normalizeFullName(fullName, true)).to.equal('John David Smith Jr.');
  });

  it('should return first name, last name and suffix when middle name is `null`', () => {
    const fullNameWithoutMiddle = { ...fullName, middle: null };
    expect(normalizeFullName(fullNameWithoutMiddle, true)).to.equal(
      'John Smith Jr.',
    );
  });
});

describe('CG `replaceStrValues` method', () => {
  it('should successfully replace the placeholder when the value is a string', () => {
    const src = 'Hello, %s!';
    const val = 'World';
    const result = replaceStrValues(src, val);
    expect(result).to.equal('Hello, World!');
  });

  it('should successfully replace the placeholders when the value is an array', () => {
    const src = 'Hello, %s! My name is %s.';
    const val = ['World', 'John Smith'];
    const result = replaceStrValues(src, val);
    expect(result).to.equal('Hello, World! My name is John Smith.');
  });

  it('should successfully replace a custom placeholder with the given value', () => {
    const src = 'Value is %d';
    const val = '42';
    const result = replaceStrValues(src, val, '%d');
    expect(result).to.equal('Value is 42');
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

  it('should return an empty string if both source and value are null or undefined', () => {
    expect(replaceStrValues(null, null)).to.equal('');
    expect(replaceStrValues(undefined, undefined)).to.equal('');
  });
});
