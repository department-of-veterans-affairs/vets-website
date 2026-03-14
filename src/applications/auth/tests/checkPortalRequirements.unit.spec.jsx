import { expect } from 'chai';
import { checkPortalRequirements } from '../helpers';

describe('checkPortalRequirements', () => {
  const buildUserAttributes = ({
    isCernerPatient = true,
    vaPatient = true,
    userFacilityReadyForInfoAlert = false,
    userAtPretransitionedOhFacility = false,
  } = {}) => ({
    vaProfile: {
      isCernerPatient,
      vaPatient,
      ohMigrationInfo: {
        userFacilityReadyForInfoAlert,
        userAtPretransitionedOhFacility,
      },
    },
  });

  describe('needsPortalNotice', () => {
    it('returns true when provisioned, vaPatient, isCernerPatient, and userFacilityReadyForInfoAlert', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: true,
        provisioned: true,
        userAttributes: buildUserAttributes({
          isCernerPatient: true,
          vaPatient: true,
          userFacilityReadyForInfoAlert: true,
        }),
      });
      expect(result.needsPortalNotice).to.be.true;
    });

    it('returns false when not provisioned', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: true,
        provisioned: false,
        userAttributes: buildUserAttributes({
          isCernerPatient: true,
          vaPatient: true,
          userFacilityReadyForInfoAlert: true,
        }),
      });
      expect(result.needsPortalNotice).to.be.false;
    });

    it('returns false when not vaPatient', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: true,
        provisioned: true,
        userAttributes: buildUserAttributes({
          isCernerPatient: true,
          vaPatient: false,
          userFacilityReadyForInfoAlert: true,
        }),
      });
      expect(result.needsPortalNotice).to.be.false;
    });

    it('returns false when not isCernerPatient', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: true,
        provisioned: true,
        userAttributes: buildUserAttributes({
          isCernerPatient: false,
          vaPatient: true,
          userFacilityReadyForInfoAlert: true,
        }),
      });
      expect(result.needsPortalNotice).to.be.false;
    });

    it('returns false when userFacilityReadyForInfoAlert is false', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: true,
        provisioned: true,
        userAttributes: buildUserAttributes({
          isCernerPatient: true,
          vaPatient: true,
          userFacilityReadyForInfoAlert: false,
        }),
      });
      expect(result.needsPortalNotice).to.be.false;
    });

    it('returns false when isPortalNoticeInterstitialEnabled is false', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: false,
        provisioned: true,
        userAttributes: buildUserAttributes({
          isCernerPatient: true,
          vaPatient: true,
          userFacilityReadyForInfoAlert: true,
        }),
      });
      expect(result.needsPortalNotice).to.be.false;
    });
  });

  describe('needsMyHealth', () => {
    it('returns true when toggle enabled, provisioned, vaPatient, isCernerPatient, and not at pretransitioned OH facility', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: true,
        provisioned: true,
        userAttributes: buildUserAttributes({
          isCernerPatient: true,
          vaPatient: true,
          userAtPretransitionedOhFacility: false,
        }),
      });
      expect(result.needsMyHealth).to.be.true;
    });

    it('returns true when user is not a Cerner patient', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: true,
        provisioned: true,
        userAttributes: buildUserAttributes({
          isCernerPatient: false,
          vaPatient: true,
          userAtPretransitionedOhFacility: true,
        }),
      });
      expect(result.needsMyHealth).to.be.true;
    });

    it('returns false when user is at pretransitioned OH facility', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: true,
        provisioned: true,
        userAttributes: buildUserAttributes({
          isCernerPatient: true,
          vaPatient: true,
          userAtPretransitionedOhFacility: true,
        }),
      });
      expect(result.needsMyHealth).to.be.false;
    });

    it('returns false when toggle is disabled', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: false,
        provisioned: true,
        userAttributes: buildUserAttributes({
          isCernerPatient: true,
          vaPatient: true,
          userAtPretransitionedOhFacility: false,
        }),
      });
      expect(result.needsMyHealth).to.be.false;
    });

    it('returns false when not provisioned', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: true,
        provisioned: false,
        userAttributes: buildUserAttributes({
          isCernerPatient: true,
          vaPatient: true,
          userAtPretransitionedOhFacility: false,
        }),
      });
      expect(result.needsMyHealth).to.be.false;
    });

    it('returns false when not vaPatient', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: true,
        provisioned: true,
        userAttributes: buildUserAttributes({
          isCernerPatient: true,
          vaPatient: false,
          userAtPretransitionedOhFacility: false,
        }),
      });
      expect(result.needsMyHealth).to.be.false;
    });
  });

  describe('edge cases', () => {
    it('handles missing userAttributes gracefully', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: true,
        provisioned: true,
        userAttributes: undefined,
      });
      expect(result.needsPortalNotice).to.be.false;
      expect(result.needsMyHealth).to.be.false;
    });

    it('handles missing ohMigrationInfo gracefully', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: true,
        provisioned: true,
        userAttributes: {
          vaProfile: { isCernerPatient: true, vaPatient: true },
        },
      });
      expect(result.needsPortalNotice).to.be.false;
      expect(result.needsMyHealth).to.be.true;
    });

    it('handles empty vaProfile gracefully', () => {
      const result = checkPortalRequirements({
        isPortalNoticeInterstitialEnabled: true,
        provisioned: true,
        userAttributes: { vaProfile: {} },
      });
      expect(result.needsPortalNotice).to.be.false;
      expect(result.needsMyHealth).to.be.false;
    });
  });
});
