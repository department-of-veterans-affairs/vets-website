import { expect } from 'chai';

import environment from 'platform/utilities/environment';
import { resolveParamsWithUrl } from '../config';

const center = [35.78, -78.68];
const bounds = [];

describe('Locator url and parameters builder - latLong only', () => {
  const page = 1;
  /**
   * Urgent care - Non-VA urgent care
   */
  it('With facilityType urgent_care and serviceType NonVAUrgentCare Should build a ccp request', () => {
    const result = resolveParamsWithUrl({
      locationType: 'urgent_care',
      serviceType: 'NonVAUrgentCare',
      center,
      page,
      bounds,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      `${environment.API_URL}/facilities_api/v2/ccp/urgent_care?page=1&per_page=10&latitude=35.78&longitude=-78.68`,
    );
  });

  /**
   * Non-VA urgent care pharmacies
   */
  it('With facilityType pharmacy Should build a va ccp request ', () => {
    const result = resolveParamsWithUrl({
      locationType: 'pharmacy',
      page,
      center,
      bounds,
    });
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      `${environment.API_URL}/facilities_api/v2/ccp/pharmacy?page=1&per_page=15&latitude=35.78&longitude=-78.68`,
    );
  });

  /**
   * VA health - All VA health services - PrimaryCare
   */
  it('With facilityType health Should build a va request', () => {
    let result = resolveParamsWithUrl({
      locationType: 'health',
      page,
      center,
      bounds,
    });

    const url = `${environment.API_URL}/facilities_api/v2/va`;

    expect(result.url).to.eql(url);
    expect(result.postParams).to.eql({
      type: 'health',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      mobile: false,
      latitude: '35.78',
      longitude: '-78.68',
    });

    result = resolveParamsWithUrl({
      locationType: 'health',
      serviceType: 'PrimaryCare',
      page,
      center,
      bounds,
    });

    expect(result.url).to.eql(url);
    expect(result.postParams).to.eql({
      type: 'health',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      mobile: false,
      latitude: '35.78',
      longitude: '-78.68',
      services: ['PrimaryCare'],
    });
  });

  /**
   * Urgent care - VA urgent care
   */
  it('With facilityType urgent_care and service type UrgentCare Should build a va request', () => {
    const result = resolveParamsWithUrl({
      locationType: 'urgent_care',
      serviceType: 'UrgentCare',
      page,
      center,
      bounds,
    });

    expect(result.url).to.eql(`${environment.API_URL}/facilities_api/v2/va`);
    expect(result.postParams).to.eql({
      type: 'health',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      mobile: false,
      latitude: '35.78',
      longitude: '-78.68',
      services: ['UrgentCare'],
    });
  });

  /**
   * VA benefits - All - ApplyingForBenefits - VA Home Loan help
   */
  it('With facilityType benefits and serviceType All, ApplyingForBenefits and VAHomeLoanAssistance Should build a va request', () => {
    let result = resolveParamsWithUrl({
      locationType: 'benefits',
      page,
      center,
      bounds,
    });

    const url = `${environment.API_URL}/facilities_api/v2/va`;

    expect(result.url).to.eql(url);
    expect(result.postParams).to.eql({
      type: 'benefits',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      latitude: '35.78',
      longitude: '-78.68',
    });

    result = resolveParamsWithUrl({
      locationType: 'benefits',
      serviceType: 'VAHomeLoanAssistance',
      page,
      center,
      bounds,
    });

    expect(result.url).to.eql(url);
    expect(result.postParams).to.eql({
      type: 'benefits',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      latitude: '35.78',
      longitude: '-78.68',
      services: ['VAHomeLoanAssistance'],
    });

    result = resolveParamsWithUrl({
      locationType: 'benefits',
      serviceType: 'ApplyingForBenefits',
      page,
      center,
      bounds,
    });

    expect(result.url).to.eql(url);
    expect(result.postParams).to.eql({
      type: 'benefits',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      latitude: '35.78',
      longitude: '-78.68',
      services: ['ApplyingForBenefits'],
    });
  });

  /**
   * VA cemeteries
   */
  it('With facilityType cemetery Should build a va request', () => {
    const result = resolveParamsWithUrl({
      locationType: 'cemetery',
      page,
      center,
      bounds,
    });

    expect(result.url).to.eql(`${environment.API_URL}/facilities_api/v2/va`);
    expect(result.postParams).to.eql({
      type: 'cemetery',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      latitude: '35.78',
      longitude: '-78.68',
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
      center,
      bounds,
    });

    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      `${environment.API_URL}/facilities_api/v2/ccp/provider?specialties[]=122300000X&page=1&per_page=15&address=I%2035%20Frontage%20Road,%20Austin,%20Texas%2078753,%20United%20States&latitude=35.78&longitude=-78.68`,
    );
  });

  /**
   * Vet Centers
   */
  it('With facilityType vet_center Should build a va facilities request', () => {
    const result = resolveParamsWithUrl({
      locationType: 'vet_center',
      page,
      center,
      bounds,
    });

    expect(result.url).to.eql(`${environment.API_URL}/facilities_api/v2/va`);
    expect(result.postParams).to.eql({
      type: 'vet_center',
      page: 1,
      // eslint-disable-next-line camelcase
      per_page: 10,
      mobile: false,
      latitude: '35.78',
      longitude: '-78.68',
    });
  });

  /**
   */
  it('With facilityType provider Should build a ccp request with longitude, latitude and radius params', () => {
    const result = resolveParamsWithUrl({
      locationType: 'provider',
      serviceType: '122300000X', // Dentist
      page,
      center: [33.32464, -97.18077],
      radius: 40,
      bounds,
    });

    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      `${environment.API_URL}/facilities_api/v2/ccp/provider?specialties[]=122300000X&page=1&per_page=15&radius=40&latitude=33.32464&longitude=-97.18077`,
    );
  });
});
