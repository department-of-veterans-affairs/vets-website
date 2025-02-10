import { expect } from 'chai';

import { mhvUrl, modernUrl } from '../utilities';

describe('modernUrl', () => {
  it('points to modern version of secure-messaging', () => {
    expect(modernUrl(true, 'secure-messaging', true)).to.equal(
      '/my-health/secure-messages/inbox',
    );
  });
  it('points to old version of secure-messaging', () => {
    expect(modernUrl(true, 'secure-messaging', false)).to.equal(
      'https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=secure_messaging',
    );
  });
});

describe('mhvUrl', () => {
  it('should normalize path', () => {
    expect(mhvUrl(false, '/home')).to.equal(
      'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home',
    );
  });

  it('should map SSOe paths', () => {
    expect(mhvUrl(true, 'home')).to.equal(
      'https://int.eauth.va.gov/mhv-portal-web/eauth',
    );
    expect(mhvUrl(true, 'download-my-data')).to.equal(
      'https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=download_my_data',
    );
    expect(mhvUrl(true, 'web/myhealthevet/refill-prescriptions')).to.equal(
      'https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=prescription_refill',
    );
    expect(mhvUrl(true, 'secure-messaging')).to.equal(
      'https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=secure_messaging',
    );
    expect(mhvUrl(true, 'appointments')).to.equal(
      'https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=appointments',
    );
  });

  it('should map non-SSOe paths', () => {
    expect(mhvUrl(false, 'home')).to.equal(
      'https://mhv-syst.myhealth.va.gov/mhv-portal-web/home',
    );
    expect(mhvUrl(false, 'download-my-data')).to.equal(
      'https://mhv-syst.myhealth.va.gov/mhv-portal-web/download-my-data',
    );
    expect(mhvUrl(false, 'web/myhealthevet/refill-prescriptions')).to.equal(
      'https://mhv-syst.myhealth.va.gov/mhv-portal-web/web/myhealthevet/refill-prescriptions',
    );
    expect(mhvUrl(false, 'secure-messaging')).to.equal(
      'https://mhv-syst.myhealth.va.gov/mhv-portal-web/secure-messaging',
    );
    expect(mhvUrl(false, 'appointments')).to.equal(
      'https://mhv-syst.myhealth.va.gov/mhv-portal-web/appointments',
    );
  });
});
