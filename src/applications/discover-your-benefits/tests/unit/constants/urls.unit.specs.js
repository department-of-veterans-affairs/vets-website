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

describe('URLS', () => {
  it('links to live site.', () => {
    Object.keys(URLS).forEach(key => checkURI(key, URLS[key]));
  });
});
