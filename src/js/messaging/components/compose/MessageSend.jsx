import React from 'react';

import ButtonDelete from '../buttons/ButtonDelete';

// TODO: Add attachments button / components
class MessageSend extends React.Component {
  render() {
    return (
      <div className={this.props.cssClass}>
        <button
            type="button"
            onClick={this.props.onSend}>Send</button>
        <button
            className="usa-button-outline messaging-btn-save"
            type="button"
            value="save"
            onClick={this.props.onSave}>Save As Draft</button>
        <ButtonDelete
            compact
            onClickHandler={this.props.onDelete}/>
      </div>
    );
  }
}

MessageSend.propTypes = {
  cssClass: React.PropTypes.string,
  onSave: React.PropTypes.func.isRequired,
  onSend: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired
};

export default MessageSend;
