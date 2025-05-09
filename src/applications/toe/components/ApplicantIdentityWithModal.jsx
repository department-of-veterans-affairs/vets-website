// src/applications/toe/components/ApplicantIdentityWithModal.jsx
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import featureFlagNames from 'platform/utilities/feature-toggles/featureFlagNames';
import NoSponsorModal from './NoSponsorModal';
import ApplicantIdentityView from './ApplicantIdentityView';

/**
 * ApplicantIdentityWithModal
 * Wraps the identity view and conditionally shows NoSponsorModal
 * when sponsors are loaded, none exist, and the feature flag is on.
 */
export const ApplicantIdentityWithModal = ({
  fetchedSponsorsComplete,
  showTextUpdate,
  sponsors,
}) => {
  const sponsorsList = Array.isArray(sponsors.sponsors)
    ? sponsors.sponsors
    : [];
  const shouldShowModal =
    fetchedSponsorsComplete && showTextUpdate && sponsorsList.length === 0;

  return (
    <>
      {shouldShowModal && <NoSponsorModal sponsorsList={sponsorsList} />}
      <ApplicantIdentityView />
    </>
  );
};

ApplicantIdentityWithModal.propTypes = {
  fetchedSponsorsComplete: PropTypes.bool.isRequired,
  showTextUpdate: PropTypes.bool.isRequired,
  sponsors: PropTypes.shape({
    sponsors: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        relationship: PropTypes.string,
      }),
    ),
  }).isRequired,
};

const mapStateToProps = state => {
  const showTextUpdate = Boolean(
    state.featureToggles?.[featureFlagNames.showMeb54901990eTextUpdate],
  );
  const { fetchedSponsorsComplete } = state.data;

  return {
    fetchedSponsorsComplete,
    showTextUpdate,
    sponsors: state.data.sponsors || { sponsors: [] },
  };
};

export default connect(mapStateToProps)(ApplicantIdentityWithModal);
