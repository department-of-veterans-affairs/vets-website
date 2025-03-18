import { expect } from 'chai';
import { sanitizeField } from '../../helpers';

describe('sanitizeField', () => {
  it('should return an empty string if the value is not a string', () => {
    expect(sanitizeField(123)).to.equal('');
    expect(sanitizeField(undefined)).to.equal('');
    expect(sanitizeField(null)).to.equal('');
    expect(sanitizeField({})).to.equal('');
  });

  it('should return trimmed value if it is a normal string', () => {
    expect(sanitizeField('   Hello World   ')).to.equal('Hello World');
  });

  it("should return an empty string if the trimmed value is 'undefined'", () => {
    expect(sanitizeField('undefined')).to.equal('');
    expect(sanitizeField(' undefined ')).to.equal('');
  });

  it("should return an empty string if the trimmed value is 'null'", () => {
    expect(sanitizeField('null')).to.equal('');
    expect(sanitizeField(' null ')).to.equal('');
  });

  it('should return empty if an empty string is passed', () => {
    expect(sanitizeField('')).to.equal('');
    expect(sanitizeField('   ')).to.equal('');
  });

  it('should return the exact trimmed string if it is neither empty, "undefined", nor "null"', () => {
    expect(sanitizeField('  valid  ')).to.equal('valid');
    expect(sanitizeField('test')).to.equal('test');
  });
});
