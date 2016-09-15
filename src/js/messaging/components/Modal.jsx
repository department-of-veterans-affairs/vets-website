import React from 'react';

class Modal extends React.Component {
  render() {
    return (
      <div className="rx-modal" id={this.props.id}>
        <div className="rx-modal-inner">
          <div className="rx-modal-body">
            {this.props.contents}
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  contents: React.PropTypes.node,
  id: React.PropTypes.string,
};

export default Modal;
