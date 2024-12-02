import { expect } from 'chai';

import { getAppUrl } from '../registry-helpers';

describe('getAppUrl', () => {
  it('should return an empty string when the registry is empty', () => {
    global.__REGISTRY__ = [];

    const result = getAppUrl('someEntryName');
    expect(result).to.equal('');
  });

  it('should return the rootUrl for a valid entry name', () => {
    global.__REGISTRY__ = [
      { entryName: 'dashboard', rootUrl: '/my-va' },
      {
        entryName: 'hca',
        rootUrl: '/health-care/apply-for-health-care-form-10-10ez',
      },
    ];

    const result = getAppUrl('hca');
    expect(result).to.equal('/health-care/apply-for-health-care-form-10-10ez');
  });

  it('should throw an error when the entry name does not exist', () => {
    global.__REGISTRY__ = [
      { entryName: 'dashboard', rootUrl: '/my-va' },
      {
        entryName: 'hca',
        rootUrl: '/health-care/apply-for-health-care-form-10-10ez',
      },
    ];

    expect(() => getAppUrl('another-app')).to.throw(
      "An app with the entry name 'another-app' does not exist in the registry. Please make sure your content-build repository is up to date.",
    );
  });
});
