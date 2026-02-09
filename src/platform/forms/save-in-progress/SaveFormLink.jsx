import React from 'react';
import PropTypes from 'prop-types';

import {
  Element,
  getScrollOptions,
  scrollToTop,
} from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui/focus';
import recordEvent from '../../monitoring/record-event';

import { SAVE_STATUSES, saveErrors } from './actions';
import { APP_TYPE_DEFAULT } from '../../forms-system/src/js/constants';
import SipsDevModal from './SaveInProgressDevModal';

class SaveFormLink extends React.Component {
  componentDidMount() {
    if (saveErrors.has(this.props.savedStatus)) {
      scrollToTop('saveFormLinkTop', getScrollOptions());
      focusElement('.schemaform-save-error');
    }
  }

  handleSave = event => {
    event.preventDefault();
    const { route = {}, form, locationPathname, formConfig } = this.props;
    const { formId, version, submission, trackingPrefix } = form;
    let { data } = form;
    if (trackingPrefix) {
      recordEvent({
        event: `${trackingPrefix}sip-form-save-intent`,
      });
    }

    // If tracking callback is provided, call it
    const onSaveTracking = formConfig?.formOptions?.onSaveTracking;
    if (onSaveTracking) {
      try {
        onSaveTracking();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[Tracking Error]', error);
      }
    }

    // Save form on a specific page form exit callback
    if (typeof route.pageConfig?.onFormExit === 'function') {
      data = route.pageConfig.onFormExit(data);
    }
    // Save form global form exit callback
    if (typeof this.props.formConfig?.onFormExit === 'function') {
      data = this.props.formConfig.onFormExit(data);
    }

    const returnUrl = route.pageConfig?.returnUrl || locationPathname;
    this.props.saveAndRedirectToReturnUrl(
      formId,
      data,
      version,
      returnUrl,
      submission,
    );
  };

  openLoginModal = () => {
    this.props.toggleLoginModal(true);
  };

  render() {
    if (!this.props.user.login.currentlyLoggedIn) return null;
    const { savedStatus } = this.props.form;
    const { formConfig } = this.props;
    const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;
    const { useWebComponentForNavigation } = formConfig?.formOptions || {};

    return (
      <div
        className={`schemaform-save-container${
          this.props.children ? ' vads-u-display--inline' : ''
        }`}
      >
        <Element name="saveFormLinkTop" />
        {saveErrors.has(savedStatus) && (
          <div
            role="alert"
            className="usa-alert usa-alert-error background-color-only schemaform-save-error"
          >
            {savedStatus === SAVE_STATUSES.failure &&
              `We’re sorry. Something went wrong when saving your ${appType}. If you’re on a secure and private computer, you can leave this page open and try saving your ${appType} again in a few minutes. If you’re on a public computer, you can continue to fill out your ${appType}, but it won’t automatically save as you fill it out.`}
            {savedStatus === SAVE_STATUSES.clientFailure &&
              `We’re sorry. We’re unable to connect to VA.gov right now. Please make sure you’re connected to the Internet so we can save your ${appType} in progress.`}
            {savedStatus === SAVE_STATUSES.noAuth && (
              <span>
                Sorry, you’re signed out. Please{' '}
                <va-link
                  class="sign-in-link"
                  onClick={this.openLoginModal}
                  text="sign in"
                  href="#"
                />{' '}
                again to save your {appType}.
              </span>
            )}
          </div>
        )}
        {savedStatus !== SAVE_STATUSES.noAuth && (
          <div className="vads-u-display--flex vads-u-margin-top--2">
            {useWebComponentForNavigation ? (
              <va-link
                href={`${formConfig.rootUrl}/form-saved`}
                onClick={this.handleSave}
                class="schemaform-sip-save-link"
                text={this.props.children || `Finish this ${appType} later`}
              />
            ) : (
              <button
                type="button"
                className="va-button-link schemaform-sip-save-link"
                onClick={this.handleSave}
              >
                {this.props.children || `Finish this ${appType} later`}
              </button>
            )}
            {!this.props.children && '.'}
            <SipsDevModal {...this.props} />
          </div>
        )}
      </div>
    );
  }
}

SaveFormLink.propTypes = {
  form: PropTypes.shape({
    formId: PropTypes.string.isRequired,
    version: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    trackingPrefix: PropTypes.string.isRequired,
    savedStatus: PropTypes.string.isRequired,
    submission: PropTypes.object.isRequired,
  }).isRequired,
  locationPathname: PropTypes.string.isRequired,
  saveAndRedirectToReturnUrl: PropTypes.func.isRequired,
  toggleLoginModal: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  children: PropTypes.any,
  formConfig: PropTypes.shape({
    rootUrl: PropTypes.string,
    formOptions: PropTypes.shape({
      useWebComponentForNavigation: PropTypes.bool,
      onSaveTracking: PropTypes.func,
    }),
    customText: PropTypes.shape({
      appType: PropTypes.string,
    }),
    onFormExit: PropTypes.func,
  }),
  route: PropTypes.shape({
    pageConfig: PropTypes.shape({
      returnUrl: PropTypes.string,
    }),
  }),
  savedStatus: PropTypes.string,
};

export default SaveFormLink;
