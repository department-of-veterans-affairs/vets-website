import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { fromUnixTime, isBefore } from 'date-fns';
import { format } from 'date-fns-tz';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import {
  expiredMessage,
  inProgressMessage as getInProgressMessage,
} from 'platform/forms-system/src/js/utilities/save-in-progress-messages';
import recordEvent from 'platform/monitoring/record-event';

import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import DowntimeNotification, {
  externalServiceStatus,
} from 'platform/monitoring/DowntimeNotification';
import { fetchInProgressForm, removeInProgressForm } from './actions';
import FormStartControls from './FormStartControls';
import { getIntroState } from './selectors';
import DowntimeMessage from './DowntimeMessage';
import {
  APP_TYPE_DEFAULT,
  UNAUTH_SIGN_IN_DEFAULT_MESSAGE,
  APP_ACTION_DEFAULT,
} from '../../forms-system/src/js/constants';

class SaveInProgressIntro extends React.Component {
  getFormControls = savedForm => {
    const { profile } = this.props.user;
    const startPage = this.getStartPage();
    const prefillAvailable = !!(
      profile && profile.prefillsAvailable.includes(this.props.formId)
    );
    const isExpired = savedForm
      ? isBefore(fromUnixTime(savedForm.metadata.expiresAt), new Date())
      : false;
    return (
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
        ariaLabel={this.props.ariaLabel}
        ariaDescribedby={this.props.ariaDescribedby}
      />
    );
  };

  getAlert = savedForm => {
    let alert;
    let includesFormControls = false;
    const {
      alertTitle,
      formId,
      renderSignInMessage,
      prefillEnabled,
      verifyRequiredPrefill,
      verifiedPrefillAlert,
      unverifiedPrefillAlert,
      formConfig,
      ariaLabel = null,
      ariaDescribedby = null,
    } = this.props;
    const { signInHelpList } = formConfig;
    const { profile, login } = this.props.user;
    const prefillAvailable = !!(
      profile && profile.prefillsAvailable.includes(formId)
    );

    // e.g. appType = 'application'
    const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
    // e.g. appAction = 'applying'
    const appAction = formConfig?.customText?.appAction || APP_ACTION_DEFAULT;
    // e.g. appContinuing = 'for planning and career guidance' =>
    // You can continue applying now for planning and career guidance, or...
    const appContinuing = formConfig?.customText?.appContinuing || '';

    if (login.currentlyLoggedIn) {
      if (savedForm) {
        /**
         * lastSavedDate = JS time (ms) - always undefined?
         * savedForms.lastUpdated = unix time (seconds)
         * savedForms.metadata.expiresAt = unix time
         * savedForms.metadata.lastUpdated = unix time
         * savedForms.metadata.savedAt = JS time (ms)
         */
        const { metadata = {} } = savedForm;
        const lastUpdated = savedForm.lastUpdated || metadata.lastUpdated;

        let savedAt = '';
        if (this.props.lastSavedDate) {
          savedAt = new Date(this.props.lastSavedDate);
        } else if (lastUpdated) {
          savedAt = fromUnixTime(lastUpdated);
        }

        const expiresAt = fromUnixTime(savedForm.metadata.expiresAt);
        const expirationDate = format(expiresAt, 'MMMM d, yyyy');
        const isExpired = isBefore(expiresAt, new Date());
        const inProgressMessage = getInProgressMessage(formConfig);

        if (!isExpired) {
          const lastSavedDateTime =
            savedAt && format(savedAt, "MMMM d, yyyy', at' h:mm aaaa z");

          const H = `h${this.props.headingLevel}`;
          includesFormControls = true;
          alert = (
            <div className="usa-alert usa-alert-info background-color-only schemaform-sip-alert">
              <div className="schemaform-sip-alert-title">
                <H className="usa-alert-heading vads-u-font-size--h3">
                  {inProgressMessage} {savedAt && 'and was last saved on '}
                  {lastSavedDateTime}
                </H>
              </div>
              <div className="saved-form-metadata-container">
                <div className="expires-container">
                  You can continue {appAction} now
                  {appContinuing && ` ${appContinuing}`}, or come back later to
                  finish your {appType}.
                  <p>
                    Your {appType}{' '}
                    <span className="expires">
                      will expire on {expirationDate}.
                    </span>
                  </p>
                </div>
              </div>
              <div>{this.props.children}</div>
              {this.getFormControls(savedForm)}
            </div>
          );
        } else {
          alert = (
            <div>
              <div className="usa-alert usa-alert-warning background-color-only schemaform-sip-alert">
                <div className="schemaform-sip-alert-title">
                  <strong>Your {appType} has expired</strong>
                </div>
                <div className="saved-form-metadata-container">
                  <span className="saved-form-metadata">
                    {expiredMessage(formConfig)}
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
                we can prefill part of your {appType} based on your account
                details. You can also save your {appType} in progress and come
                back later to finish filling it out.
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
                You can save this {appType} in progress, and come back later to
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
      const H = `h${this.props.headingLevel}`;
      const {
        buttonOnly,
        retentionPeriod,
        retentionPeriodStart,
        unauthStartText,
      } = this.props;
      const unauthStartButton = (
        <button
          className="usa-button-primary"
          onClick={this.openLoginModal}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          type="button"
        >
          {unauthStartText || UNAUTH_SIGN_IN_DEFAULT_MESSAGE}
        </button>
      );
      alert = buttonOnly ? (
        <>
          {unauthStartButton}
          {!this.props.hideUnauthedStartLink && (
            <p>
              <Link
                onClick={this.handleClick}
                to={this.getStartPage}
                className="schemaform-start-button"
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedby}
              >
                Start your {appType} without signing in
              </Link>
            </p>
          )}
        </>
      ) : (
        <div className="usa-alert usa-alert-info schemaform-sip-alert">
          <div className="usa-alert-body">
            <H className="usa-alert-heading">{alertTitle}</H>
            <div className="usa-alert-text">
              {this.props.displayNonVeteranMessaging ? (
                <p>
                  By signing in, you can save your work in progress.{' '}
                  You&rsquo;ll have {retentionPeriod} from{' '}
                  {retentionPeriodStart} your {appType} to come back and finish
                  it.
                </p>
              ) : (
                <>
                  <p>Here&rsquo;s how signing in now helps you:</p>
                  {signInHelpList ? (
                    signInHelpList()
                  ) : (
                    <ul>
                      <li>
                        We can fill in some of your information for you to save
                        you time.
                      </li>
                      <li>
                        You can save your work in progress. You&rsquo;ll have{' '}
                        {retentionPeriod} from {retentionPeriodStart} your{' '}
                        {appType} to come back and finish it.
                      </li>
                    </ul>
                  )}
                </>
              )}
              <p>
                {!this.props.hideUnauthedStartLink && (
                  <>
                    <strong>Note:</strong> You can sign in after you start your{' '}
                    {appType}. But you&rsquo;ll lose any information you already
                    filled in.
                  </>
                )}
              </p>
              {unauthStartButton}
              {!this.props.hideUnauthedStartLink && (
                <p>
                  <Link
                    onClick={this.handleClick}
                    to={this.getStartPage}
                    className="schemaform-start-button"
                    aria-label={ariaLabel}
                    aria-describedby={ariaDescribedby}
                  >
                    Start your {appType} without signing in
                  </Link>
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
              You can save this {appType} in progress, and come back later to
              finish filling it out.
              <br />
              <button
                className="va-button-link"
                onClick={this.openLoginModal}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedby}
                type="button"
              >
                Sign in to your account.
              </button>
            </div>
          </div>
          <br />
        </div>
      );
    }
    return { alert, includesFormControls };
  };

  getStartPage = () => {
    const { pageList, pathname, formData } = this.props;
    const data = formData || {};
    // pathname is only provided when the first page is conditional
    if (pathname) return getNextPagePath(pageList, data, pathname);
    return pageList[1].path;
  };

  handleClick = () => {
    recordEvent({ event: 'no-login-start-form' });
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
    const { formConfig, buttonOnly } = this.props;
    const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
    const { profile, login } = this.props.user;
    const savedForm =
      profile && profile.savedForms.find(f => f.form === this.props.formId);

    if (profile.loading && !this.props.resumeOnly) {
      return (
        <div>
          <va-loading-indicator
            message={`Checking to see if you have a saved version of this ${appType} ...`}
          />
          <br />
        </div>
      );
    }

    if (this.props.resumeOnly && !savedForm) {
      return null;
    }

    if (this.props.startMessageOnly && !savedForm) {
      return <div>{this.getAlert(savedForm).alert}</div>;
    }

    const { alert, includesFormControls } = this.getAlert(savedForm);

    const content = (
      <div>
        {!buttonOnly && alert}
        {buttonOnly && !login.currentlyLoggedIn && alert}
        {!includesFormControls &&
          login.currentlyLoggedIn &&
          this.getFormControls(savedForm)}
        {!buttonOnly && this.props.afterButtonContent}
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
          customText={formConfig.customText}
        >
          {content}
        </DowntimeNotification>
      );
    }

    return content;
  }
}

SaveInProgressIntro.propTypes = {
  fetchInProgressForm: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  pageList: PropTypes.array.isRequired,
  removeInProgressForm: PropTypes.func.isRequired,
  toggleLoginModal: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  afterButtonContent: PropTypes.element,
  alertTitle: PropTypes.string,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  buttonOnly: PropTypes.bool,
  children: PropTypes.any,
  downtime: PropTypes.object,
  formConfig: PropTypes.shape({
    signInHelpList: PropTypes.func,
    customText: PropTypes.shape({
      appType: PropTypes.string,
    }),
  }),
  formData: PropTypes.object,
  gaStartEventName: PropTypes.string,
  headingLevel: PropTypes.number,
  displayNonVeteranMessaging: PropTypes.bool,
  hideUnauthedStartLink: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  lastSavedDate: PropTypes.number,
  messages: PropTypes.object,
  migrations: PropTypes.array,
  pathname: PropTypes.string,
  prefillEnabled: PropTypes.bool,
  prefillTransformer: PropTypes.func,
  renderSignInMessage: PropTypes.func,
  resumeOnly: PropTypes.bool,
  retentionPeriod: PropTypes.string,
  retentionPeriodStart: PropTypes.string,
  returnUrl: PropTypes.string,
  startMessageOnly: PropTypes.bool,
  startText: PropTypes.string,
  unauthStartText: PropTypes.string,
  unverifiedPrefillAlert: PropTypes.element,
  verifiedPrefillAlert: PropTypes.element,
  verifyRequiredPrefill: PropTypes.bool,
};

SaveInProgressIntro.defaultProps = {
  alertTitle: 'Sign in now to save your work in progress',
  retentionPeriod: '60 days', // from
  retentionPeriodStart: 'when you start or make updates to', // your {appType}
  unauthStartText: '',
  formConfig: {
    customText: {
      appType: '',
    },
  },
  headingLevel: 2,
  ariaLabel: null,
  ariaDescribedby: null,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SaveInProgressIntro);

export { SaveInProgressIntro };
