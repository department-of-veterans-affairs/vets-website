import { expect } from 'chai';
import fetch from 'node-fetch';
import { URLS } from '../../../constants/urls';

async function checkURI(key, uri) {
  try {
    const response = await fetch(uri);
    return expect(response.ok).is.true;
  } catch (error) {
    throw new Error(
      `URI does not exist: ${uri}\nKey:${key}\nFull Error Message: ${error}`,
    );
  }
}

// Only run these tests locally.
if (!process.env.GITHUB_ACTIONS) {
  describe('URLS', () => {
    it('should link to live site.', () => {
      Object.keys(URLS).forEach(key => checkURI(key, URLS[key]));
    });
  });
}
