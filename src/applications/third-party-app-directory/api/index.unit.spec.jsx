// Node modules.
import { expect } from 'chai';

import {
  mockFetch,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers';

// Relative imports.
import { fetchResults, fetchScopes } from './index';

describe('api functions', () => {
  beforeEach(() => {});
  afterEach(() => {});
  describe('fetchResults', () => {
    it('should return a normalized API response', async () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: [
          {
            id: 1,
            name: 'Apple Health',
            logoUrl:
              'https://ok5static.oktacdn.com/fs/bco/4/fs01ca0lwp7cApBuM297',
            appType: 'Third-Party-OAuth',
            serviceCategories: [Array],
            platforms: [Array],
            appUrl: 'https://www.apple.com/ios/health/',
            description:
              'With the Apple Health app, you can see all your health records — such as medications, immunizations, lab results, and more — in one place. The Health app continually updates these records giving you access to a single, integrated snapshot of your health profile whenever you want, quickly and privately. All Health Records data is encrypted and protected with the user’s iPhone passcode, Touch ID or Face ID.',
            privacyUrl: 'https://www.apple.com/legal/privacy/',
            tosUrl: 'https://www.apple.com/legal/sla/',
            createdAt: '2020-11-10T23:26:23.103Z',
            updatedAt: '2020-11-24T16:14:54.196Z',
          },
        ],
      });
      const apiCall = await fetchResults({ mockRequest: true });
      expect(apiCall).to.be.an('object');
    });
  });

  describe('fetchScopes', () => {
    it('should return an array of scopes', async () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: [
          {
            name: 'launch/patient',
            displayName: 'Patient ID',
            description:
              'Your unique VA ID number, called the integration control number or ICN. It is used across VA programs and links your information to you.',
          },
        ],
      });
      const apiCall = await fetchScopes('Health');
      expect(apiCall).to.be.an('object');
    });
  });
});
