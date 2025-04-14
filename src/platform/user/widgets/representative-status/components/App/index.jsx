import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';
import {
  createIsServiceAvailableSelector,
  isLOA1,
  isLOA3,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import VerifyAlert from '~/platform/user/authorization/components/VerifyAlert';
import { NoRep } from '../cards';
import { Unauth } from '../alerts';
import { CheckUsersRep } from '../CheckUsersRep';
import { useRepresentativeStatus } from '../../hooks/useRepresentativeStatus';

export const App = ({
  baseHeader,
  toggleLoginModal,
  isUserLOA1,
  isUserLOA3,
}) => {
  // Based on user.icn.present? && user.participant_id.present? in vets-api policy
  // From src/applications/personalization/profile/hooks/useDirectDeposit.js
  const isUserLOA3WithParticipantId = useSelector(
    createIsServiceAvailableSelector(backendServices.LIGHTHOUSE),
  );
  const DynamicHeader = `h${baseHeader}`;
  const DynamicSubheader = `h${baseHeader + 1}`;

  if (isUserLOA3WithParticipantId) {
    return (
      <CheckUsersRep
        DynamicHeader={DynamicHeader}
        DynamicSubheader={DynamicSubheader}
        useRepresentativeStatus={useRepresentativeStatus}
      />
    );
  }

  if (isUserLOA3) {
    return <NoRep DynamicHeader={DynamicHeader} />;
  }

  if (isUserLOA1) {
    return <VerifyAlert />;
  }

  return (
    <Unauth toggleLoginModal={toggleLoginModal} DynamicHeader={DynamicHeader} />
  );
};

App.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
  baseHeader: PropTypes.number,
  hasRepresentative: PropTypes.bool,
  isUserLOA1: PropTypes.bool,
  isUserLOA3: PropTypes.bool,
  loggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  hasRepresentative: state?.user?.login?.hasRepresentative || null,
  isUserLOA1: isLOA1(state),
  isUserLOA3: isLOA3(state),
  signInServiceName: selectProfile(state).signIn?.serviceName,
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
