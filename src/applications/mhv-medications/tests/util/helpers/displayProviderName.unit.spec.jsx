import { expect } from 'chai';
import { displayProviderName } from '../../../util/helpers';
import { NO_PROVIDER_NAME } from '../../../util/constants';

describe('Provider name function', () => {
  it('should return no provider available constant when no values are passed', () => {
    expect(displayProviderName()).to.equal(NO_PROVIDER_NAME);
  });

  it('should return provider name "first last" format', () => {
    const firstName = 'Tony';
    const lastName = 'Stark';
    expect(displayProviderName(firstName, lastName)).to.equal(
      `${firstName} ${lastName}`,
    );
  });
});
