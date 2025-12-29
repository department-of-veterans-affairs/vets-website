import PropTypes from 'prop-types';
import React, { Component } from 'react';
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

export class ConnectedApps extends Component {
  constructor(...args) {
    super(...args);
    this.connectedAppsEvent = this.connectedAppsEvent.bind(this);
    this.faqEvent = this.faqEvent.bind(this);
  }

  componentDidMount() {
    const { loadConnectedApps: dispatchLoadConnectedApps } = this.props;
    focusElement('[data-focus-target]');
    document.title = `Connected Apps | Veterans Affairs`;
    dispatchLoadConnectedApps();
  }

  componentDidUpdate(prevProps) {
    const { loading } = this.props;
    if (prevProps.loading && !loading) {
      focusElement('[data-focus-target]');
    }
  }

  confirmDelete = appId => {
    const { deleteConnectedApp: dispatchDeleteConnectedApp } = this.props;
    dispatchDeleteConnectedApp(appId);
  };

  connectedAppsEvent = () => {
    recordEvent({
      event: 'go-to-app-directory',
      'profile-action': 'view-link',
      'profile-section': 'connected-apps',
    });
  };

  dismissAlert = appId => {
    const {
      dismissDeletedAppAlert: dispatchDismissDeletedAppAlert,
    } = this.props;
    dispatchDismissDeletedAppAlert(appId);
  };

  faqEvent = () => {
    recordEvent({
      event: 'profile-navigation',
      'profile-action': 'view-link',
      'profile-section': 'vets-faqs',
    });
  };

  ConnectedAppsAdditionalInfo = () => (
    <va-additional-info
      trigger="What other third-party apps can I connect to my profile?"
      uswds
    >
      <p>
        The app directory lists all third-party apps that you can connect to
        your profile.
      </p>
      <p>
        <a
          href="/resources/find-apps-you-can-use"
          onClick={this.connectedAppsEvent}
        >
          go to the app directory
        </a>
      </p>
    </va-additional-info>
  );

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
        <Headline>Connected apps</Headline>

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

        {showHasServerError && <LoadFail />}

        {deletedApps.map(app => (
          <AppDeletedAlert
            title={app?.attributes?.title}
            privacyUrl={app?.attributes?.privacyUrl}
            key={app.id}
          />
        ))}

        {showHasNoConnectedApps && (
          <a
            className="vads-u-margin-bottom--3"
            href="/resources/find-apps-you-can-use"
            onClick={this.connectedAppsEvent}
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
                    We’re sorry. We can’t disconnect {app.attributes?.title}{' '}
                    from your VA.gov profile right now. We’re working to fix
                    this problem. Please check back later.
                  </p>
                </div>
              </va-alert>
            </>
          ))}

        {!isEmpty(activeApps) && (
          <Toggler toggleName={Toggler.TOGGLE_NAMES.profile2Enabled}>
            <Toggler.Enabled>
              <div className="vads-u-margin-y--3 available-connected-apps">
                {this.ConnectedAppsAdditionalInfo()}
              </div>
            </Toggler.Enabled>
          </Toggler>
        )}

        {activeApps.map(app => (
          <ConnectedApp
            key={app.id}
            confirmDelete={this.confirmDelete}
            {...app}
          />
        ))}

        {!isEmpty(activeApps) && (
          <Toggler toggleName={Toggler.TOGGLE_NAMES.profile2Enabled}>
            <Toggler.Disabled>
              <div className="vads-u-margin-y--3 available-connected-apps">
                {this.ConnectedAppsAdditionalInfo()}
              </div>
            </Toggler.Disabled>
          </Toggler>
        )}

        <va-summary-box uswds class="vads-u-margin-top--2">
          <h2
            slot="headline"
            className="vads-u-margin-top--0 vads-u-font-size--lg"
          >
            Have more questions about connected apps?
          </h2>
          <p>
            <a
              className="vads-u-color--primary-alt-darkest"
              onClick={this.faqEvent}
              href="/resources/connected-apps-faqs/"
            >
              Go to FAQs about connecting third-party apps to your VA.gov
              profile
            </a>
          </p>
        </va-summary-box>
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
