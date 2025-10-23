import { expect } from 'chai';
import fetch from 'node-fetch';
import { URLS } from '../../../constants/urls';

async function pingURI(uri) {
  try {
    return await fetch(uri);
  } catch (error) {
    return null;
  }
}

async function checkPingResponse(uri, key) {
  const response = await pingURI(uri);
  describe(key, () => {
    it('should not throw an error', () => {
      expect(response).to.not.be.null;
    });
    it('should return ok response', () => {
      expect(response.ok).to.be.true;
    });
  });
}

// Only run these tests locally.
if (!process.env.GITHUB_ACTIONS) {
  Object.keys(URLS).forEach(key => checkPingResponse(URLS[key], key));
}
