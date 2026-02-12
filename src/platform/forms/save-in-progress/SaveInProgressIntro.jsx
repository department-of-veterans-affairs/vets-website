import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { fromUnixTime, isBefore } from 'date-fns';
import { format } from 'date-fns-tz';
import {
  VaButton,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { getNextPagePath } from '~/platform/forms-system/src/js/routing';
import {
  expiredMessage,
  inProgressMessage as getInProgressMessage,
} from '~/platform/forms-system/src/js/utilities/save-in-progress-messages';
import environment from 'platform/utilities/environment';
import recordEvent from '~/platform/monitoring/record-event';

import { toggleLoginModal } from '~/platform/site-wide/user-nav/actions';
import DowntimeNotification, {
  externalServiceStatus,
} from '~/platform/monitoring/DowntimeNotification';
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
        customStartLink={this.props.customLink}
      />
    );
  };

  getAlert = savedForm => {
    let alert;
    let includesFormControls = false;
    const {
      formId,
      prefillEnabled,
      verifyRequiredPrefill,
      verifiedPrefillAlert,
      unverifiedPrefillAlert,
      formConfig,
      ariaLabel = null,
      ariaDescribedby = null,
    } = this.props;
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

    const Header = `h${this.props.headingLevel}`;

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

          const ContinueMsg = (
            <p>
              You can continue {appAction} now
              {appContinuing && ` ${appContinuing}`}, or come back later to
              finish your {appType}.
            </p>
          );

          includesFormControls = true;
          alert = (
            <va-alert status="info" uswds visible>
              <Header slot="headline">
                {inProgressMessage} {savedAt && 'and was last saved on '}
                {lastSavedDateTime}
              </Header>
              <div className="saved-form-metadata-container">
                <div className="expires-container">
                  {this.props.continueMsg || ContinueMsg}
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
            </va-alert>
          );
        } else {
          alert = (
            <div>
              <va-alert status="warning" uswds visible>
                <Header slot="headline">Your {appType} has expired</Header>
                <div className="saved-form-metadata-container">
                  <span className="saved-form-metadata">
                    {expiredMessage(formConfig)}
                  </span>
                </div>
                <div>{this.props.children}</div>
              </va-alert>
              <br />
            </div>
          );
        }
      } else if (prefillAvailable && !verifiedPrefillAlert) {
        alert = (
          <div>
            <va-alert status="info" visible>
              <Header slot="headline">
                We’ve prefilled some of your information
              </Header>
              Since you’re signed in, we can prefill part of your {appType}{' '}
              based on your profile details. You can also save your {appType} in
              progress and come back later to finish filling it out.
            </va-alert>
            <br />
          </div>
        );
      } else if (prefillAvailable && verifiedPrefillAlert) {
        alert = verifiedPrefillAlert;
      } else {
        alert = (
          <div>
            <va-alert status="info" uswds visible slim>
              <div className="usa-alert-body">
                We'll save your request on every change. You can stop anytime,
                and come back later to finish.
              </div>
            </va-alert>
            <br />
          </div>
        );
      }
    } else if (prefillEnabled && !verifyRequiredPrefill) {
      const {
        buttonOnly,
        buttonAriaDescribedby,
        retentionPeriod,
        unauthStartText,
      } = this.props;
      const CustomLink = this.props.customLink;
      const unauthStartLink = this.props.formConfig?.formOptions
        ?.useWebComponentForNavigation ? (
        <p>
          <VaLink
            onClick={this.handleClickAndReroute}
            href={this.getStartPage()}
            className="schemaform-start-button"
            aria-label={ariaLabel}
            // aria-describedby={ariaDescribedby}
            text={`Start your ${appType} without signing in`}
          />
        </p>
      ) : (
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
      );
      const unauthStartButton = CustomLink ? (
        <CustomLink
          href="#start"
          onClick={event => {
            event.preventDefault();
            this.openLoginModal();
          }}
        >
          {unauthStartText || UNAUTH_SIGN_IN_DEFAULT_MESSAGE}
        </CustomLink>
      ) : (
        <VaButton
          onClick={this.openLoginModal}
          label={ariaLabel}
          uswds
          messageAriaDescribedby={buttonAriaDescribedby}
          text={unauthStartText || UNAUTH_SIGN_IN_DEFAULT_MESSAGE}
        />
      );
      alert = buttonOnly ? (
        <>
          {unauthStartButton}
          {!this.props.hideUnauthedStartLink && unauthStartLink}
        </>
      ) : (
        <va-alert-sign-in
          variant={
            this.props.hideUnauthedStartLink
              ? 'signInRequired'
              : 'signInOptional'
          }
          time-limit={retentionPeriod}
          heading-level={this.props.headingLevel}
          no-sign-in-link=""
          visible
        >
          <span slot="SignInButton">
            {unauthStartButton}
            {!this.props.hideUnauthedStartLink && unauthStartLink}
          </span>
        </va-alert-sign-in>
      );
    } else if (prefillEnabled && unverifiedPrefillAlert) {
      alert = unverifiedPrefillAlert;
    } else {
      alert = (
        <div>
          <va-alert-sign-in variant="signInOptional" visible>
            <span slot="SignInButton">
              <va-button
                className="va-button-link"
                onClick={this.openLoginModal}
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedby}
                text="Sign in to your account."
              />
            </span>
          </va-alert-sign-in>
          <br />
        </div>
      );
    }
    return { alert, includesFormControls };
  };

  getStartPage = () => {
    const { pageList, pathname, formData } = this.props;
    const data = formData || {};
    // Use the provided pathname, or default to the first page in the list
    // Always use getNextPagePath to respect page 'depends' conditions
    const startingPath = pathname || pageList[0]?.path;
    return getNextPagePath(pageList, data, startingPath);
  };

  handleClick = () => {
    recordEvent({ event: 'no-login-start-form' });
  };

  handleClickAndReroute = event => {
    event.preventDefault();
    recordEvent({ event: 'no-login-start-form' });
    this.props.router.push(this.getStartPage());
  };

  openLoginModal = () => {
    const requiresVerified =
      this?.props?.formConfig?.requiresVerifiedUser ||
      this?.props?.hideUnauthedStartLink;

    this.props.toggleLoginModal(
      true,
      `cta-form__${this.props.formId}`,
      requiresVerified,
    );
  };

  renderDowntime = (downtime, children) => {
    if (downtime.status === externalServiceStatus.down) {
      const Message = this.props.downtime.message || DowntimeMessage;

      return (
        <Message
          isAfterSteps={this.props.buttonOnly}
          downtime={downtime}
          formConfig={this.props.formConfig}
          headerLevel={2}
        />
      );
    }

    return children;
  };

  render() {
    const { formConfig, buttonOnly, devOnly } = this.props;
    const devOnlyForceShowFormControls =
      environment.isLocalhost() &&
      !window.Cypress &&
      devOnly?.forceShowFormControls;
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
          {devOnlyForceShowFormControls && (
            <>
              <div>dev only:</div>
              <div>{this.getFormControls(savedForm)}</div>
            </>
          )}
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
    const showFormControls = !includesFormControls && login.currentlyLoggedIn;

    const content = (
      <div>
        {!buttonOnly && alert}
        {buttonOnly && !login.currentlyLoggedIn && alert}
        {showFormControls && this.getFormControls(savedForm)}

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
  afterButtonContent: PropTypes.element,
  alertTitle: PropTypes.string,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  buttonAriaDescribedby: PropTypes.string,
  buttonOnly: PropTypes.bool,
  children: PropTypes.any,
  continueMsg: PropTypes.node,
  customLink: PropTypes.any,
  devOnly: PropTypes.shape({
    forceShowFormControls: PropTypes.bool,
  }),
  displayNonVeteranMessaging: PropTypes.bool,
  downtime: PropTypes.object,
  fetchInProgressForm: PropTypes.func,
  formConfig: PropTypes.shape({
    signInHelpList: PropTypes.func,
    customText: PropTypes.shape({
      appType: PropTypes.string,
      appAction: PropTypes.string,
      appContinuing: PropTypes.string,
    }),
    requiresVerifiedUser: PropTypes.bool,
    formOptions: PropTypes.shape({
      useWebComponentForNavigation: PropTypes.bool,
    }),
  }),
  formData: PropTypes.object,
  formId: PropTypes.string,
  gaStartEventName: PropTypes.string,
  headingLevel: PropTypes.number,
  hideUnauthedStartLink: PropTypes.bool,
  isLoggedIn: PropTypes.bool,
  lastSavedDate: PropTypes.number,
  messages: PropTypes.object,
  migrations: PropTypes.array,
  pageList: PropTypes.array,
  pathname: PropTypes.string,
  prefillEnabled: PropTypes.bool,
  prefillTransformer: PropTypes.func,
  removeInProgressForm: PropTypes.func,
  resumeOnly: PropTypes.bool,
  retentionPeriod: PropTypes.string,
  retentionPeriodStart: PropTypes.string,
  returnUrl: PropTypes.string,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  startMessageOnly: PropTypes.bool,
  startText: PropTypes.string,
  toggleLoginModal: PropTypes.func,
  unauthStartText: PropTypes.string,
  unverifiedPrefillAlert: PropTypes.element,
  user: PropTypes.object,
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
  buttonAriaDescribedby: null,
  customLink: null,
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

/**
 * @type {React.FC<{
 *   fetchInProgressForm?: any,
 *   formId?: string,
 *   pageList?: any[],
 *   removeInProgressForm?: any,
 *   toggleLoginModal?: any,
 *   user?: any,
 *   afterButtonContent?: any,
 *   alertTitle?: string,
 *   ariaDescribedby?: string,
 *   ariaLabel?: string,
 *   buttonAriaDescribedby?: string,
 *   buttonOnly?: boolean,
 *   children?: any,
 *   customLink?: any,
 *   devOnly?: {
 *     forceShowFormControls?: boolean,
 *   },
 *   displayNonVeteranMessaging?: boolean,
 *   downtime?: any,
 *   formConfig?: {
 *     signInHelpList?: any,
 *     customText?: {
 *       appType?: string,
 *       appAction?: string,
 *       appContinuing?: string,
 *     },
 *    requiresVerifiedUser?: any
 *   },
 *   formData?: any,
 *   gaStartEventName?: string,
 *   headingLevel?: number,
 *   hideUnauthedStartLink?: boolean,
 *   isLoggedIn?: boolean,
 *   lastSavedDate?: number,
 *   messages?: any,
 *   migrations?: any[],
 *   pathname?: string,
 *   prefillEnabled?: boolean,
 *   prefillTransformer?: any,
 *   resumeOnly?: boolean,
 *   retentionPeriod?: string,
 *   retentionPeriodStart?: string,
 *   returnUrl?: string,
 *   startMessageOnly?: boolean,
 *   startText?: string,
 *   unauthStartText?: string,
 *   unverifiedPrefillAlert?: any,
 *   verifiedPrefillAlert?: any,
 *   verifyRequiredPrefill?: boolean,
 * }>}
 */
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(SaveInProgressIntro));

export { SaveInProgressIntro };
