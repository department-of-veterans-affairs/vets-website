import { expect } from 'chai';

import escapeRegExp from 'platform/forms-system/src/js/utilities/data/escapeRegExp';

describe('escapeRegExp', () => {
  it('should escape regular expression special characters', () => {
    const raw = '[]{}()*+?.^$|';
    const result = '\\[\\]\\{\\}\\(\\)\\*\\+\\?\\.\\^\\$\\|';
    expect(escapeRegExp(raw)).to.equal(result);
  });
  it('should escape regular expression escaped characters', () => {
    const raw = '\\s and \\';
    const result = '\\\\s and \\\\';
    expect(escapeRegExp(raw)).to.equal(result);
  });
});
