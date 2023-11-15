import { expect } from 'chai';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { resolveParamsWithUrl } from '../config';

describe('Locator url and parameters builder', () => {
  const page = 1;
  const address = '43210';
  const lat = '40.17887';
  const long = '-99.27246';
  const name = 'test';
  const perPage = 10;
  const sort = 'distance_asc';
  const type = 'organization';

  it('should build VA request', () => {
    const result = resolveParamsWithUrl({
      address,
      lat,
      long,
      name,
      page,
      perPage,
      sort,
      type,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      `${
        environment.API_URL
      }/services/veteran/v0/accredited_representatives?address=43210&latitude=40.17887&longitude=-99.27246&name=test&page=1&per_page=10&sort=distance_asc&type=organization`,
    );
  });
});
