import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import {
  deleteConnectedApp,
  dismissDeletedAppAlert,
  loadConnectedApps,
} from 'applications/personalization/profile-2/components/connected-apps/actions';
import recordEvent from 'platform/monitoring/record-event';
import { AdditionalInfoSections } from './AdditionalInfoSections';
import { AppDeletedAlert } from './AppDeletedAlert';
import availableConnectedApps from './availableConnectedApps';
import { ConnectedApp } from './ConnectedApp';

export class ConnectedApps extends Component {
  componentDidMount() {
    this.props.loadConnectedApps();
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
    const showHasNoConnectedApps = !apps || (allAppsDeleted && !loading);
    const showHasConnectedApps = apps && !allAppsDeleted;
    // Check if any of the active apps have errors
    const disconnectErrorApps = activeApps.filter(app => !isEmpty(app.errors));

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
          <div className="connected-apps-intro">
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
            <h3>Third-party apps you can connect to your profile</h3>
            <ul className="vads-u-padding-left--0 vads-u-margin-bottom--2">
              {availableConnectedApps?.map(app => {
                return (
                  <li key={app.name} className="vads-u-padding-left--3">
                    <a
                      href={app.appURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {app.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
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
        {!isEmpty(errors) && (
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
            key={app.id}
            dismissAlert={this.dismissAlert}
          />
        ))}
        {activeApps.map((app, idx) => (
          <ConnectedApp
            key={app.id}
            confirmDelete={this.confirmDelete}
            {...app}
          />
        ))}
        <AdditionalInfoSections activeApps={activeApps} />
        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-background-color--primary-alt-lightest vads-u-padding--2p5 vads-u-margin-top--2">
          <h3 className="vads-u-margin--0 vads-u-font-size--lg">
            Have more questions about connected apps?
          </h3>
          <p>
            Visit our{' '}
            <a
              className="vads-u-color--primary-alt-darkest"
              onClick={() =>
                recordEvent({
                  event: 'account-navigation',
                  'account-action': 'view-link',
                  'account-section': 'vets-faqs',
                })
              }
              href="/sign-in-faq/"
            >
              frequently asked questions
            </a>
            .
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
