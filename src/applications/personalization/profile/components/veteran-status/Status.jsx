import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from '~/platform/utilities/feature-toggles/featureFlagNames';

import { handleDowntimeForSection } from '../alerts/DowntimeBanner';
import Headline from '../ProfileSectionHeadline';

const VeteranStatusInformation = ({ showProofOfVeteranStatus }) => {
  useEffect(() => {
    document.title = `Veteran Status | Veterans Affairs`;
  }, []);

  return (
    <>
      <Headline>Proof of veteran status</Headline>
      <DowntimeNotification
        appTitle="Proof of veteran status"
        render={handleDowntimeForSection('military service')}
        dependencies={[externalServices.emis]}
      >
        {!showProofOfVeteranStatus && (
          <div>Proof of veteran status is under construction.</div>
        )}
      </DowntimeNotification>
    </>
  );
};

const mapStateToProps = state => {
  const showProofOfVeteranStatus =
    toggleValues(state)[FEATURE_FLAG_NAMES.profileShowProofOfVeteranStatus] ||
    false;
  return {
    showProofOfVeteranStatus,
  };
};

VeteranStatusInformation.propTypes = {
  showProofOfVeteranStatus: PropTypes.bool,
};

export default connect(mapStateToProps)(VeteranStatusInformation);
