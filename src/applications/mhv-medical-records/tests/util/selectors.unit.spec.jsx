import { expect } from 'chai';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import {
  selectBypassDowntime,
  selectFilterAndSortFlag,
  selectImagesDomainFlag,
  selectHoldTimeMessagingUpdate,
} from '../../util/selectors';

describe('Medical Records selectors', () => {
  describe('selectBypassDowntime', () => {
    it('returns true when the flag is enabled', () => {
      const state = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvBypassDowntimeNotification]: true,
        },
      };
      expect(selectBypassDowntime(state)).to.be.true;
    });

    it('returns false when the flag is disabled', () => {
      const state = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvBypassDowntimeNotification]: false,
        },
      };
      expect(selectBypassDowntime(state)).to.be.false;
    });

    it('returns undefined when the flag is not present', () => {
      const state = { featureToggles: {} };
      expect(selectBypassDowntime(state)).to.be.undefined;
    });
  });

  describe('selectFilterAndSortFlag', () => {
    it('returns true when the flag is enabled', () => {
      const state = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicalRecordsFilterAndSort]: true,
        },
      };
      expect(selectFilterAndSortFlag(state)).to.be.true;
    });

    it('returns false when the flag is disabled', () => {
      const state = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicalRecordsFilterAndSort]: false,
        },
      };
      expect(selectFilterAndSortFlag(state)).to.be.false;
    });
  });

  describe('selectImagesDomainFlag', () => {
    it('returns true when the flag is enabled', () => {
      const state = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicalRecordsImagesDomain]: true,
        },
      };
      expect(selectImagesDomainFlag(state)).to.be.true;
    });

    it('returns false when the flag is disabled', () => {
      const state = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicalRecordsImagesDomain]: false,
        },
      };
      expect(selectImagesDomainFlag(state)).to.be.false;
    });
  });

  describe('selectHoldTimeMessagingUpdate', () => {
    it('returns true when the flag is enabled', () => {
      const state = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicalRecordsHoldTimeMessagingUpdate]: true,
        },
      };
      expect(selectHoldTimeMessagingUpdate(state)).to.be.true;
    });

    it('returns false when the flag is disabled', () => {
      const state = {
        featureToggles: {
          [FEATURE_FLAG_NAMES.mhvMedicalRecordsHoldTimeMessagingUpdate]: false,
        },
      };
      expect(selectHoldTimeMessagingUpdate(state)).to.be.false;
    });
  });
});
