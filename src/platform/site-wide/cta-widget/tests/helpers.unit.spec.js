import { expect } from 'chai';

import { eauthEnvironmentPrefixes } from 'platform/utilities/sso/constants';
import { toolUrl, widgetTypes } from '../helpers';
import environment from '../../../utilities/environment';

describe('CTA helpers', () => {
  describe('A signed-in SSO user', () => {
    const useSSO = true;

    it('Download my data', () => {
      expect(toolUrl(widgetTypes.HEALTH_RECORDS, useSSO).url).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth?deeplinking=download_my_data`,
      );
    });
    it('Prescription Refill', () => {
      expect(toolUrl(widgetTypes.RX, useSSO).url).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth?deeplinking=prescription_refill`,
      );
    });
    it('Secure Messaging', () => {
      expect(toolUrl(widgetTypes.MESSAGING, useSSO).url).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth?deeplinking=secure_messaging`,
      );
    });
    it('Appointments', () => {
      expect(toolUrl(widgetTypes.VIEW_APPOINTMENTS, useSSO).url).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth?deeplinking=appointments`,
      );
      expect(toolUrl(widgetTypes.SCHEDULE_APPOINTMENTS, useSSO).url).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth?deeplinking=appointments`,
      );
    });
    it('Lab Tests', () => {
      expect(toolUrl(widgetTypes.LAB_AND_TEST_RESULTS, useSSO).url).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth`,
      );
    });
  });
  describe('A signed-in non-SSO user', () => {
    it('Download my data', () => {
      expect(toolUrl(widgetTypes.HEALTH_RECORDS).url).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/download-my-data',
      );
    });
    it('Prescription Refill', () => {
      expect(toolUrl(widgetTypes.RX).url).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/web/myhealthevet/refill-prescriptions',
      );
    });
    it('Secure Messaging', () => {
      expect(toolUrl(widgetTypes.MESSAGING).url).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/secure-messaging',
      );
    });
    it('Appointments', () => {
      expect(toolUrl(widgetTypes.VIEW_APPOINTMENTS).url).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/appointments',
      );
      expect(toolUrl(widgetTypes.SCHEDULE_APPOINTMENTS).url).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/appointments',
      );
    });
    it('Lab Tests', () => {
      expect(toolUrl(widgetTypes.LAB_AND_TEST_RESULTS).url).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/labs-tests',
      );
    });
  });
});
