import { expect } from 'chai';
import {
  parseRedirectUrl,
  declineAndLogout,
  validateWhichRedirectUrlToUse,
} from '../helpers';

describe('parseRedirectUrl', () => {
  const testUrls = {
    [`https%3A%2F%2Fdev.va.gov%2Fauth%2Flogin%2Fcallback%2F%3Ftype%3Didme`]: `https://dev.va.gov/auth/login/callback/?type=idme`,
    [`https://staging-patientportal.myhealth.va.gov`]: `https://staging-patientportal.myhealth.va.gov`,
    [`https://staging-patientportal.myhealth.va.gov/?authenticated=true`]: `https://staging-patientportal.myhealth.va.gov/?authenticated=true`,
    [`https://int.eauth.va.gov/mhv-portal-web/eauth&postLogin=true`]: `https://int.eauth.va.gov/mhv-portal-web/eauth`,
    [`https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=home&postLogin=true`]: `https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=home&postLogin=true`,
    [`https://google.com?q=https://va.gov`]: `https://dev.va.gov`,
    [`https%3A%2F%2Fint.eauth.va.gov%2Fisam%2Fsps%2Fauth%3FPartnerId%3Dhttps%3A%2F%2Fstaging-patientportal.myhealth.va.gov%2Fsession-api%2Fprotocol%2Fsaml2%2Fmetadata`]: `https://int.eauth.va.gov/isam/sps/auth?PartnerId=https://staging-patientportal.myhealth.va.gov/session-api/protocol/saml2/metadata`,
    [`vamobile%3A%2F%2Flogin-success%3Fcode%3D39d23d80-b10d-4e8a-a7e1-7a33fb87211a%26type%3Didme&terms_code=de85bea0-0b00-42a3-b491-d0a834542490`]: `vamobile://login-success?code=39d23d80-b10d-4e8a-a7e1-7a33fb87211a&type=idme&terms_code=de85bea0-0b00-42a3-b491-d0a834542490`,
  };

  Object.entries(testUrls).forEach(([parsedUrl, formattedUrl]) => {
    it('should return the proper url', () => {
      expect(parseRedirectUrl(parsedUrl)).to.eql(formattedUrl);
    });
  });
  expect(parseRedirectUrl(null)).to.eql('https://dev.va.gov');
});

describe('declineAndLogout', () => {
  const oldLocation = window.location;
  afterEach(() => {
    window.location = oldLocation;
  });
  it('should redirect to mobile', () => {
    const oldPath = '/some-random-place';
    window.location.pathname = oldPath;

    declineAndLogout({ termsCodeExists: true, shouldRedirectToMobile: true });
    expect(window.location.pathname).to.not.eql(oldPath);
  });
});

describe('validateWhichRedirectUrlToUse', () => {
  afterEach(() => sessionStorage.clear());

  it('should return proper url to USiP clients', () => {
    const returnUrl = 'http://pint.eauth.va.gov/mhv-portal-web/';
    sessionStorage.setItem('authReturnUrl', returnUrl);

    expect(
      validateWhichRedirectUrlToUse(
        new URL('http://dev.va.gov/?next=loginModal'),
      ),
    ).to.eql(returnUrl);
  });

  it('should return either a redirect_url or ssoeTarget', () => {
    const returnUrl = 'http://dev.va.gov/?next=loginModal';
    sessionStorage.setItem('authReturnUrl', returnUrl);

    const base = 'http://dev.va.gov/terms-of-use/';
    const redirectUrl = 'http://dev.va.gov/auth/login/callback/?type=idme';
    const url1 = new URL(
      `${base}?redirect_url=${encodeURIComponent(redirectUrl)}`,
    );
    const ssoeTarget = 'http://pint.eauth.va.gov/mhv-portal-web';
    const url2 = new URL(
      `${base}?ssoeTarget=${encodeURIComponent(ssoeTarget)}`,
    );

    expect(validateWhichRedirectUrlToUse(url1)).to.not.eql(returnUrl);
    expect(validateWhichRedirectUrlToUse(url1)).to.eql(redirectUrl);
    expect(validateWhichRedirectUrlToUse(url2)).to.not.eql(returnUrl);
    expect(validateWhichRedirectUrlToUse(url2)).to.eql(ssoeTarget);
  });
});
