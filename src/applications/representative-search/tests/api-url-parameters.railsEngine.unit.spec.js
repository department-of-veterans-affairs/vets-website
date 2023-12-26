import { expect } from 'chai';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { resolveParamsWithUrl } from '../config';

describe('Locator url and parameters builder', () => {
  const address = '43210';
  const lat = '40.17887';
  const long = '-99.27246';
  const name = 'test';
  const sort = 'distance_asc';

  it('should build VA request with type=officer', () => {
    const type = 'officer';

    const result = resolveParamsWithUrl({
      address,
      lat,
      long,
      name,
      page: 1,
      perPage: 10,
      sort,
      type,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      `${
        environment.API_URL
      }/services/veteran/v0/vso_accredited_representatives?address=43210&lat=40.17887&long=-99.27246&name=test&page=1&per_page=10&sort=distance_asc&type=officer`,
    );
  });

  it('should build VA request with type=claim_agents', () => {
    const type = 'claim_agents';
    const result = resolveParamsWithUrl({
      address,
      lat,
      long,
      name,
      page: 1,
      perPage: 10,
      sort,
      type,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      `${
        environment.API_URL
      }/services/veteran/v0/other_accredited_representatives?address=43210&lat=40.17887&long=-99.27246&name=test&page=1&per_page=10&sort=distance_asc&type=claim_agents`,
    );
  });

  it('should build VA request with type=attorney and page = 2 and perPage = 7', () => {
    const type = 'attorney';
    const result = resolveParamsWithUrl({
      address,
      lat,
      long,
      name,
      page: 2,
      perPage: 7,
      sort,
      type,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      `${
        environment.API_URL
      }/services/veteran/v0/other_accredited_representatives?address=43210&lat=40.17887&long=-99.27246&name=test&page=2&per_page=7&sort=distance_asc&type=attorney`,
    );
  });

  it('should exclude null params from request', () => {
    // const type = 'attorney';
    const result = resolveParamsWithUrl({
      address: null,
      lat: null,
      long: null,
      name: null,
      page: 2,
      perPage: 7,
      sort,
      type: null,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      `${
        environment.API_URL
      }/services/veteran/v0/other_accredited_representatives?page=2&per_page=7&sort=distance_asc`,
    );
  });
});
