import { expect } from 'chai';

import { resolveParamsWithUrl } from '../config';

describe('Locator url and parameters builder', () => {
  const bounds = [-118.9939, 33.3044, -117.4939, 34.8044];
  const page = 1;

  it('With facilityType urgent_care and service type UrgentCare Should build a va request', () => {
    const result = resolveParamsWithUrl(
      undefined,
      'urgent_care',
      'UrgentCare',
      page,

      bounds,
    );
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/v0/facilities/va?bbox[]=-118.9939&bbox[]=33.3044&bbox[]=-117.4939&bbox[]=34.8044&type=health&services[]=UrgentCare&page=1&per_page=20',
    );
  });
});
