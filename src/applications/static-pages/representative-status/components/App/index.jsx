import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  isAuthenticatedWithSSOe,
  isAuthenticatedWithOAuth,
} from '@department-of-veterans-affairs/platform-user/authentication/selectors';
import { toggleLoginModal as toggleLoginModalAction } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import { Auth } from '../States/Auth';
import { Unauth } from '../States/Unauth';
import { useRepresentativeStatus } from '../../hooks/useRepresentativeStatus';

export const App = ({
  baseHeader,
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
