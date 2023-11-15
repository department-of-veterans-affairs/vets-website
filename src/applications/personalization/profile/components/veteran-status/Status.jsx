import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';

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
        {showProofOfVeteranStatus && (
          <div>Proof of veteran status is under construction.</div>
        )}
      </DowntimeNotification>
    </>
  );
};

const mapStateToProps = () => {
  // TODO: eventually this will get mapped to the military information discharge status in state
  const showProofOfVeteranStatus = true;
  return {
    showProofOfVeteranStatus,
  };
};

VeteranStatusInformation.propTypes = {
  showProofOfVeteranStatus: PropTypes.bool,
};

export default connect(mapStateToProps)(VeteranStatusInformation);
