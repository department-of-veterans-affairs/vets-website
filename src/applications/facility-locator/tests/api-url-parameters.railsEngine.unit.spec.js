import { expect } from 'chai';

import { resolveParamsWithUrl } from '../config';

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
      bounds: [-98.52, 29.74, -97.02, 31.24],
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/ccp/urgent_care?address=14713%20Calaveras%20Drive,%20Austin,%20Texas%2078717,%20United%20States&bbox[]=-98.52&bbox[]=29.74&bbox[]=-97.02&bbox[]=31.24&page=1&per_page=10',
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
      bounds: [-98.45, 29.59, -96.95, 31.09],
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/ccp/pharmacy?address=I%2035%20Frontage%20Road,%20Austin,%20Texas%2078753,%20United%20States&bbox[]=-98.45&bbox[]=29.59&bbox[]=-96.95&bbox[]=31.09&page=1&per_page=10',
    );
  });

  /**
   * VA health - All VA health services - PrimaryCare
   */
  it('With facilityType health Should build a va request', () => {
    let result = resolveParamsWithUrl({
      locationType: 'health',
      page,
      bounds: [-118.9939, 33.3044, -117.4939, 34.8044],
    });
    let test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?bbox[]=-118.9939&bbox[]=33.3044&bbox[]=-117.4939&bbox[]=34.8044&type=health&page=1&per_page=10&mobile=false',
    );
    result = resolveParamsWithUrl({
      locationType: 'health',
      serviceType: 'PrimaryCare',
      page,
      bounds: [-98.52, 29.74, -97.02, 31.24],
    });
    test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?bbox[]=-98.52&bbox[]=29.74&bbox[]=-97.02&bbox[]=31.24&type=health&services[]=PrimaryCare&page=1&per_page=10&mobile=false',
    );
  });

  /**
   * Urgent care - VA urgent care
   */
  it('With facilityType urgent_care and service type UrgentCare/undefined Should build a va request', () => {
    const bounds = [-118.9939, 33.3044, -117.4939, 34.8044];
    const result = resolveParamsWithUrl({
      locationType: 'urgent_care',
      serviceType: 'UrgentCare',
      page,
      bounds,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?bbox[]=-118.9939&bbox[]=33.3044&bbox[]=-117.4939&bbox[]=34.8044&type=health&services[]=UrgentCare&page=1&per_page=10&mobile=false',
    );
  });

  /**
   * VA benefits - All - ApplyingForBenefits - VA Home Loan help
   */
  it('With facilityType benefits and serviceType All, ApplyingForBenefits and VAHomeLoanAssistance Should build a va request', () => {
    let result = resolveParamsWithUrl({
      locationType: 'benefits',
      page,
      bounds: [-98.52, 29.74, -97.02, 31.24],
    });
    let test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?bbox[]=-98.52&bbox[]=29.74&bbox[]=-97.02&bbox[]=31.24&type=benefits&page=1&per_page=10',
    );
    result = resolveParamsWithUrl({
      locationType: 'benefits',
      serviceType: 'VAHomeLoanAssistance',
      page,
      bounds: [-98.52, 29.74, -97.02, 31.24],
    });
    test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?bbox[]=-98.52&bbox[]=29.74&bbox[]=-97.02&bbox[]=31.24&type=benefits&services[]=VAHomeLoanAssistance&page=1&per_page=10',
    );
    result = resolveParamsWithUrl({
      locationType: 'benefits',
      serviceType: 'ApplyingForBenefits',
      page,
      bounds: [-98.52, 29.74, -97.02, 31.24],
    });
    test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?bbox[]=-98.52&bbox[]=29.74&bbox[]=-97.02&bbox[]=31.24&type=benefits&services[]=ApplyingForBenefits&page=1&per_page=10',
    );
  });

  /**
   * VA cemeteries
   */
  it('With facilityType cemetery Should build a va request', () => {
    const result = resolveParamsWithUrl({
      locationType: 'cemetery',
      page,
      bounds: [-98.52, 29.74, -97.02, 31.24],
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?bbox[]=-98.52&bbox[]=29.74&bbox[]=-97.02&bbox[]=31.24&type=cemetery&page=1&per_page=10',
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
      bounds: [-98.45, 29.59, -96.95, 31.09],
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/ccp/provider?address=I%2035%20Frontage%20Road,%20Austin,%20Texas%2078753,%20United%20States&bbox[]=-98.45&bbox[]=29.59&bbox[]=-96.95&bbox[]=31.09&specialties[]=122300000X&page=1&per_page=10',
    );
  });

  /**
   * Vet Centers
   */
  it('With facilityType vet_center Should build a va facilities request', () => {
    const result = resolveParamsWithUrl({
      locationType: 'vet_center',
      page,
      bounds: [-98.45, 29.59, -96.95, 31.09],
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/va?bbox[]=-98.45&bbox[]=29.59&bbox[]=-96.95&bbox[]=31.09&type=vet_center&page=1&per_page=10&mobile=false',
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
      bounds: [-98.45, 29.59, -96.95, 31.09],
      center: [33.32464, -97.18077],
      radius: 40,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://dev-api.va.gov/facilities_api/v1/ccp/provider?address=I%2035%20Frontage%20Road,%20Austin,%20Texas%2078753,%20United%20States&bbox[]=-98.45&bbox[]=29.59&bbox[]=-96.95&bbox[]=31.09&specialties[]=122300000X&page=1&per_page=10&radius=40&latitude=33.32464&longitude=-97.18077',
    );
  });
});
