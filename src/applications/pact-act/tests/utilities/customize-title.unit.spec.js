import { expect } from 'chai';
import { customizeTitle } from '../../utilities/customize-title';

describe('utilities: customize title', () => {
  it('should return the correct title with the H1', () => {
    expect(customizeTitle('This is a test H1')).to.equal(
      'This is a test H1 | PACT Act | Veterans Affairs',
    );
  });

  it('should return the correct title without an H1', () => {
    expect(customizeTitle()).to.equal('PACT Act | Veterans Affairs');
  });
});
