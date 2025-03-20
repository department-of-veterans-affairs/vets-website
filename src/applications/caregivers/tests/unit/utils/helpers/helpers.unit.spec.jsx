import { expect } from 'chai';
import { normalizeFullName, replaceStrValues } from '../../../../utils/helpers';

describe('CG `normalizeFullName` method', () => {
  const fullName = {
    first: 'John',
    middle: 'David',
    last: 'Smith',
    suffix: 'Jr.',
  };

  it('should gracefully return an empty string when a value is omitted from the function', () => {
    expect(normalizeFullName()).to.be.empty;
  });

  it('should gracefully return an empty string when an empty object is provided to the function', () => {
    expect(normalizeFullName({})).to.be.empty;
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
  it('should gracefully return an empty string when both the source string and replacement value are omitted from the function', () => {
    expect(replaceStrValues()).to.be.empty;
  });

  it('should gracefully return an empty string when the replacement value is omitted from the function', () => {
    const str = 'Insurance information for %s';
    expect(replaceStrValues(str)).to.be.empty;
  });

  it('should return the correct string when all required values are provided to the function', () => {
    const str = 'Insurance information for %s';
    const val = 'Mary Smith';
    expect(replaceStrValues(str, val)).to.equal(
      'Insurance information for Mary Smith',
    );
  });
});
