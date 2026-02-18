import { expect } from 'chai';
import { concatStreets, replaceStrValues } from '../../../../utils/helpers';

describe('1010d `concatStreets` util', () => {
  it('should join street fields with spaces by default', () => {
    const addr = { street: '123 Main', street2: 'Apt 4B' };
    const result = concatStreets(addr);
    expect(result.streetCombined).to.equal('123 Main Apt 4B');
  });

  it('should join with new lines when `options.newLines` is true', () => {
    const addr = { street: '123 Main', street2: 'Apt 4B' };
    const result = concatStreets(addr, { newLines: true });
    expect(result.streetCombined).to.equal('123 Main\nApt 4B');
  });

  it('should filter out `undefined`, `null`, and `empty-string` values', () => {
    const addr = {
      street: '123 Main',
      street2: undefined,
      street3: null,
      street4: '',
    };
    const result = concatStreets(addr);
    expect(result.streetCombined).to.equal('123 Main');
  });

  it('should trim individual street parts before joining', () => {
    const addr = { street: '  123 Main  ', street2: '  Apt 4B ' };
    const result = concatStreets(addr);
    expect(result.streetCombined).to.equal('123 Main Apt 4B');
  });

  it('should ignore non-street keys entirely', () => {
    const addr = { city: 'Indy', postalCode: '46204' };
    const result = concatStreets(addr);
    expect(result.streetCombined).to.equal('');
  });

  it('should return a new object and does not mutate the input', () => {
    const addr = { street: '123 Main' };
    const copy = { ...addr };
    const result = concatStreets(addr);
    expect(result).to.not.equal(addr);
    expect(addr).to.deep.equal(copy);
    expect(result).to.deep.equal({ ...addr, streetCombined: '123 Main' });
  });

  it('should correctly handle undefined address object', () => {
    const result = concatStreets(undefined);
    expect(result).to.deep.equal({ streetCombined: '' });
  });

  it('should correctly handle omitted options', () => {
    const addr = { street: '123 Main', street2: 'Apt 4B' };
    const result = concatStreets(addr);
    expect(result.streetCombined).to.equal('123 Main Apt 4B');
  });

  it('should avoid trailing space or newline', () => {
    const addr = { street: '123 Main', street2: '' };
    const withSpace = concatStreets(addr);
    expect(withSpace.streetCombined).to.equal('123 Main');

    const withNewline = concatStreets(addr, { newLines: true });
    expect(withNewline.streetCombined).to.equal('123 Main');
  });
});

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
