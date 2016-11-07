import React from 'react';
import classNames from 'classnames';

function focusListener() {
  const listener = event => {
    const modal = document.querySelector('.va-modal');
    if (!modal.contains(event.target)) {
      event.stopPropagation();
      modal.focus();
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

  componentWillReceiveProps(newProps) {
    if (newProps.visible && !this.props.visible) {
      this.setState({ lastFocus: document.activeElement, focusListener: focusListener() });
    } else if (!newProps.visible && this.props.visible) {
      document.removeEventListener('focus', this.state.focusListener, true);
      this.state.lastFocus.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      document.querySelector('.va-modal').focus();
    }
  }

  handleClose() {
    this.props.onClose();
  }

  render() {
    const modalCss = classNames('va-modal', this.props.cssClass);

    if (!this.props.visible) {
      return <div/>;
    }

    const closeButton = this.props.hideCloseButton ? '' : (
      <button
          className="va-modal-close"
          type="button"
          onClick={this.props.onClose}>
        <i className="fa fa-close"></i>
        <span className="usa-sr-only">Close this modal</span>
      </button>
    );

    return (
      <div className={modalCss} id={this.props.id} role="alertdialog" tabIndex="-1">
        <div className="va-modal-inner">
          {closeButton}
          <div className="va-modal-body">
            {this.props.contents}
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  contents: React.PropTypes.node.isRequired,
  cssClass: React.PropTypes.string,
  id: React.PropTypes.string,
  onClose: React.PropTypes.func.isRequired,
  visible: React.PropTypes.bool.isRequired,
  hideCloseButton: React.PropTypes.bool
};

export default Modal;
