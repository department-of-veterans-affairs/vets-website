import { expect } from 'chai';

import { customFormReplacer } from '../../config/utilities/formDataCleaning';

describe('customFormReplacer', () => {
  it('parses forms', () => {
    expect(customFormReplacer('test', {})).to.be.undefined;
    expect(
      customFormReplacer('test', { widget: 'autosuggest', id: 1 }),
    ).to.be.eq(1);
    expect(
      customFormReplacer('test', { confirmationCode: 'test', file: 'test' }),
    ).to.be.deep.eq({ confirmationCode: 'test' });
    expect(
      customFormReplacer('test', [{ widget: 'autosuggest', id: 1 }]),
    ).to.be.an('array');
    expect(customFormReplacer('test', [])).to.be.undefined;
    expect(customFormReplacer('test', 1)).to.be.eq(1);
    expect(customFormReplacer('test', null)).to.be.null;
    expect(customFormReplacer('phoneNumber', '123-456-7890 blah')).to.be.eq(
      '1234567890',
    );
  });
});
