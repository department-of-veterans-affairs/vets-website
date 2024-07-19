import { expect } from 'chai';
import { customizeTitle } from '../../utilities/customize-title';

describe('utilities: customize title', () => {
  it('should return the correct title with the H1', () => {
    expect(customizeTitle('This is a test H1')).to.equal(
      'Learn how the PACT Act may effect you | Veterans Affairs',
    );
  });

  it('should return the correct title without an H1', () => {
    expect(customizeTitle()).to.equal(
      'Learn how the PACT Act may effect you | Veterans Affairs',
    );
  });
});
