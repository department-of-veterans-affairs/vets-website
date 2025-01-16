// Node modules.
import { expect } from 'chai';
// Relative imports.
import environment from 'platform/utilities/environment';
import { eauthEnvironmentPrefixes } from 'platform/utilities/sso/constants';
import { CTA_WIDGET_TYPES, ctaWidgetsLookup } from '../ctaWidgets';

describe('CTA widgets', () => {
  describe('a signed-in SSO user', () => {
    const useSSO = true;

    it('should see the correct HEALTH_RECORDS tool URL', () => {
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
    it('should see the correct RX tool URL', () => {
      expect(
        ctaWidgetsLookup?.[CTA_WIDGET_TYPES?.RX]?.deriveToolUrlDetails(useSSO)
          ?.url,
      ).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth?deeplinking=prescription_refill`,
      );
    });
    it('should see the correct MESSAGING tool URL', () => {
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
    it('should see the correct VIEW_APPOINTMENTS + SCHEDULE_APPOINTMENTS tool URL', () => {
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.VIEW_APPOINTMENTS
        ]?.deriveToolUrlDetails(useSSO)?.url,
      ).to.equal('/my-health/appointments');
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
    it('should see the correct LAB_AND_TEST_RESULTS tool URL', () => {
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.LAB_AND_TEST_RESULTS
        ]?.deriveToolUrlDetails(useSSO)?.url,
      ).to.equal(
        `https://${
          eauthEnvironmentPrefixes[environment.BUILDTYPE]
        }eauth.va.gov/mhv-portal-web/eauth?deeplinking=labs-tests`,
      );
    });
  });

  describe('a signed-in non-SSO user', () => {
    it('should see the correct HEALTH_RECORDS tool URL', () => {
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.HEALTH_RECORDS
        ]?.deriveToolUrlDetails()?.url,
      ).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/download-my-data',
      );
    });
    it('should see the correct RX tool URL', () => {
      expect(
        ctaWidgetsLookup?.[CTA_WIDGET_TYPES?.RX]?.deriveToolUrlDetails()?.url,
      ).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/web/myhealthevet/refill-prescriptions',
      );
    });
    it('should see the correct MESSAGING tool URL', () => {
      expect(
        ctaWidgetsLookup?.[CTA_WIDGET_TYPES?.MESSAGING]?.deriveToolUrlDetails()
          ?.url,
      ).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/secure-messaging',
      );
    });
    it('should see the correct VIEW_APPOINTMENTS + SCHEDULE_APPOINTMENTS tool URL', () => {
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.VIEW_APPOINTMENTS
        ]?.deriveToolUrlDetails()?.url,
      ).to.equal('/my-health/appointments');
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.SCHEDULE_APPOINTMENTS
        ]?.deriveToolUrlDetails()?.url,
      ).to.equal(
        'https://mhv-syst.myhealth.va.gov/mhv-portal-web/appointments',
      );
    });
    it('should see the correct LAB_AND_TEST_RESULTS tool URL', () => {
      expect(
        ctaWidgetsLookup?.[
          CTA_WIDGET_TYPES?.LAB_AND_TEST_RESULTS
        ]?.deriveToolUrlDetails()?.url,
      ).to.equal('https://mhv-syst.myhealth.va.gov/mhv-portal-web/labs-tests');
    });
  });
});
