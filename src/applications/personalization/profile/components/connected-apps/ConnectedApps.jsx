import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { isEmpty } from 'lodash';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import {
  deleteConnectedApp,
  dismissDeletedAppAlert,
  loadConnectedApps,
} from '@@profile/components/connected-apps/actions';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { AppDeletedAlert } from './AppDeletedAlert';
import { ConnectedApp } from './ConnectedApp';

export class ConnectedApps extends Component {
  componentDidMount() {
    focusElement('[data-focus-target]');
    document.title = `Connected Apps | Veterans Affairs`;
    this.props.loadConnectedApps();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading && !this.props.loading) {
      focusElement('[data-focus-target]');
    }
  }

  confirmDelete = appId => {
    this.props.deleteConnectedApp(appId);
  };

  dismissAlert = appId => {
    this.props.dismissDeletedAppAlert(appId);
  };

  render() {
    const { apps, loading, errors } = this.props;
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
        <h2
          tabIndex="-1"
          className="vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
          data-focus-target
        >
          Connected apps
        </h2>
        {showHasConnectedApps && (
          <p className="va-introtext vads-u-font-size--md">
            Your VA.gov profile is connected to the third-party (non-VA) apps
            listed below. If you want to stop sharing information with an app,
            you can disconnect it from your profile at any time.
          </p>
        )}

        {showHasNoConnectedApps && (
          <>
            <p className="va-introtext vads-u-font-size--md">
              Connected apps are third-party (non-VA) applications or websites
              that can share certain information from your VA.gov profile, with
              your permission. For example, you can connect information from
              your VA health record to an app that helps you track your health.
            </p>

            <p className="va-introtext vads-u-font-size--md">
              We offer this feature for your convenience. It’s always your
              choice whether to connect, or stay connected, to a third-party
              app.
            </p>

            <p className="va-introtext vads-u-font-size--md">
              You don’t have any third-party apps connected to your profile. Go
              to the app directory to find out what apps are available to
              connect to your profile.
            </p>
          </>
        )}

        {showHasServerError && (
          <AlertBox
            className="vads-u-margin-bottom--2"
            headline="We couldn’t retrieve your connected apps"
            status="warning"
            content="We’re sorry. Something went wrong on our end and we couldn’t access your connected apps. Please try again later."
          />
        )}

        {deletedApps.map(app => (
          <AppDeletedAlert
            id={app.id}
            title={app?.attributes?.title}
            privacyUrl={app?.attributes?.privacyUrl}
            key={app.id}
            dismissAlert={this.dismissAlert}
          />
        ))}

        {showHasNoConnectedApps && (
          <Link
            className="usa-button vads-u-margin-bottom--3"
            href="/resources/find-apps-you-can-use"
            onClick={() =>
              recordEvent({
                event: 'go-to-app-directory',
                'profile-action': 'view-link',
                'profile-section': 'connected-apps',
              })
            }
          >
            Go to app directory
          </Link>
        )}

        {loading && (
          <LoadingIndicator setFocus message="Loading your connected apps..." />
        )}
        {!isEmpty(disconnectErrorApps) &&
          disconnectErrorApps.map(app => (
            <AlertBox
              key={`${app.attributes?.title}`}
              className="vads-u-margin-bottom--2"
              headline={`We couldn’t disconnect ${app.attributes?.title}`}
              status="error"
              content={`We’re sorry. Something went wrong on our end and we couldn’t disconnect ${
                app.attributes?.title
              }. Please try again later.`}
            />
          ))}

        {activeApps.map(app => (
          <ConnectedApp
            key={app.id}
            confirmDelete={this.confirmDelete}
            {...app}
          />
        ))}

        {!isEmpty(activeApps) && (
          <div className="vads-u-margin-y--3 available-connected-apps">
            <AdditionalInfo
              triggerText={`What other third-party apps can I connect to my profile?`}
            >
              To find out what other third-party apps are available to connect
              to your profile,{' '}
              <a
                href="/resources/find-apps-you-can-use"
                onClick={() =>
                  recordEvent({
                    event: 'go-to-app-directory',
                    'profile-action': 'view-link',
                    'profile-section': 'connected-apps',
                  })
                }
              >
                go to the app directory
              </a>
            </AdditionalInfo>
          </div>
        )}

        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-background-color--primary-alt-lightest vads-u-padding--2p5 vads-u-margin-top--2">
          <h3 className="vads-u-margin--0 vads-u-font-size--lg">
            Have more questions about connected apps?
          </h3>
          <p>
            <a
              className="vads-u-color--primary-alt-darkest"
              onClick={() =>
                recordEvent({
                  event: 'profile-navigation',
                  'profile-action': 'view-link',
                  'profile-section': 'vets-faqs',
                })
              }
              href="/resources/connected-apps-faqs/"
            >
              Go to FAQs about connecting third-party apps to your VA.gov
              profile
            </a>
          </p>
        </div>
      </div>
    );
  }
}

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
  loadConnectedApps: PropTypes.func.isRequired,
  deleteConnectedApp: PropTypes.func.isRequired,
  dismissDeletedAppAlert: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errors: PropTypes.array,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectedApps);
