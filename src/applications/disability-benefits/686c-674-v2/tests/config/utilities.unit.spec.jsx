import { expect } from 'chai';
import {
  customFormReplacer,
  isClientError,
  isServerError,
} from '../../config/utilities';

describe('Utilities', () => {
  it('parses client errors', () => {
    expect(isClientError(500)).to.be.false;
    expect(isClientError(400)).to.be.true;
  });

  it('parses server errors', () => {
    expect(isServerError(500)).to.be.true;
    expect(isServerError(400)).to.be.false;
  });

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
  });
});
