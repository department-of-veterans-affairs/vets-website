import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ConnectedApp } from './ConnectedApp';
import recordEvent from 'platform/monitoring/record-event';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { AppDeletedAlert } from './AppDeletedAlert';
import {
  deleteConnectedApp,
  dismissDeletedAppAlert,
  loadConnectedApps,
} from 'applications/personalization/profile-2/components/connected-apps/actions';

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
    const { apps, loading } = this.props;
    const deletedApps = apps ? apps.filter(app => app.deleted) : [];
    const activeApps = apps ? apps.filter(app => !app.deleted) : [];

    const allAppsDeleted = deletedApps?.length === apps?.length;

    return (
      <div className="va-connected-apps">
        <h2
          tabIndex="-1"
          className="vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
          data-focus-target
        >
          Connected apps
        </h2>

        {apps &&
          !allAppsDeleted && (
            <p className="va-introtext vads-u-font-size--md">
              You’ve given these third-party apps or websites access to some of
              your Veteran data, like health or service records. You can remove
              their access at any time by disconnecting the app. Disconnected
              apps can’t receive any new data from VA, but may still have access
              to information that you’ve previously shared.
            </p>
          )}

        {!apps ||
          (allAppsDeleted && (
            <p className="va-introtext vads-u-font-size--md">
              You don’t currently have any third-party apps or websites
              connected to your Veteran data, like health or service records.
              When you do, this is where you can manage them.
            </p>
          ))}

        {loading && (
          <LoadingIndicator setFocus message="Loading your connected apps..." />
        )}

        {deletedApps.map(app => (
          <AppDeletedAlert
            id={app.id}
            appName={app?.attributes?.title}
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

        <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-top--2">
          <h3 className="vads-u-margin--0 vads-u-font-size--lg">
            Have questions about connecting to VA.gov?
          </h3>
          <p>
            Get answers to frequently asked questions about how connected
            third-party apps work, what types of information they can see, and
            the benefits of sharing your information.
          </p>

          <a
            className="vads-u-color--primary-alt-darkest"
            href="/sign-in-faq/"
            onClick={() =>
              recordEvent({
                event: 'account-navigation',
                'account-action': 'view-link',
                'account-section': 'vets-faqs',
              })
            }
          >
            Go to Connected Account FAQs
          </a>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectedApps);
