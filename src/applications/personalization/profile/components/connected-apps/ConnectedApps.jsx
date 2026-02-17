import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import {
  deleteConnectedApp,
  dismissDeletedAppAlert,
  loadConnectedApps,
} from '@@profile/components/connected-apps/actions';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { Toggler } from '~/platform/utilities/feature-toggles';
import LoadFail from '../alerts/LoadFail';
import Headline from '../ProfileSectionHeadline';
import { AppDeletedAlert } from './AppDeletedAlert';
import { ConnectedApp } from './ConnectedApp';

export const ConnectedApps = ({
  apps,
  loading,
  errors,
  loadConnectedApps: dispatchLoadConnectedApps,
  deleteConnectedApp: dispatchDeleteConnectedApp,
}) => {
  const prevLoadingRef = useRef();

  useEffect(
    () => {
      focusElement('[data-focus-target]');
      document.title = `Connected Apps | Veterans Affairs`;
      dispatchLoadConnectedApps();
    },
    [dispatchLoadConnectedApps],
  );

  useEffect(
    () => {
      if (prevLoadingRef.current && !loading) {
        focusElement('[data-focus-target]');
      }
      prevLoadingRef.current = loading;
    },
    [loading],
  );

  const confirmDelete = appId => {
    dispatchDeleteConnectedApp(appId);
  };

  const connectedAppsEvent = () => {
    recordEvent({
      event: 'go-to-app-directory',
      'profile-action': 'view-link',
      'profile-section': 'connected-apps',
    });
  };

  const faqEvent = () => {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'view-link',
      'profile-section': 'vets-faqs',
    });
  };

  const ConnectedAppsAdditionalInfo = () => (
    <va-additional-info
      trigger="What other third-party apps can I connect to my profile?"
      uswds
    >
      <p>
        The app directory lists all third-party apps that you can connect to
        your profile.
      </p>
      <p>
        <a href="/resources/find-apps-you-can-use" onClick={connectedAppsEvent}>
          Go to the app directory
        </a>
      </p>
    </va-additional-info>
  );

  const deletedApps = apps ? apps.filter(app => app.deleted) : [];
  const activeApps = apps ? apps.filter(app => !app.deleted) : [];

  const allAppsDeleted = deletedApps?.length === apps?.length;
  // We treat this 404 'Record not found' error as an empty apps array
  const checkRecordNotFound = error =>
    error?.title === 'Record not found' && error?.status === '404';
  const recordNotFound = errors?.some(checkRecordNotFound);
  const showHasNoConnectedApps =
    !apps || (allAppsDeleted && !loading) || recordNotFound;
  const showHasConnectedApps = apps && !allAppsDeleted;
  // Check if any of the active apps have errors
  const disconnectErrorApps = activeApps.filter(app => !isEmpty(app.errors));
  const showHasServerError = !isEmpty(errors) && !recordNotFound;

  return (
    <div className="va-connected-apps">
      <Headline>Connected apps</Headline>

      {deletedApps.map(app => (
        <AppDeletedAlert
          title={app?.attributes?.title}
          privacyUrl={app?.attributes?.privacyUrl}
          key={app.id}
        />
      ))}
      {!isEmpty(disconnectErrorApps) &&
        disconnectErrorApps.map(app => (
          <>
            <va-alert
              status="error"
              background-only
              key={`${app.attributes?.title}`}
              uswds
            >
              <div>
                <p
                  className="vads-u-margin-y--0"
                  role="alert"
                  aria-live="polite"
                >
                  We’re sorry. We can’t disconnect {app.attributes?.title} from
                  your VA.gov profile right now. We’re working to fix this
                  problem. Please check back later.
                </p>
              </div>
            </va-alert>
          </>
        ))}

      {showHasConnectedApps && (
        <p>
          Your VA.gov profile is connected to the third-party (non-VA) apps
          listed below. If you want to stop sharing information with an app, you
          can disconnect it from your profile at any time.
        </p>
      )}

      {showHasNoConnectedApps && (
        <>
          <p>
            Connected apps are third-party (non-VA) applications or websites
            that can share certain information from your VA.gov profile, with
            your permission. For example, you can connect information from your
            VA health record to an app that helps you track your health.
          </p>

          <p>
            We offer this feature for your convenience. It’s always your choice
            whether to connect, or stay connected, to a third-party app.
          </p>

          <p>
            You don’t have any third-party apps connected to your profile. Go to
            the app directory to find out what apps are available to connect to
            your profile.
          </p>
        </>
      )}

      {showHasServerError && <LoadFail />}

      {showHasNoConnectedApps && (
        <a
          className="vads-u-display--inline-block vads-u-margin-bottom--3"
          href="/resources/find-apps-you-can-use"
          onClick={connectedAppsEvent}
        >
          Go to app directory
        </a>
      )}

      {loading && (
        <va-loading-indicator
          set-focus
          message="Loading your connected apps..."
          data-testid="connected-apps-loading-indicator"
        />
      )}

      {!isEmpty(activeApps) && (
        <Toggler toggleName={Toggler.TOGGLE_NAMES.profile2Enabled}>
          <Toggler.Enabled>
            <div className="vads-u-margin-y--3 available-connected-apps">
              {ConnectedAppsAdditionalInfo()}
            </div>
          </Toggler.Enabled>
        </Toggler>
      )}

      {activeApps.map(app => (
        <ConnectedApp key={app.id} confirmDelete={confirmDelete} {...app} />
      ))}

      {!isEmpty(activeApps) && (
        <Toggler toggleName={Toggler.TOGGLE_NAMES.profile2Enabled}>
          <Toggler.Disabled>
            <div className="vads-u-margin-y--3 available-connected-apps">
              {ConnectedAppsAdditionalInfo()}
            </div>
          </Toggler.Disabled>
        </Toggler>
      )}

      <va-card background uswds>
        <h2 className="vads-u-margin-top--0 vads-u-font-size--lg">
          Have more questions about connected apps?
        </h2>
        <p className="vads-u-margin-bottom--0">
          <a
            className="vads-u-color--primary-alt-darkest"
            onClick={faqEvent}
            href="/resources/connected-apps-faqs/"
          >
            Go to FAQs about connecting third-party apps to your VA.gov profile
          </a>
        </p>
      </va-card>
    </div>
  );
};

const mapStateToProps = state => ({
  ...state.connectedApps,
});

const mapDispatchToProps = {
  loadConnectedApps,
  deleteConnectedApp,
  dismissDeletedAppAlert,
};

ConnectedApps.propTypes = {
  apps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      errors: PropTypes.array,
      deleting: PropTypes.bool,
      attributes: PropTypes.shape({
        title: PropTypes.string.isRequired,
        logo: PropTypes.string.isRequired,
        grants: PropTypes.arrayOf(
          PropTypes.shape({
            created: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
          }),
        ).isRequired,
      }),
    }),
  ).isRequired,
  deleteConnectedApp: PropTypes.func.isRequired,
  dismissDeletedAppAlert: PropTypes.func.isRequired,
  loadConnectedApps: PropTypes.func.isRequired,
  errors: PropTypes.array,
  loading: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectedApps);
