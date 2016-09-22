import React from 'react';

import Modal from '../../../common/components/Modal';

class ModalAttachmentsTooBig extends React.Component {
  render() {
    const modalContents = (
      <div>
        <h3 className="messaging-modal-title">
          Attachment size limit
        </h3>
        <p>
          The file(s) you are trying to attach exceed the
          3<abbr title="megabyte">MB</abbr> attachment
          size limit and the total size of attachments cannot
          exceed 6<abbr title="megabytes">MB</abbr>.
        </p>
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

ModalAttachmentsTooBig.propTypes = {
  cssClass: React.PropTypes.string,
  id: React.PropTypes.string,
  onClose: React.PropTypes.func.isRequired,
  visible: React.PropTypes.bool.isRequired
};

export default ModalAttachmentsTooBig;
