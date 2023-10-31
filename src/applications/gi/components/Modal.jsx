import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { focusElement } from 'platform/utilities/ui';

const ESCAPE_KEY = 27;
const TAB_KEY = 9;

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isFirefox = typeof InstallTrigger !== 'undefined';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lastFocus: null, isTabbingBackwards: false };
  }

  componentDidMount() {
    if (isSafari || isFirefox) {
      document.addEventListener('click', this.handeFocusOnSafariFirefox, true);
    }
    if (this.props.visible) {
      this.setupModal();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.setupModal();
    } else if (prevProps.visible && !this.props.visible) {
      if (isSafari || isFirefox) {
        document.removeEventListener(
          'click',
          this.handeFocusOnSafariFirefox,
          true,
        );
      }
      this.teardownModal();
    }
  }

  componentWillUnmount() {
    if (this.props.visible) {
      this.teardownModal();
    }
  }

  setupModal() {
    this.setState({ lastFocus: document.activeElement });
    this.applyFocusToFirstModalElement();
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', this.handleDocumentKeyDown, false);
    document.addEventListener('focus', this.handleDocumentFocus, true);
    if (this.props.clickToClose) {
      document.addEventListener('click', this.handleDocumentClicked, true);
    }
  }

  async teardownModal() {
    if (this.state.lastFocus) {
      // Ensure last focus is set before completing modal teardown
      if (this.props.elementToFocusOnClose) {
        await focusElement(`#${this.props.elementToFocusOnClose}`);
      } else {
        await focusElement(this.state.lastFocus);
      }
    }
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', this.handleDocumentKeyDown, false);
    document.removeEventListener('focus', this.handleDocumentFocus, true);
    if (this.props.clickToClose) {
      document.removeEventListener('click', this.handleDocumentClicked, true);
    }
  }

  handleDocumentKeyDown = event => {
    if (event.keyCode === ESCAPE_KEY) {
      this.handleClose(event);
    } else if (event.keyCode === TAB_KEY) {
      if (event.shiftKey) {
        this.setState({ isTabbingBackwards: true });
      } else {
        this.setState({ isTabbingBackwards: false });
      }
    }
  };

  handeFocusOnSafariFirefox = event => {
    if (event.target.matches('button')) {
      event.target.focus();
    }
  };

  handleClose = e => {
    e.preventDefault();
    this.props.onClose();
  };

  handleDocumentFocus = event => {
    if (this.props.visible && !this.element.contains(event.target)) {
      event.stopPropagation();
      if (this.state.isTabbingBackwards) {
        this.applyFocusToLastModalElement();
      } else {
        this.applyFocusToFirstModalElement();
      }
    }
  };

  handleDocumentClicked = event => {
    if (this.props.visible && !this.element.contains(event.target)) {
      this.props.onClose();
    }
  };

  applyFocusToFirstModalElement() {
    const focusableElement = this.element?.querySelector(
      this.props.focusSelector,
    );
    if (this.state.lastFocus) {
      focusElement(this.state.lastFocus);
    }
    if (focusableElement) {
      focusElement(focusableElement);
    }
  }

  applyFocusToLastModalElement() {
    const allFocusableElements = this.element.querySelectorAll(
      this.props.focusSelector,
    );
    const focusableModalElements = Array.from(allFocusableElements).filter(el =>
      this.element.contains(el),
    );
    if (this.state.lastFocus) {
      focusElement(this.state.lastFocus);
    }
    if (focusableModalElements.length) {
      focusElement(focusableModalElements[focusableModalElements.length - 1]);
    }
  }

  renderAlertActions = () => {
    const { primaryButton, secondaryButton } = this.props;
    if (!primaryButton && !secondaryButton) return null;

    return (
      <div className="alert-actions">
        {primaryButton && (
          <button className="usa-button" onClick={primaryButton.action}>
            {primaryButton.text}
          </button>
        )}
        {secondaryButton && (
          <button
            className="usa-button-secondary"
            onClick={secondaryButton.action}
          >
            {secondaryButton.text}
          </button>
        )}
      </div>
    );
  };

  render() {
    if (!this.props.visible) return null;

    const { id, status, title } = this.props;
    const titleId = title && `${id || 'va-modal'}-title`;
    const content = this.props.contents || this.props.children;

    const modalClass = classNames('va-modal', this.props.cssClass);

    const wrapperClass = classNames('va-modal-inner', {
      'usa-alert': status,
      [`usa-alert-${status}`]: status,
      'va-modal-alert': status,
    });

    const bodyClass = status ? 'usa-alert-body' : 'va-modal-body';
    const titleClass = status ? 'usa-alert-heading' : 'va-modal-title';
    const contentClass = classNames({ 'usa-alert-text': status });

    const closeButton = !this.props.hideCloseButton && (
      <button
        className="va-modal-close"
        type="button"
        aria-label="Close this modal"
        onClick={this.handleClose}
      >
        <i className="fas fa-times-circle" aria-hidden="true" />
      </button>
    );

    return (
      <div
        className={modalClass}
        id={id}
        role="alertdialog"
        aria-labelledby={titleId}
      >
        <div
          className={wrapperClass}
          ref={el => {
            this.element = el;
          }}
        >
          <div className={bodyClass}>
            <div role="document">
              {title && (
                <h3 id={titleId} className={titleClass}>
                  {title}
                </h3>
              )}
              {content && <div className={contentClass}>{content}</div>}
            </div>
            {this.renderAlertActions()}
          </div>
          {closeButton}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  /**
   * If the modal is visible or not
   */
  visible: PropTypes.bool.isRequired,
  /**
   * Handler for when the modal is closed
   */
  onClose: PropTypes.func.isRequired,
  /**
   * Click outside modal will call onClose prop
   */
  clickToClose: PropTypes.bool,
  /**
   * Contents of modal when displayed. You can also pass the contents as children, which is preferred
   */
  contents: PropTypes.node,
  /**
   * CSS class to set on the modal
   */
  cssClass: PropTypes.string,
  /**
   * Id of the modal, used for aria attributes
   */
  id: PropTypes.string,
  /**
   * Primary button text and action
   */
  primaryButton: PropTypes.shape({
    text: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  }),
  /**
   * Secondary button text and action
   */
  secondaryButton: PropTypes.shape({
    text: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  }),
  /*
   * Style of modal alert - info, error, success, warning
   */
  status: PropTypes.oneOf(['info', 'error', 'success', 'warning', 'continue']),
  /**
   * Title/header text for the modal
   */
  title: PropTypes.string,
  /**
   * Hide the close button that's normally in the top right
   */
  hideCloseButton: PropTypes.bool,
  /**
   * Selector to use to find elements to focus on when the
   * modal is opened
   */
  focusSelector: PropTypes.string,
  /**
   * The id of the element that called the modal to be opened. Necessary so
   * focus can be placed back to this element when modal is closed.
   * Specifically when using IE11 and navigating with JAWS 2019 virtual keyboard.
   */
  elementToFocusOnClose: PropTypes.string,
};

Modal.defaultProps = {
  clickToClose: false,
  focusSelector: 'h3, button, input, select, a',
};

export default Modal;
