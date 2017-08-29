import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

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
    this.state = { lastFocus: null, focusListener: null };
  }

  componentDidMount() {
    if (this.props.visible) {
      document.body.classList.add('modal-open');
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.visible && !this.props.visible) {
      this.setState({ lastFocus: document.activeElement, focusListener: focusListener(newProps.focusSelector) });
    } else if (!newProps.visible && this.props.visible) {
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
    document.removeEventListener('focus', this.state.focusListener, true);
  }

  handleClose() {
    this.props.onClose();
  }

  render() {
    const { id, title, visible } = this.props;
    const modalCss = classNames('va-modal', this.props.cssClass);
    const modalTitle = title && (
      <h3 id={`${id}-title`} className="va-modal-title">{title}</h3>
    );

    if (!visible) { return <div/>; }

    let closeButton;
    if (!this.props.hideCloseButton) {
      closeButton = (<button
        className="va-modal-close"
        type="button"
        onClick={this.props.onClose}>
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
            {this.props.contents || this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  contents: PropTypes.node, /* alternatively used child nodes */
  cssClass: PropTypes.string,
  id: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  hideCloseButton: PropTypes.bool,
  focusSelector: PropTypes.string
};

Modal.defaultProps = {
  focusSelector: 'button, input, select, a'
};

export default Modal;
