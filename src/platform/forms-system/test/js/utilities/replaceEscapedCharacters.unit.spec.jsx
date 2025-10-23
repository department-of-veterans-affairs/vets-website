import { expect } from 'chai';
import { replaceEscapedCharacters } from 'platform/forms-system/src/js/utilities/replaceEscapedCharacters';

describe('replaceEscapedCharacters', () => {
  it('replaces double-quotes with single', () => {
    const str = 'Jane said, "This is a test," and I agreed.';

    expect(replaceEscapedCharacters(str)).to.eq(
      "Jane said, 'This is a test,' and I agreed.",
    );
  });
});
