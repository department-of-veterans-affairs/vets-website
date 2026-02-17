import React from 'react';
import PropTypes from 'prop-types';
import { Toggler } from 'platform/utilities/feature-toggles';
import { connect } from 'react-redux';
import { isSchedulingPreferencesPilotEligible as selectIsSchedulingPreferencesPilotEligible } from 'platform/user/selectors';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../constants';
import Tier2PageContent from './Tier2PageContent';
import { ProfileHubItem } from './hub/ProfileHubItem';

const HealthCareSettings = ({ isSchedulingPreferencesPilotEligible }) => {
  return (
    <Tier2PageContent pageHeader="Health care settings">
      <Toggler toggleName={Toggler.TOGGLE_NAMES.profileHideHealthCareContacts}>
        <Toggler.Disabled>
          <ProfileHubItem
            heading={PROFILE_PATH_NAMES.HEALTH_CARE_CONTACTS}
            content="Review information for emergency contacts and next of kin contacts."
            href={PROFILE_PATHS.HEALTH_CARE_CONTACTS}
          />
        </Toggler.Disabled>
      </Toggler>
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.MESSAGES_SIGNATURE}
        content="Manage the signature on your messages."
        href={PROFILE_PATHS.MESSAGES_SIGNATURE}
      />
      {isSchedulingPreferencesPilotEligible && (
        <ProfileHubItem
          heading={PROFILE_PATH_NAMES.SCHEDULING_PREFERENCES}
          content="Manage your scheduling preferences for health care appointments."
          href={PROFILE_PATHS.SCHEDULING_PREFERENCES}
        />
      )}
      <va-card
        background
        title="Manage your other health care needs on My HealtheVet"
      >
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Manage your other health care needs on My HealtheVet
        </h2>
        <p className="vads-u-margin-bottom--0">
          Go to My HealtheVet on VA.gov to manage your appointments,
          medications, and more.
          <br />
          <va-link href="/my-health/" text="Go to My HealtheVet" />
        </p>
      </va-card>
    </Tier2PageContent>
  );
};

HealthCareSettings.propTypes = {
  isSchedulingPreferencesPilotEligible: PropTypes.bool,
};

const mapStateToProps = state => ({
  isSchedulingPreferencesPilotEligible:
    selectIsSchedulingPreferencesPilotEligible(state),
});

export default connect(mapStateToProps)(HealthCareSettings);
