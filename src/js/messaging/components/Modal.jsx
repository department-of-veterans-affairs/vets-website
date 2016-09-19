import React from 'react';
import classNames from 'classnames';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.onClose();
  }

  render() {
    const modalCss = classNames('rx-modal', this.props.cssClass);

    if (!this.props.visible) {
      return <div/>;
    }

    return (
      <div
          className={modalCss}
          id={this.props.id}>
        <div className="rx-modal-inner">
          <button
              className="rx-modal-close"
              onClick={this.handleClose}
              type="button">
            <i className="fa fa-close"></i>
            <span className="usa-sr-only">Close</span>
          </button>
          <div className="rx-modal-body">
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
  visible: React.PropTypes.bool.isRequired
};

export default Modal;
