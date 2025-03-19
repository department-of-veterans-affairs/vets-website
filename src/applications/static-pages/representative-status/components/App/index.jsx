import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';
import {
  isLOA1,
  selectProfile,
} from '@department-of-veterans-affairs/platform-user/selectors';
import { Auth } from '../States/Auth';
import { Unauth } from '../States/Unauth';
import { useRepresentativeStatus } from '../../hooks/useRepresentativeStatus';

export const App = ({ baseHeader, toggleLoginModal, isLoggedIn }) => {
  const DynamicHeader = `h${baseHeader}`;
  const DynamicSubheader = `h${baseHeader + 1}`;

  const loggedIn = isLoggedIn;

  return (
    <>
      {loggedIn ? (
        <div
          aria-live="polite"
          aria-atomic
          tabIndex="-1"
          className="poa-display"
        >
          <Auth
            DynamicHeader={DynamicHeader}
            DynamicSubheader={DynamicSubheader}
            useRepresentativeStatus={useRepresentativeStatus}
          />
        </div>
      ) : (
        <>
          <Unauth
            toggleLoginModal={toggleLoginModal}
            headingLevel={baseHeader}
          />
        </>
      )}
    </>
  );
};

App.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
  baseHeader: PropTypes.number,
  hasRepresentative: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  hasRepresentative: state?.user?.login?.hasRepresentative || null,
  isLoggedIn: state?.user?.login?.currentlyLoggedIn || false,
  isUserLOA1: isLOA1(state),
  signInServiceName: selectProfile(state).signIn?.serviceName,
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
