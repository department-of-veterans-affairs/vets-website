import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  isAuthenticatedWithSSOe,
  isAuthenticatedWithOAuth,
} from '@department-of-veterans-affairs/platform-user/authentication/selectors';

import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { Auth } from './States/Auth';
import { Unauth } from './States/Unauth';

export const App = ({
  baseHeader,
  toggleLoginModal,
  authenticatedWithSSOe,
  authenticatedWithOAuth,
}) => {
  const DynamicHeader = `h${baseHeader}`;
  const DynamicSubheader = `h${baseHeader + 1}`;

  const loggedIn = authenticatedWithSSOe || authenticatedWithOAuth;

  return (
    <>
      {loggedIn ? (
        <>
          {' '}
          <Auth
            DynamicHeader={DynamicHeader}
            DynamicSubheader={DynamicSubheader}
          />
        </>
      ) : (
        <>
          <Unauth
            toggleLoginModal={toggleLoginModal}
            DynamicHeader={DynamicHeader}
          />
        </>
      )}
    </>
  );
};

App.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
  authenticatedWithOAuth: PropTypes.bool,
  authenticatedWithSSOe: PropTypes.bool,
  baseHeader: PropTypes.number,
  hasRepresentative: PropTypes.bool,
};

const mapStateToProps = state => ({
  hasRepresentative: state?.user?.login?.hasRepresentative || null,
  authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  authenticatedWithOAuth: isAuthenticatedWithOAuth(state),
});

const mapDispatchToProps = dispatch => ({
  toggleLoginModal: open => dispatch(toggleLoginModalAction(open)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
