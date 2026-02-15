import { expect } from 'chai';
import { replaceStrValues } from '../../../../utils/helpers';

describe('10-10d `replaceStrValues` util', () => {
  it('should return empty string when source is falsy', () => {
    expect(replaceStrValues('', 'x')).to.equal('');
    expect(replaceStrValues(null, 'x')).to.equal('');
    expect(replaceStrValues(undefined, 'x')).to.equal('');
    expect(replaceStrValues(0, 'x')).to.equal('');
    expect(replaceStrValues(false, 'x')).to.equal('');
  });

  it('should return empty string when value is falsy', () => {
    expect(replaceStrValues('Hello %s', '')).to.equal('');
    expect(replaceStrValues('Hello %s', null)).to.equal('');
    expect(replaceStrValues('Hello %s', undefined)).to.equal('');
    expect(replaceStrValues('Hello %s', 0)).to.equal('');
    expect(replaceStrValues('Hello %s', false)).to.equal('');
  });

  it('should replace a single placeholder with a non-array value', () => {
    expect(replaceStrValues('Hello, %s!', 'World')).to.equal('Hello, World!');
  });

  it('should replace using a custom placeholder token', () => {
    expect(replaceStrValues('A ~~ B', 'X', '~~')).to.equal('A X B');
  });

  it('should replace sequentially for array values (left-to-right)', () => {
    expect(replaceStrValues('%s-%s-%s', ['a', 'b', 'c'])).to.equal('a-b-c');
  });

  it('should keep leftover placeholders when there are fewer values than placeholders', () => {
    expect(replaceStrValues('%s-%s-%s', ['a', 'b'])).to.equal('a-b-%s');
  });

  it('should ignore extra values when there are more values than placeholders', () => {
    expect(replaceStrValues('%s', ['x', 'y', 'z'])).to.equal('x');
  });

  it('should do nothing when placeholder token is absent', () => {
    expect(replaceStrValues('hello world', 'X')).to.equal('hello world');
  });

  it('should replace sequentially for array values with custom token', () => {
    expect(replaceStrValues('X @@ Y @@ Z', ['1', '2'], '@@')).to.equal(
      'X 1 Y 2 Z',
    );
  });
});
