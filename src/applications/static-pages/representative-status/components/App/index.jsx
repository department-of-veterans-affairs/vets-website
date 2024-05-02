import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  isAuthenticatedWithSSOe,
  isAuthenticatedWithOAuth,
} from '@department-of-veterans-affairs/platform-user/authentication/selectors';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { Auth } from '../States/Auth';
import { Unauth } from '../States/Unauth';
import { useRepresentativeStatus } from '../../hooks/useRepresentativeStatus';

export const App = ({
  baseHeader,
  showIntroCopy,
  toggleLoginModal,
  authenticatedWithSSOe,
  authenticatedWithOAuth,
}) => {
  const DynamicHeader = `h${baseHeader}`;
  const DynamicSubheader = `h${baseHeader + 1}`;

  const loggedIn = authenticatedWithSSOe || authenticatedWithOAuth;

  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const togglesLoading = useToggleLoadingValue();

  const appEnabled = useToggleValue(TOGGLE_NAMES.representativeStatusEnabled);

  if (togglesLoading || !appEnabled) {
    return null;
  }

  return (
    <>
      {showIntroCopy && (
        <>
          <h2>Check if you already have an accredited representative</h2>
          <p>
            We don’t automatically assign you an accredited representative, but
            you may have appointed one in the past.
          </p>
          <p>
            If you appoint a new accredited representative, they will replace
            your current one.
          </p>
        </>
      )}

      {loggedIn ? (
        <>
          <Auth
            DynamicHeader={DynamicHeader}
            DynamicSubheader={DynamicSubheader}
            useRepresentativeStatus={useRepresentativeStatus}
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
  showIntroCopy: PropTypes.bool,
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
