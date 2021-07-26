import { expect } from 'chai';

import { eauthEnvironmentPrefixes } from 'platform/utilities/sso/constants';
import { CTA_WIDGET_TYPES, ctaWidgetsLookup } from '../ctaWidgets';
import environment from '../../../utilities/environment';

describe('CTA helpers', () => {
  describe('A signed-in SSO user', () => {
    const useSSO = true;

    it('Download my data', () => {
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.HEALTH_RECORDS
        ]?.deriveToolUrlDetails(useSSO)?.url,
      ).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth?deeplinking=download_my_data`,
      );
    });
    it('Prescription Refill', () => {
      expect(
        ctaWidgetsLookup?.[CTA_WIDGET_TYPES?.RX]?.deriveToolUrlDetails(useSSO)
          ?.url,
      ).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth?deeplinking=prescription_refill`,
      );
    });
    it('Secure Messaging', () => {
      expect(
        ctaWidgetsLookup?.[CTA_WIDGET_TYPES?.MESSAGING]?.deriveToolUrlDetails(
          useSSO,
        )?.url,
      ).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth?deeplinking=secure_messaging`,
      );
    });
    it('Appointments', () => {
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.VIEW_APPOINTMENTS
        ]?.deriveToolUrlDetails(useSSO)?.url,
      ).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth?deeplinking=appointments`,
      );
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.SCHEDULE_APPOINTMENTS
        ]?.deriveToolUrlDetails(useSSO)?.url,
      ).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth?deeplinking=appointments`,
      );
    });
    it('Lab Tests', () => {
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.LAB_AND_TEST_RESULTS
        ]?.deriveToolUrlDetails(useSSO)?.url,
      ).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth`,
      );
    });
  });

  describe('A signed-in non-SSO user', () => {
    it('Download my data', () => {
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.HEALTH_RECORDS
        ]?.deriveToolUrlDetails()?.url,
      ).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/download-my-data',
      );
    });
    it('Prescription Refill', () => {
      expect(
        ctaWidgetsLookup?.[CTA_WIDGET_TYPES?.RX]?.deriveToolUrlDetails()?.url,
      ).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/web/myhealthevet/refill-prescriptions',
      );
    });
    it('Secure Messaging', () => {
      expect(
        ctaWidgetsLookup?.[CTA_WIDGET_TYPES?.MESSAGING]?.deriveToolUrlDetails()
          ?.url,
      ).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/secure-messaging',
      );
    });
    it('Appointments', () => {
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.VIEW_APPOINTMENTS
        ]?.deriveToolUrlDetails()?.url,
      ).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/appointments',
      );
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.SCHEDULE_APPOINTMENTS
        ]?.deriveToolUrlDetails()?.url,
      ).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/appointments',
      );
    });
    it('Lab Tests', () => {
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.LAB_AND_TEST_RESULTS
        ]?.deriveToolUrlDetails()?.url,
      ).to.equal('https://mhv-syst.myhealth.va.gov/mhv-portal-web/labs-tests');
    });
  });
});
