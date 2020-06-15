import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import moment from 'moment';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import recordEvent from 'platform/monitoring/record-event';
import _ from 'platform/utilities/data';

import {
  formDescriptions,
  formBenefits,
} from 'applications/personalization/dashboard/helpers';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import { fetchInProgressForm, removeInProgressForm } from './actions';
import FormStartControls from './FormStartControls';
import { getIntroState } from './selectors';
import DowntimeNotification, {
  externalServiceStatus,
} from 'platform/monitoring/DowntimeNotification';
import DowntimeMessage from './DowntimeMessage';

class SaveInProgressIntro extends React.Component {
  getAlert = savedForm => {
    let alert;
    const {
      formId,
      renderSignInMessage,
      prefillEnabled,
      verifyRequiredPrefill,
      verifiedPrefillAlert,
      unverifiedPrefillAlert,
    } = this.props;
    const { profile, login } = this.props.user;
    const prefillAvailable = !!(
      profile && profile.prefillsAvailable.includes(formId)
    );
    if (login.currentlyLoggedIn) {
      if (savedForm) {
        const lastUpdated =
          savedForm.lastUpdated || _.get('metadata.lastUpdated', savedForm);
        const savedAt = this.props.lastSavedDate
          ? moment(this.props.lastSavedDate)
          : moment.unix(lastUpdated);
        const expiresAt = moment.unix(savedForm.metadata.expiresAt);
        const expirationDate = expiresAt.format('MMM D, YYYY');
        const isExpired = expiresAt.isBefore();

        if (!isExpired) {
          const lastSavedDateTime = savedAt.format('M/D/YYYY [at] h:mm a');
          alert = (
            <div>
              <div className="usa-alert usa-alert-info background-color-only schemaform-sip-alert">
                <div className="schemaform-sip-alert-title">
                  <strong>Your form is in progress</strong>
                </div>
                <div className="saved-form-metadata-container">
                  <span className="saved-form-item-metadata">
                    Your {formDescriptions[formId]} is in progress.
                  </span>
                  <br />
                  <span className="saved-form-item-metadata">
                    Your application was last saved on {lastSavedDateTime}
                  </span>
                  <div className="expires-container">
                    You can continue applying now, or come back later to finish
                    your application. Your application{' '}
                    <span className="expires">
                      will expire on {expirationDate}.
                    </span>
                  </div>
                </div>
                <div>{this.props.children}</div>
              </div>
              <br />
            </div>
          );
        } else {
          alert = (
            <div>
              <div className="usa-alert usa-alert-warning background-color-only schemaform-sip-alert">
                <div className="schemaform-sip-alert-title">
                  <strong>Your form has expired</strong>
                </div>
                <div className="saved-form-metadata-container">
                  <span className="saved-form-metadata">
                    Your saved {formDescriptions[formId]} has expired. If you
                    want to apply for {formBenefits[formId]}, please start a new
                    application.
                  </span>
                </div>
                <div>{this.props.children}</div>
              </div>
              <br />
            </div>
          );
        }
      } else if (prefillAvailable && !verifiedPrefillAlert) {
        alert = (
          <div>
            <div className="usa-alert usa-alert-info schemaform-sip-alert">
              <div className="usa-alert-body">
                <strong>Note:</strong> Since you’re signed in to your account,
                we can prefill part of your application based on your account
                details. You can also save your form in progress and come back
                later to finish filling it out.
              </div>
            </div>
            <br />
          </div>
        );
      } else if (prefillAvailable && verifiedPrefillAlert) {
        alert = verifiedPrefillAlert;
      } else {
        alert = (
          <div>
            <div className="usa-alert usa-alert-info schemaform-sip-alert">
              <div className="usa-alert-body">
                You can save this form in progress, and come back later to
                finish filling it out.
              </div>
            </div>
            <br />
          </div>
        );
      }
    } else if (renderSignInMessage) {
      alert = renderSignInMessage(prefillEnabled);
    } else if (prefillEnabled && !verifyRequiredPrefill) {
      const { buttonOnly, retentionPeriod, startText } = this.props;
      alert = buttonOnly ? (
        <>
          <button className="usa-button-primary" onClick={this.openLoginModal}>
            Sign in to start your application
          </button>
          {!this.props.hideUnauthedStartLink && (
            <p>
              <button
                className="va-button-link schemaform-start-button"
                onClick={this.goToBeginning}
              >
                Start your application without signing in
              </button>
            </p>
          )}
        </>
      ) : (
        <div className="usa-alert usa-alert-info schemaform-sip-alert">
          <div className="usa-alert-body">
            <h3 className="usa-alert-heading">
              Save time—and save your work in progress—by signing in before
              starting your application
            </h3>
            <div className="usa-alert-text">
              <p>When you’re signed in to your VA.gov account:</p>
              <ul>
                <li>
                  We can prefill part of your application based on your account
                  details.
                </li>
                <li>
                  You can save your application in progress, and come back later
                  to finish filling it out. You’ll have {retentionPeriod} from
                  the date you start or update your application to submit it.
                  After {retentionPeriod}, we’ll delete the form and you’ll need
                  to start over.
                </li>
              </ul>
              <p>
                <strong>Note:</strong> If you sign in after you’ve started your
                application, you won’t be able to save the information you’ve
                already filled in.
              </p>
              <button
                className="usa-button-primary"
                onClick={this.openLoginModal}
              >
                {startText || 'Sign in to start your application'}
              </button>
              {!this.props.hideUnauthedStartLink && (
                <p>
                  <button
                    className="va-button-link schemaform-start-button"
                    onClick={this.goToBeginning}
                  >
                    Start your application without signing in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      );
    } else if (prefillEnabled && unverifiedPrefillAlert) {
      alert = unverifiedPrefillAlert;
    } else {
      alert = (
        <div>
          <div className="usa-alert usa-alert-info schemaform-sip-alert">
            <div className="usa-alert-body">
              You can save this form in progress, and come back later to finish
              filling it out.
              <br />
              <button className="va-button-link" onClick={this.openLoginModal}>
                Sign in to your account.
              </button>
            </div>
          </div>
          <br />
        </div>
      );
    }
    return alert;
  };

  getStartPage = () => {
    const { pageList, pathname, formData } = this.props;
    const data = formData || {};
    // pathname is only provided when the first page is conditional
    if (pathname) return getNextPagePath(pageList, data, pathname);
    return pageList[1].path;
  };

  goToBeginning = () => {
    recordEvent({ event: 'no-login-start-form' });
    this.props.router.push(this.getStartPage());
  };

  openLoginModal = () => {
    this.props.toggleLoginModal(true, 'cta-form');
  };

  renderDowntime = (downtime, children) => {
    if (downtime.status === externalServiceStatus.down) {
      const Message = this.props.downtime.message || DowntimeMessage;

      return (
        <Message isAfterSteps={this.props.buttonOnly} downtime={downtime} />
      );
    }

    return children;
  };

  render() {
    const { profile } = this.props.user;
    const startPage = this.getStartPage();
    const savedForm =
      profile && profile.savedForms.find(f => f.form === this.props.formId);
    const prefillAvailable = !!(
      profile && profile.prefillsAvailable.includes(this.props.formId)
    );
    let expiresAt;
    let isExpired;
    if (savedForm) {
      expiresAt = moment.unix(savedForm.metadata.expiresAt);
      isExpired = expiresAt.isBefore();
    }

    if (profile.loading && !this.props.resumeOnly) {
      return (
        <div>
          <LoadingIndicator message="Checking to see if you have a saved version of this application..." />
          <br />
        </div>
      );
    }

    if (this.props.resumeOnly && !savedForm) {
      return null;
    }

    if (this.props.startMessageOnly && !savedForm) {
      return <div>{this.getAlert(savedForm)}</div>;
    }

    const content = (
      <div>
        {!this.props.buttonOnly && this.getAlert(savedForm)}
        {this.props.buttonOnly &&
          !this.props.user.login.currentlyLoggedIn &&
          this.getAlert(savedForm)}
        {this.props.user.login.currentlyLoggedIn && (
          <FormStartControls
            resumeOnly={this.props.resumeOnly}
            isExpired={isExpired}
            messages={this.props.messages}
            startText={this.props.startText}
            startPage={startPage}
            formId={this.props.formId}
            returnUrl={this.props.returnUrl}
            migrations={this.props.migrations}
            prefillTransformer={this.props.prefillTransformer}
            fetchInProgressForm={this.props.fetchInProgressForm}
            removeInProgressForm={this.props.removeInProgressForm}
            prefillAvailable={prefillAvailable}
            formSaved={!!savedForm}
            gaStartEventName={this.props.gaStartEventName}
          />
        )}
        {!this.props.buttonOnly && this.props.afterButtonContent}
        <br />
      </div>
    );

    // If the dependencies aren't required for pre-fill (but are required for submit),
    // only render the downtime notification if the user isn't logged in.
    //   If the user is logged in, they can at least save their form.
    // If the dependencies _are_ required for pre-fill, render the downtime notification
    // _unless_ the user has a form saved (so they don't need pre-fill).

    if (
      this.props.downtime &&
      (!this.props.isLoggedIn ||
        (this.props.downtime.requiredForPrefill && !savedForm))
    ) {
      return (
        <DowntimeNotification
          appTitle={this.props.formId}
          render={this.renderDowntime}
          dependencies={this.props.downtime.dependencies}
        >
          {content}
        </DowntimeNotification>
      );
    }

    return content;
  }
}

SaveInProgressIntro.propTypes = {
  buttonOnly: PropTypes.bool,
  afterButtonContent: PropTypes.element,
  prefillEnabled: PropTypes.bool,
  formId: PropTypes.string.isRequired,
  messages: PropTypes.object,
  migrations: PropTypes.array,
  prefillTransformer: PropTypes.func,
  returnUrl: PropTypes.string,
  lastSavedDate: PropTypes.number,
  user: PropTypes.object.isRequired,
  pageList: PropTypes.array.isRequired,
  fetchInProgressForm: PropTypes.func.isRequired,
  removeInProgressForm: PropTypes.func.isRequired,
  retentionPeriod: PropTypes.string,
  startText: PropTypes.string,
  pathname: PropTypes.string,
  toggleLoginModal: PropTypes.func.isRequired,
  renderSignInMessage: PropTypes.func,
  verifyRequiredPrefill: PropTypes.bool,
  verifiedPrefillAlert: PropTypes.element,
  unverifiedPrefillAlert: PropTypes.element,
  downtime: PropTypes.object,
  gaStartEventName: PropTypes.string,
  startMessageOnly: PropTypes.bool,
  hideUnauthedStartLink: PropTypes.bool,
};

SaveInProgressIntro.defaultProps = {
  retentionPeriod: '60 days',
};

function mapStateToProps(state) {
  return {
    ...getIntroState(state),
  };
}

const mapDispatchToProps = {
  fetchInProgressForm,
  removeInProgressForm,
  toggleLoginModal,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(SaveInProgressIntro),
);

export { SaveInProgressIntro };
