import { expect } from 'chai';

import { makeSelectFeatureToggles } from '../feature-toggles';

describe('check-in', () => {
  describe('selector', () => {
    const state = {
      featureToggles: {
        /* eslint-disable camelcase */
        check_in_experience_enabled: true,
        check_in_experience_pre_check_in_enabled: true,
        check_in_experience_demographics_page_enabled: true,
        check_in_experience_update_information_page_enabled: true,
        check_in_experience_next_of_kin_enabled: false,
        check_in_experience_translation_disclaimer_spanish_enabled: false,
        check_in_experience_translation_disclaimer_tagalog_enabled: false,
        check_in_experience_lorota_security_updates_enabled: false,
        check_in_experience_lorota_deletion_enabled: false,
        check_in_experience_travel_reimbursement: false,
        check_in_experience_browser_monitoring: false,
        loading: false,
      },
    };

    describe('makeSelectFeatureToggles', () => {
      it('returns feature toggles', () => {
        const selectFeatureToggles = makeSelectFeatureToggles();
        expect(selectFeatureToggles(state)).to.eql({
          isLoadingFeatureFlags: false,
          isCheckInEnabled: true,
          isPreCheckInEnabled: true,
          isTranslationDisclaimerSpanishEnabled: false,
          isTranslationDisclaimerTagalogEnabled: false,
          isLorotaSecurityUpdatesEnabled: false,
          isLorotaDeletionEnabled: false,
          isTravelReimbursementEnabled: false,
          isBrowserMonitoringEnabled: false,
        });
      });
    });
  });
});
