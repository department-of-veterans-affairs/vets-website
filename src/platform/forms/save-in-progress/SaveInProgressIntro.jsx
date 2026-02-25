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
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { expiredMessage } from 'platform/forms-system/src/js/utilities/save-in-progress-messages';
import environment from 'platform/utilities/environment';
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
} from '../../forms-system/src/js/constants';

class SaveInProgressIntro extends React.Component {
  getFormControls = savedForm => {
    const { profile } = this.props.user || {};
    const startPage = this.getStartPage();
    const prefillAvailable = profile?.prefillsAvailable?.includes(
      this.props.formId,
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
    const {
      formId,
      prefillEnabled,
      verifyRequiredPrefill,
      verifiedPrefillAlert,
      unverifiedPrefillAlert,
      formConfig,
      ariaLabel = null,
      ariaDescribedby = null,
      hideUnauthedStartLink,
      buttonOnly,
      retentionPeriod,
      unauthStartText,
      customLink,
    } = this.props;
    const { login, profile } = this.props.user;
    const prefillAvailable = profile?.prefillsAvailable?.includes(formId);

    // common text values
    const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
    const appAction =
      formConfig?.customText?.appAction || `filling out this ${appType}`;
    const Header = `h${this.props.headingLevel}`;

    // ===== LOGGED IN STATES =====
    if (login?.currentlyLoggedIn) {
      // Logged in with saved form (active or expired)
      if (savedForm) {
        return this.getLoggedInSavedFormAlert(
          savedForm,
          appType,
          appAction,
          Header,
        );
      }

      // Logged in, no saved form, with prefill available
      if (prefillAvailable) {
        if (verifiedPrefillAlert) {
          return { alert: verifiedPrefillAlert, includesFormControls: false };
        }
        return {
          alert: (
            <va-alert status="info" class="vads-u-margin-bottom--4">
              <Header slot="headline">
                We’ve prefilled some of your information
              </Header>
              Since you’re signed in, we can prefill part of your {appType}{' '}
              based on your profile details. You can also save your {appType} in
              progress and come back later to finish filling it out.
            </va-alert>
          ),
          includesFormControls: false,
        };
      }

      // Logged in, no saved form, no prefill available
      return {
        alert: (
          <va-alert status="info" class="vads-u-margin-bottom--4" slim>
            You can save this {appType} in progress, and come back later to
            finish filling it out.
          </va-alert>
        ),
        includesFormControls: false,
      };
    }

    // ===== LOGGED OUT STATES =====

    if (prefillEnabled && unverifiedPrefillAlert) {
      return { alert: unverifiedPrefillAlert, includesFormControls: false };
    }

    const getSignInVariant = () => {
      if (hideUnauthedStartLink) return 'signInRequired';
      if (prefillEnabled && !verifyRequiredPrefill) return 'signInOptional';
      return 'signInOptionalNoPrefill';
    };

    const signInVariant = getSignInVariant();
    const {
      unauthStartButton,
      unauthStartLink,
    } = this.getUnauthStartComponents(
      customLink,
      unauthStartText,
      ariaLabel,
      ariaDescribedby,
      appType,
    );

    if (buttonOnly) {
      return {
        alert: (
          <>
            {unauthStartButton}
            {!hideUnauthedStartLink && unauthStartLink}
          </>
        ),
        includesFormControls: false,
      };
    }

    return {
      alert: (
        <va-alert-sign-in
          variant={signInVariant}
          time-limit={retentionPeriod}
          heading-level={this.props.headingLevel}
          no-sign-in-link=""
        >
          <span slot="SignInButton">
            {unauthStartButton}
            {!hideUnauthedStartLink && unauthStartLink}
          </span>
        </va-alert-sign-in>
      ),
      includesFormControls: false,
    };
  };

  getArticle = word => {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    return vowels.includes(word.charAt(0).toLowerCase()) ? 'an' : 'a';
  };

  getLoggedInSavedFormAlert = (savedForm, appType, appAction, Header) => {
    const { metadata = {} } = savedForm;
    const { formConfig } = this.props;
    const lastUpdated = savedForm.lastUpdated || metadata.lastUpdated;

    let savedAt = '';
    if (this.props.lastSavedDate) {
      savedAt = new Date(this.props.lastSavedDate);
    } else if (lastUpdated) {
      savedAt = fromUnixTime(lastUpdated);
    }

    const expiresAt = fromUnixTime(metadata.expiresAt);
    const expirationDate = format(expiresAt, 'MMMM d, yyyy');
    const isExpired = isBefore(expiresAt, new Date());

    if (!isExpired) {
      const savedDateTime =
        savedAt && format(savedAt, "MMMM d, yyyy', at' h:mm aaaa z");
      const formName = formConfig?.subTitle || appType;
      const article = this.getArticle(appType);

      return {
        alert: (
          <va-alert status="info">
            <Header slot="headline">
              You have {article} {appType} in progress. You last saved your{' '}
              {formName} on {savedDateTime}.
            </Header>
            <p>
              You can continue {appAction} with your saved information until{' '}
              <strong>{expirationDate}</strong>. If you don’t submit your{' '}
              {appType} by that date, you’ll need to start over.
            </p>
            <div>{this.props.children}</div>
            {this.getFormControls(savedForm)}
          </va-alert>
        ),
        includesFormControls: true,
      };
    }

    return {
      alert: (
        <va-alert status="warning" class="vads-u-margin-bottom--4">
          <Header slot="headline">Your {appType} has expired</Header>
          <div className="saved-form-metadata-container">
            <span className="saved-form-metadata">
              {expiredMessage(formConfig)}
            </span>
          </div>
        </va-alert>
      ),
      includesFormControls: false,
    };
  };

  getUnauthStartComponents = (
    CustomLink,
    unauthStartText,
    ariaLabel,
    ariaDescribedby,
    appType,
  ) => {
    const linkText = `Start your ${appType} without signing in`;
    const linkClassName = 'schemaform-start-button';
    const startPage = this.getStartPage();

    const unauthStartLink = this.props.formConfig?.formOptions
      ?.useWebComponentForNavigation ? (
      <p>
        <VaLink
          onClick={this.handleClickAndReroute}
          href={startPage}
          className={linkClassName}
          aria-label={ariaLabel}
          text={linkText}
        />
      </p>
    ) : (
      <p>
        <Link
          onClick={this.handleClick}
          to={startPage}
          className={linkClassName}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
        >
          {linkText}
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
        messageAriaDescribedby={this.props.buttonAriaDescribedby}
        text={unauthStartText || UNAUTH_SIGN_IN_DEFAULT_MESSAGE}
      />
    );

    return { unauthStartButton, unauthStartLink };
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

    // safe defaults for user object to support testing without full Redux store
    const user = this.props.user || {};
    const { profile = {}, login = {} } = user;
    const { savedForms = [], loading = false } = profile;

    const savedForm = savedForms.find(f => f.form === this.props.formId);

    if (loading && !this.props.resumeOnly) {
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
    const showFormControls =
      !includesFormControls && (login?.currentlyLoggedIn || false);

    const content = (
      <div>
        {!buttonOnly && alert}
        {buttonOnly && !login?.currentlyLoggedIn && alert}
        {showFormControls && this.getFormControls(savedForm)}
        {!showFormControls &&
          devOnlyForceShowFormControls && (
            <>
              <div>dev only:</div>
              <div>{this.getFormControls(savedForm)}</div>
            </>
          )}
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
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  buttonAriaDescribedby: PropTypes.string,
  buttonOnly: PropTypes.bool,
  children: PropTypes.any,
  customLink: PropTypes.any,
  devOnly: PropTypes.shape({
    forceShowFormControls: PropTypes.bool,
  }),
  downtime: PropTypes.object,
  fetchInProgressForm: PropTypes.func,
  formConfig: PropTypes.shape({
    customText: PropTypes.shape({
      appAction: PropTypes.string,
      appType: PropTypes.string,
    }),
    formOptions: PropTypes.shape({
      useWebComponentForNavigation: PropTypes.bool,
    }),
    requiresVerifiedUser: PropTypes.bool,
    subTitle: PropTypes.string,
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
  retentionPeriod: '60 days',
  unauthStartText: '',
  formConfig: {
    customText: { appType: '' },
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
 *   ariaDescribedby?: string,
 *   ariaLabel?: string,
 *   buttonAriaDescribedby?: string,
 *   buttonOnly?: boolean,
 *   children?: any,
 *   customLink?: any,
 *   devOnly?: {
 *     forceShowFormControls?: boolean,
 *   },
 *   downtime?: any,
 *   formConfig?: {
 *     customText?: {
 *       appAction?: string,
 *       appType?: string,
 *     },
 *    formOptions?: {
 *      useWebComponentForNavigation: boolean,
 *    },
 *    subTitle: string,
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
