import { expect } from 'chai';
import { getConfigFromLanguageCode } from '../utilities/helpers';
import { DEFAULT_LANGUAGE, TRANSLATED_LANGUAGES } from '../utilities/constants';

describe('getConfigFromLanguageCode util', () => {
  it('should return english config for non-matching language codes and "en"', () => {
    const codes = ['en', 'zh', 'something-random', '', null];

    for (const code of codes) {
      expect(getConfigFromLanguageCode(code)).to.equal(DEFAULT_LANGUAGE);
    }
  });

  it('should return spanish config for "es"', () => {
    const code = 'es';

    expect(getConfigFromLanguageCode(code)).to.equal(TRANSLATED_LANGUAGES[0]);
  });

  it('should return tagalog config for "tl"', () => {
    const code = 'tl';

    expect(getConfigFromLanguageCode(code)).to.equal(TRANSLATED_LANGUAGES[1]);
  });
});
