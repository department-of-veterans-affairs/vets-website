import React from 'react';
import Scroll from 'react-scroll';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement, getScrollOptions } from 'platform/utilities/ui';

import { SAVE_STATUSES, saveErrors } from './actions';
import { APP_TYPE_DEFAULT } from '../../forms-system/src/js/constants';
import SipsDevModal from './SaveInProgressDevModal';

const { Element } = Scroll;

class SaveFormLink extends React.Component {
  componentDidMount() {
    if (saveErrors.has(this.props.savedStatus)) {
      scrollToTop('saveFormLinkTop', getScrollOptions());
      focusElement('.schemaform-save-error');
    }
  }

  handleSave = event => {
    event.preventDefault();
    const { route = {}, form, locationPathname } = this.props;
    const { formId, version, submission } = form;
    let { data } = form;

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
                <button
                  type="button"
                  className="va-button-link"
                  onClick={this.openLoginModal}
                >
                  sign in
                </button>{' '}
                again to save your {appType}.
              </span>
            )}
          </div>
        )}
        {savedStatus !== SAVE_STATUSES.noAuth && (
          <span>
            <button
              type="button"
              className="va-button-link schemaform-sip-save-link"
              onClick={this.handleSave}
            >
              {this.props.children || `Finish this ${appType} later`}
            </button>
            {!this.props.children && '.'}
            <SipsDevModal {...this.props} />
          </span>
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
