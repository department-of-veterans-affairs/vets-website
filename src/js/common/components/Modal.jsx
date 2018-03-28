// import PropTypes from 'prop-types';
// import React from 'react';
// import classNames from 'classnames';
import Modal from '@department-of-veterans-affairs/jean-pants/Modal';

/*
const ESCAPE_KEY = 27;

function focusListener(selector) {
  const listener = event => {
    const modal = document.querySelector('.va-modal');
    if (!modal.contains(event.target)) {
      event.stopPropagation();
      const focusableElement = modal.querySelector(selector);
      if (focusableElement) {
        focusableElement.focus();
      }
    }
  };
  document.addEventListener('focus', listener, true);
  return listener;
}

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleDocumentKeyUp = this.handleDocumentKeyUp.bind(this);
    this.state = { lastFocus: null, focusListener: null };
  }

  componentDidMount() {
    if (this.props.visible) {
      document.body.classList.add('modal-open');
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.visible && !this.props.visible) {
      document.addEventListener('keyup', this.handleDocumentKeyUp, false);
      this.setState({ lastFocus: document.activeElement, focusListener: focusListener(newProps.focusSelector) });
    } else if (!newProps.visible && this.props.visible) {
      document.removeEventListener('keyup', this.handleDocumentKeyUp, false);
      document.removeEventListener('focus', this.state.focusListener, true);
      this.state.lastFocus.focus();
      document.body.classList.remove('modal-open');
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      const focusableElement = document.querySelector('.va-modal').querySelector(this.props.focusSelector);
      if (focusableElement) {
        focusableElement.focus();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleDocumentKeyUp, false);
    document.removeEventListener('focus', this.state.focusListener, true);
    document.body.classList.remove('modal-open');
  }

  handleDocumentKeyUp(event) {
    if (event.keyCode === ESCAPE_KEY) {
      this.handleClose(event);
    }
  }

  handleClose(e) {
    e.preventDefault();
    this.props.onClose();
  }

  render() {
    const { id, title, visible } = this.props;
    const alertClass = classNames(
      'usa-alert',
      `usa-alert-${this.props.status}`
    );

    const titleClass = classNames(
      'va-modal-title',
      `va-modal-title-${this.props.status}`
    );

    const modalCss = classNames('va-modal', this.props.cssClass);
    const modalTitle = title && (
      <div className={alertClass}>
        <h3 id={`${id}-title`} className={titleClass}>{title}</h3>
      </div>
    );

    if (!visible) { return <div/>; }

    let closeButton;
    if (!this.props.hideCloseButton) {
      closeButton = (<button
        className="va-modal-close"
        type="button"
        onClick={this.handleClose}>
        <i className="fa fa-close"></i>
        <span className="usa-sr-only">Close this modal</span>
      </button>);
    }

    return (
      <div className={modalCss} id={id} role="alertdialog" aria-labelledby={`${id}-title`}>
        <div className="va-modal-inner">
          {modalTitle}
          {closeButton}
          <div className="va-modal-body">
            <div>
              {this.props.contents || this.props.children}
            </div>
            <div className="alert-actions">
              {this.props.primaryButton && <button className="usa-button" onClick={this.props.primaryButton.action}>{this.props.primaryButton.text}</button>}
              {this.props.secondaryButton && <button className="usa-button-secondary" onClick={this.props.secondaryButton.action}>{this.props.secondaryButton.text}</button>}
            </div>
          </div>

        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  contents: PropTypes.node, /* alternatively used child nodes */
/*
  cssClass: PropTypes.string,
  id: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  hideCloseButton: PropTypes.bool,
  focusSelector: PropTypes.string,
  primaryButton: PropTypes.shape({
    text: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  }),
  secondaryButton: PropTypes.shape({
    text: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  }),
  status: PropTypes.oneOf([
    'info',
    'error',
    'success',
    'warning'
  ])
};

Modal.defaultProps = {
  focusSelector: 'button, input, select, a'
};
*/

export default Modal;
