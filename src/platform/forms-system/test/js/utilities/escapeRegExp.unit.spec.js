import { expect } from 'chai';

import escapeRegExp from 'platform/forms-system/src/js/utilities/data/escapeRegExp';

describe('escapeRegExp', () => {
  const getRegExpString = raw =>
    new RegExp(`(${escapeRegExp(raw)})`).toString();

  it('should not escape characters that are not special characters', () => {
    const raw = 'abcdefghijklmnopqrstuvwxyz1234567890!@#%_=:;<>~`';
    expect(escapeRegExp(raw)).to.equal(raw);
    expect(getRegExpString(raw)).to.eq(`/(${raw})/`);
  });
  it('should escape regular expression special characters', () => {
    const raw = '][}{)(*+?.^$|';
    const result = '\\]\\[\\}\\{\\)\\(\\*\\+\\?\\.\\^\\$\\|';
    expect(escapeRegExp(raw)).to.equal(result);
    expect(getRegExpString(raw)).to.eq(`/(${result})/`);
  });
  it('should escape regular expression escaped characters', () => {
    const raw = '\\s and \\';
    const result = '\\\\s and \\\\';
    expect(escapeRegExp(raw)).to.equal(result);
    expect(getRegExpString(raw)).to.eq(`/(${result})/`);
  });
});
