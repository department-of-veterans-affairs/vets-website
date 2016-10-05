import React from 'react';

import Modal from '../../../common/components/Modal';

class ModalAttachments extends React.Component {
  render() {
    const modalContents = (
      <div>
        <h3 className="messaging-modal-title">
          {this.props.title}
        </h3>
        <p>{this.props.text}</p>
        <div>
          <button
              onClick={this.props.onClose}
              type="button">Ok, got it</button>
        </div>
      </div>
    );

    return (
      <Modal
          cssClass={this.props.cssClass}
          contents={modalContents}
          id={this.props.id}
          onClose={this.props.onClose}
          visible={this.props.visible}/>
    );
  }
}

ModalAttachments.propTypes = {
  cssClass: React.PropTypes.string,
  title: React.PropTypes.node,
  text: React.PropTypes.node,
  id: React.PropTypes.string,
  onClose: React.PropTypes.func.isRequired,
  visible: React.PropTypes.bool.isRequired
};

export default ModalAttachments;
