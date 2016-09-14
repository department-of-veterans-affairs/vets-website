import React from 'react';

import ButtonDelete from '../buttons/ButtonDelete';

// TODO: Add attachments button / components
class MessageSend extends React.Component {
  render() {
    return (
      <div className={this.props.cssClass}>
        <button
            name="mode"
            type="submit"
            value="send">Send</button>
        <button
            className="usa-button-outline messaging-btn-save"
            name="mode"
            type="submit"
            value="save">Save As Draft</button>
        <ButtonDelete
            compact
            onClickHandler={() => {
              // TODO: Fill out this action.
              // Need to launch the ConfirmDelete modal.
            }}/>
      </div>
    );
  }
}

MessageSend.propTypes = {
  cssClass: React.PropTypes.string
};

export default MessageSend;
