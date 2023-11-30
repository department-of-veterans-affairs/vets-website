import { expect } from 'chai';
import { parseRedirectUrl } from '../helpers';

describe('parseRedirectUrl', () => {
  const testUrls = {
    [`https%3A%2F%2Fdev.va.gov%2Fauth%2Flogin%2Fcallback%2F%3Ftype%3Didme`]: `https://dev.va.gov/auth/login/callback/?type=idme`,
    [`https://staging-patientportal.myhealth.va.gov`]: `https://staging-patientportal.myhealth.va.gov`,
    [`https://staging-patientportal.myhealth.va.gov/?authenticated=true`]: `https://staging-patientportal.myhealth.va.gov/?authenticated=true`,
    [`https://int.eauth.va.gov/mhv-portal-web/eauth&postLogin=true`]: `https://int.eauth.va.gov/mhv-portal-web/eauth`,
    [`https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=home&postLogin=true`]: `https://int.eauth.va.gov/mhv-portal-web/eauth?deeplinking=home&postLogin=true`,
    [`https://google.com?q=https://va.gov`]: `https://dev.va.gov`,
    [`vamobile%3A%2F%2Flogin-success%3Fcode%3D39d23d80-b10d-4e8a-a7e1-7a33fb87211a%26type%3Didme&terms_code=de85bea0-0b00-42a3-b491-d0a834542490`]: `vamobile://login-success?code=39d23d80-b10d-4e8a-a7e1-7a33fb87211a&type=idme&terms_code=de85bea0-0b00-42a3-b491-d0a834542490`,
  };
  Object.entries(testUrls).forEach(([parsedUrl, formattedUrl]) => {
    it('should return the proper url', () => {
      expect(parseRedirectUrl(parsedUrl)).to.eql(formattedUrl);
    });
  });
  expect(parseRedirectUrl(null)).to.eql('https://dev.va.gov');
});
