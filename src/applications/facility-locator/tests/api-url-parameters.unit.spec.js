import { expect } from 'chai';

import { resolveParamsWithUrl } from '../config';

describe('Locator url and parameters builder', () => {
  const page = 1;

  /**
   * Urgent care - Non-VA urgent care
   */
  it('With facilityType urgent_care and serviceType NonVAUrgentCare Should build a ccp request', () => {
    const result = resolveParamsWithUrl(
      encodeURI('14713 Calaveras Drive, Austin, Texas 78717, United States'),
      'urgent_care',
      'NonVAUrgentCare',
      page,
      [-98.52, 29.74, -97.02, 31.24],
    );
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://sandbox-api.va.gov/v0/facilities/ccp?address=14713%20Calaveras%20Drive,%20Austin,%20Texas%2078717,%20United%20States&bbox[]=-98.52&bbox[]=29.74&bbox[]=-97.02&bbox[]=31.24&type=cc_urgent_care&page=1&per_page=20&trim=true',
    );
  });

  /**
   * Non-VA urgent care pharmacies
   */
  it('With facilityType cc_pharmacy Should build a va ccp request ', () => {
    const result = resolveParamsWithUrl(
      encodeURI('I 35 Frontage Road, Austin, Texas 78753, United States'),
      'cc_pharmacy',
      undefined,
      page,
      [-98.45, 29.59, -96.95, 31.09],
    );
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://sandbox-api.va.gov/v0/facilities/ccp?address=I%2035%20Frontage%20Road,%20Austin,%20Texas%2078753,%20United%20States&bbox[]=-98.45&bbox[]=29.59&bbox[]=-96.95&bbox[]=31.09&type=cc_pharmacy&page=1&per_page=20&trim=true',
    );
  });

  /**
   * VA health - All VA health services - PrimaryCare
   */
  it('With facilityType health Should build a va request', () => {
    let result = resolveParamsWithUrl(
      undefined,
      'health',
      undefined, // PrimaryCare
      page,
      [-118.9939, 33.3044, -117.4939, 34.8044],
    );
    let test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://sandbox-api.va.gov/v0/facilities/va?bbox[]=-118.9939&bbox[]=33.3044&bbox[]=-117.4939&bbox[]=34.8044&type=health&page=1&per_page=20',
    );
    result = resolveParamsWithUrl(undefined, 'health', 'PrimaryCare', page, [
      -98.52,
      29.74,
      -97.02,
      31.24,
    ]);
    test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://sandbox-api.va.gov/v0/facilities/va?bbox[]=-98.52&bbox[]=29.74&bbox[]=-97.02&bbox[]=31.24&type=health&services[]=PrimaryCare&page=1&per_page=20',
    );
  });

  /**
   * Urgent care - VA urgent care
   */
  it('With facilityType urgent_care and service type UrgentCare/undefined Should build a va request', () => {
    const bounds = [-118.9939, 33.3044, -117.4939, 34.8044];
    const result = resolveParamsWithUrl(
      undefined,
      'urgent_care',
      'UrgentCare',
      page,
      bounds,
    );
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://sandbox-api.va.gov/v0/facilities/va?bbox[]=-118.9939&bbox[]=33.3044&bbox[]=-117.4939&bbox[]=34.8044&type=health&services[]=UrgentCare&page=1&per_page=20',
    );
    const result2 = resolveParamsWithUrl(
      undefined,
      'urgent_care',
      undefined,
      page,
      bounds,
    );
    const test2 = `${result2.url}?${result2.params}`;
    expect(test2).to.eql(
      'https://sandbox-api.va.gov/v0/facilities/va?bbox[]=-118.9939&bbox[]=33.3044&bbox[]=-117.4939&bbox[]=34.8044&type=health&services[]=UrgentCare&page=1&per_page=20',
    );
  });

  /**
   * VA benefits - All - ApplyingForBenefits - VA Home Loan help
   */
  it('With facilityType benefits and serviceType All, ApplyingForBenefits and VAHomeLoanAssistance  Should build a va request', () => {
    let result = resolveParamsWithUrl(undefined, 'benefits', undefined, page, [
      -98.52,
      29.74,
      -97.02,
      31.24,
    ]);
    let test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://sandbox-api.va.gov/v0/facilities/va?bbox[]=-98.52&bbox[]=29.74&bbox[]=-97.02&bbox[]=31.24&type=benefits&page=1&per_page=20',
    );
    result = resolveParamsWithUrl(
      undefined,
      'benefits',
      'VAHomeLoanAssistance',
      page,
      [-98.52, 29.74, -97.02, 31.24],
    );
    test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://sandbox-api.va.gov/v0/facilities/va?bbox[]=-98.52&bbox[]=29.74&bbox[]=-97.02&bbox[]=31.24&type=benefits&services[]=VAHomeLoanAssistance&page=1&per_page=20',
    );
    result = resolveParamsWithUrl(
      undefined,
      'benefits',
      'ApplyingForBenefits',
      page,
      [-98.52, 29.74, -97.02, 31.24],
    );
    test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://sandbox-api.va.gov/v0/facilities/va?bbox[]=-98.52&bbox[]=29.74&bbox[]=-97.02&bbox[]=31.24&type=benefits&services[]=ApplyingForBenefits&page=1&per_page=20',
    );
  });

  /**
   * VA cemeteries
   */
  it('With facilityType cemetery Should build a va request', () => {
    const result = resolveParamsWithUrl(
      undefined,
      'cemetery',
      undefined,
      page,
      [-98.52, 29.74, -97.02, 31.24],
    );
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://sandbox-api.va.gov/v0/facilities/va?bbox[]=-98.52&bbox[]=29.74&bbox[]=-97.02&bbox[]=31.24&type=cemetery&page=1&per_page=20',
    );
  });

  /**
   * Community providers (in VA's network)
   */
  it('With facilityType cc_provider Should build a ccp request', () => {
    const result = resolveParamsWithUrl(
      encodeURI('I 35 Frontage Road, Austin, Texas 78753, United States'),
      'cc_provider',
      '122300000X', // Dentist
      page,
      [-98.45, 29.59, -96.95, 31.09],
    );
    const test = `${result.url}?${result.params}`;
    expect(test).to.eql(
      'https://sandbox-api.va.gov/v0/facilities/ccp?address=I%2035%20Frontage%20Road,%20Austin,%20Texas%2078753,%20United%20States&bbox[]=-98.45&bbox[]=29.59&bbox[]=-96.95&bbox[]=31.09&type=cc_provider&services[]=122300000X&page=1&per_page=20&trim=true',
    );
  });
});
