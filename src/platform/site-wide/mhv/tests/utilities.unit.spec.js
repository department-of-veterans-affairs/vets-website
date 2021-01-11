import { expect } from 'chai';

import { mhvUrl } from '../utilities';

describe('mhvUrl', () => {
  it('should normalize path', () => {
    expect(mhvUrl('/home')).to.equal(
      'https://int.eauth.va.gov/mhv-portal-web/eauth',
    );
  });

  it('should map SSOe paths', () => {
    expect(mhvUrl('home')).to.equal(
      'https://int.eauth.va.gov/mhv-portal-web/eauth',
    );
    expect(mhvUrl('download-my-data')).to.equal(
      'https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=download_my_data',
    );
    expect(mhvUrl('web/myhealthevet/refill-prescriptions')).to.equal(
      'https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=prescription_refill',
    );
    expect(mhvUrl('secure-messaging')).to.equal(
      'https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=secure_messaging',
    );
    expect(mhvUrl('appointments')).to.equal(
      'https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=appointments',
    );
  });
});
