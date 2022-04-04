import { expect } from 'chai';

import { resolveParamsWithUrl } from '../config';

const store = {
  default: {
    getState: () => ({
      // eslint-disable-next-line camelcase
      featureToggles: { facility_locator_lat_long_only: false },
    }),
  },
};

describe('Locator url and parameters builder', () => {
  const page = 1;
  /**
   * Urgent care - Non-VA urgent care
   */
  it('With facilityType urgent_care and serviceType NonVAUrgentCare Should build a ccp request', () => {
    const result = resolveParamsWithUrl({
      address: encodeURI(
        '14713 Calaveras Drive, Austin, Texas 78717, United States',
      ),
      locationType: 'urgent_care',
      serviceType: 'NonVAUrgentCare',
      page,
      center: [34.63, -78.49],
      radius: 53,
      store,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/ccp/urgent_care?page=1&per_page=10&radius=53&address=14713%20Calaveras%20Drive,%20Austin,%20Texas%2078717,%20United%20States&lat=34.63&long=-78.49',
    );
  });

  /**
   * Non-VA urgent care pharmacies
   */
  it('With facilityType pharmacy Should build a va ccp request ', () => {
    const result = resolveParamsWithUrl({
      address: encodeURI(
        'I 35 Frontage Road, Austin, Texas 78753, United States',
      ),
      locationType: 'pharmacy',
      page,
      center: [34.63, -78.49],
      radius: 53,
      store,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/ccp/pharmacy?page=1&per_page=10&radius=53&address=I%2035%20Frontage%20Road,%20Austin,%20Texas%2078753,%20United%20States&lat=34.63&long=-78.49',
    );
  });

  /**
   * VA health - All VA health services - PrimaryCare
   */
  it('With facilityType health Should build a va request', () => {
    let result = resolveParamsWithUrl({
      locationType: 'health',
      page,
      center: [34.63, -78.49],
      radius: 53,
      store,
    });
    let test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?type=health&page=1&per_page=10&mobile=false&radius=53&lat=34.63&long=-78.49',
    );
    result = resolveParamsWithUrl({
      locationType: 'health',
      serviceType: 'PrimaryCare',
      page,
      center: [34.63, -78.49],
      radius: 53,
      store,
    });
    test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?type=health&services[]=PrimaryCare&page=1&per_page=10&mobile=false&radius=53&lat=34.63&long=-78.49',
    );
  });

  /**
   * Urgent care - VA urgent care
   */
  it('With facilityType urgent_care and service type UrgentCare/undefined Should build a va request', () => {
    const result = resolveParamsWithUrl({
      locationType: 'urgent_care',
      serviceType: 'UrgentCare',
      page,
      center: [34.63, -78.49],
      radius: 53,
      store,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?type=health&services[]=UrgentCare&page=1&per_page=10&mobile=false&radius=53&lat=34.63&long=-78.49',
    );
  });

  /**
   * VA benefits - All - ApplyingForBenefits - VA Home Loan help
   */
  it('With facilityType benefits and serviceType All, ApplyingForBenefits and VAHomeLoanAssistance Should build a va request', () => {
    let result = resolveParamsWithUrl({
      locationType: 'benefits',
      page,
      center: [34.63, -78.49],
      radius: 53,
      store,
    });
    let test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?type=benefits&page=1&per_page=10&radius=53&lat=34.63&long=-78.49',
    );
    result = resolveParamsWithUrl({
      locationType: 'benefits',
      serviceType: 'VAHomeLoanAssistance',
      page,
      center: [34.63, -78.49],
      radius: 53,
      store,
    });
    test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?type=benefits&services[]=VAHomeLoanAssistance&page=1&per_page=10&radius=53&lat=34.63&long=-78.49',
    );
    result = resolveParamsWithUrl({
      locationType: 'benefits',
      serviceType: 'ApplyingForBenefits',
      page,
      center: [34.63, -78.49],
      radius: 53,
      store,
    });
    test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?type=benefits&services[]=ApplyingForBenefits&page=1&per_page=10&radius=53&lat=34.63&long=-78.49',
    );
  });

  /**
   * VA cemeteries
   */
  it('With facilityType cemetery Should build a va request', () => {
    const result = resolveParamsWithUrl({
      locationType: 'cemetery',
      page,
      center: [34.63, -78.49],
      radius: 53,
      store,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?type=cemetery&page=1&per_page=10&radius=53&lat=34.63&long=-78.49',
    );
  });

  /**
   * Community providers (in VA's network)
   */
  it('With facilityType provider Should build a ccp request', () => {
    const result = resolveParamsWithUrl({
      address: encodeURI(
        'I 35 Frontage Road, Austin, Texas 78753, United States',
      ),
      locationType: 'provider',
      serviceType: '122300000X', // Dentist
      page,
      center: [34.63, -78.49],
      radius: 53,
      store,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/ccp/provider?specialties[]=122300000X&page=1&per_page=10&radius=53&address=I%2035%20Frontage%20Road,%20Austin,%20Texas%2078753,%20United%20States&lat=34.63&long=-78.49',
    );
  });

  /**
   * Vet Centers
   */
  it('With facilityType vet_center Should build a va facilities request', () => {
    const result = resolveParamsWithUrl({
      locationType: 'vet_center',
      page,
      store,
      center: [33.32464, -97.18077],
      radius: 40,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?type=vet_center&page=1&per_page=10&mobile=false&radius=40&lat=33.32464&long=-97.18077',
    );
  });

  /**
   */
  it('With facilityType provider Should build a ccp request with longitude, latitude and radius params', () => {
    const result = resolveParamsWithUrl({
      address: encodeURI(
        'I 35 Frontage Road, Austin, Texas 78753, United States',
      ),
      locationType: 'provider',
      serviceType: '122300000X', // Dentist
      page,
      center: [33.32464, -97.18077],
      radius: 40,
      store,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/ccp/provider?specialties[]=122300000X&page=1&per_page=10&radius=40&address=I%2035%20Frontage%20Road,%20Austin,%20Texas%2078753,%20United%20States&lat=33.32464&long=-97.18077',
    );
  });
});
