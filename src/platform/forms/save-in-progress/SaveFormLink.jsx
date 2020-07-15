import React from 'react';
import Scroll from 'react-scroll';
import PropTypes from 'prop-types';

import { SAVE_STATUSES, saveErrors } from './actions';
import { focusElement } from '../../utilities/ui';
import { APP_TYPE_DEFAULT } from 'platform/globalContent';

const Element = Scroll.Element;
const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo(
    'saveFormLinkTop',
    window.VetsGov?.scroll || {
      duration: 500,
      delay: 0,
      smooth: true,
    },
  );
};

class SaveFormLink extends React.Component {
  componentDidMount() {
    if (saveErrors.has(this.props.savedStatus)) {
      scrollToTop();
      focusElement('.schemaform-save-error');
    }
  }

  handleSave = () => {
    const { formId, version, data } = this.props.form;
    const returnUrl = this.props.locationPathname;
    this.props.saveAndRedirectToReturnUrl(formId, data, version, returnUrl);
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
      <div style={{ display: this.props.children ? 'inline' : null }}>
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
          </span>
        )}
      </div>
    );
  }
}

SaveFormLink.propTypes = {
  locationPathname: PropTypes.string.isRequired,
  form: PropTypes.shape({
    formId: PropTypes.string.isRequired,
    version: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired,
    trackingPrefix: PropTypes.string.isRequired,
    savedStatus: PropTypes.string.isRequired,
  }).isRequired,
  user: PropTypes.object.isRequired,
  toggleLoginModal: PropTypes.func.isRequired,
};

export default SaveFormLink;
