import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';
import {
  isLOA1,
  isLOA3,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';

import VerifyAlert from 'platform/user/authorization/components/VerifyAlert';

import { Unauth } from '../States/Unauth';
import { Auth } from '../States/Auth';
import { useRepresentativeStatus } from '../../hooks/useRepresentativeStatus';

export const App = ({
  baseHeader,
  toggleLoginModal,
  isUserLOA1,
  isUserLOA3,
}) => {
  const DynamicHeader = `h${baseHeader}`;
  const DynamicSubheader = `h${baseHeader + 1}`;

  if (isUserLOA1) {
    return (
      <>
        <VerifyAlert />
      </>
    );
  }

  if (isUserLOA3) {
    return (
      <>
        <Auth
          DynamicHeader={DynamicHeader}
          DynamicSubheader={DynamicSubheader}
          useRepresentativeStatus={useRepresentativeStatus}
        />
      </>
    );
  }

  return (
    <>
      <Unauth
        toggleLoginModal={toggleLoginModal}
        DynamicHeader={DynamicHeader}
      />
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
