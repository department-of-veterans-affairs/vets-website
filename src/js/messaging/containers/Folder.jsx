import React from 'react';
import { connect } from 'react-redux';

import { fetchFolder } from '../actions/folders';

class Folder extends React.Component {
  componentWillMount() {
    // When the API supports getting messages for any folder,
    // fetch the folder with the id from the URL.
    // const id = this.props.param.id
    // this.props.dispatch(setCurrentFolder(id));
    this.props.dispatch(fetchFolder());
  }

  render() {
    const currentFolder = this.props.folders.currentItem;
    let folderName;

    if (currentFolder) {
      folderName = folder.name;
    }

    const currentMessages = this.props.folders.messages;
    let folderMessages;

    if (currentMessages.length > 0) {
      folderMessages = currentMessages.map(message => {
        return (
          <div key={message.message_id}>
            <p>{message.subject}</p>
            <p>From: {message.sender_name}</p>
            <p>To: {message.recipient_name}</p>
            <p>{message.body}</p>
          </div>
        );
      });
    }

    return (
      <div>
        <h2>{folderName}</h2>
        {folderMessages}
      </div>
    );
  }
}

Folder.propTypes = {
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Folder);
