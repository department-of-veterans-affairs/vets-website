import { expect } from 'chai';

import environment from 'platform/utilities/environment';
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
      bounds: [-98.52, 29.74, -97.02, 31.24],
      store,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      `${
        environment.API_URL
      }/facilities_api/v2/ccp/urgent_care?page=1&per_page=10&address=14713%20Calaveras%20Drive,%20Austin,%20Texas%2078717,%20United%20States&bbox[]=-98.52&bbox[]=29.74&bbox[]=-97.02&bbox[]=31.24`,
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
      store,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      `${
        environment.API_URL
      }/facilities_api/v2/ccp/pharmacy?page=1&per_page=10&address=I%2035%20Frontage%20Road,%20Austin,%20Texas%2078753,%20United%20States&bbox[]=-98.45&bbox[]=29.59&bbox[]=-96.95&bbox[]=31.09`,
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
      store,
    });
    const url = `${environment.API_URL}/facilities_api/v2/va`;
    expect(result.url).to.eql(url);
    expect(result.postParams).to.eql({
      type: 'health',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      mobile: false,
      bbox: ['-118.9939', '33.3044', '-117.4939', '34.8044'],
    });
    result = resolveParamsWithUrl({
      locationType: 'health',
      serviceType: 'PrimaryCare',
      page,
      bounds: [-98.52, 29.74, -97.02, 31.24],
      store,
    });
    expect(result.url).to.eql(url);
    expect(result.postParams).to.eql({
      type: 'health',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      mobile: false,
      services: ['PrimaryCare'],
      bbox: ['-98.52', '29.74', '-97.02', '31.24'],
    });
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
      store,
    });
    expect(result.url).to.eql(`${environment.API_URL}/facilities_api/v2/va`);
    expect(result.postParams).to.eql({
      type: 'health',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      mobile: false,
      services: ['UrgentCare'],
      bbox: ['-118.9939', '33.3044', '-117.4939', '34.8044'],
    });
  });

  /**
   * VA benefits - All - ApplyingForBenefits - VA Home Loan help
   */
  it('With facilityType benefits and serviceType All, ApplyingForBenefits and VAHomeLoanAssistance Should build a va request', () => {
    let result = resolveParamsWithUrl({
      locationType: 'benefits',
      page,
      bounds: [-98.52, 29.74, -97.02, 31.24],
      store,
    });
    const url = `${environment.API_URL}/facilities_api/v2/va`;
    expect(result.url).to.eql(url);
    expect(result.postParams).to.eql({
      type: 'benefits',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      bbox: ['-98.52', '29.74', '-97.02', '31.24'],
    });
    result = resolveParamsWithUrl({
      locationType: 'benefits',
      serviceType: 'VAHomeLoanAssistance',
      page,
      bounds: [-98.52, 29.74, -97.02, 31.24],
      store,
    });
    expect(result.url).to.eql(url);
    expect(result.postParams).to.eql({
      type: 'benefits',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      services: ['VAHomeLoanAssistance'],
      bbox: ['-98.52', '29.74', '-97.02', '31.24'],
    });
    result = resolveParamsWithUrl({
      locationType: 'benefits',
      serviceType: 'ApplyingForBenefits',
      page,
      bounds: [-98.52, 29.74, -97.02, 31.24],
      store,
    });
    expect(result.url).to.eql(url);
    expect(result.postParams).to.eql({
      type: 'benefits',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      services: ['ApplyingForBenefits'],
      bbox: ['-98.52', '29.74', '-97.02', '31.24'],
    });
  });

  /**
   * VA cemeteries
   */
  it('With facilityType cemetery Should build a va request', () => {
    const result = resolveParamsWithUrl({
      locationType: 'cemetery',
      page,
      bounds: [-98.52, 29.74, -97.02, 31.24],
      store,
    });
    expect(result.url).to.eql(`${environment.API_URL}/facilities_api/v2/va`);
    expect(result.postParams).to.eql({
      type: 'cemetery',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      bbox: ['-98.52', '29.74', '-97.02', '31.24'],
    });
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
      store,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      `${
        environment.API_URL
      }/facilities_api/v2/ccp/provider?specialties[]=122300000X&page=1&per_page=10&address=I%2035%20Frontage%20Road,%20Austin,%20Texas%2078753,%20United%20States&bbox[]=-98.45&bbox[]=29.59&bbox[]=-96.95&bbox[]=31.09`,
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
      store,
    });
    expect(result.url).to.eql(`${environment.API_URL}/facilities_api/v2/va`);
    expect(result.postParams).to.eql({
      type: 'vet_center',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      mobile: false,
      bbox: ['-98.45', '29.59', '-96.95', '31.09'],
    });
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
      store,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      `${
        environment.API_URL
      }/facilities_api/v2/ccp/provider?specialties[]=122300000X&page=1&per_page=10&radius=40&address=I%2035%20Frontage%20Road,%20Austin,%20Texas%2078753,%20United%20States&bbox[]=-98.45&bbox[]=29.59&bbox[]=-96.95&bbox[]=31.09&latitude=33.32464&longitude=-97.18077`,
    );
  });
});
