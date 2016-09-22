import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import classNames from 'classnames';

import { fetchFolder, toggleFolderNav } from '../actions/folders';
import ComposeButton from '../components/ComposeButton';
import MessageNav from '../components/MessageNav';

class Folder extends React.Component {
  componentDidMount() {
    const id = this.props.params.id;
    this.props.fetchFolder(id);
  }

  componentDidUpdate(prevProps) {
    const oldId = prevProps.params.id;
    const newId = this.props.params.id;
    if (oldId !== newId) {
      this.props.fetchFolder(newId);
    }
  }

  render() {
    const folder = this.props.folder;
    let folderName;
    let folderMessages;

    if (folder) {
      if (!_.isEmpty(folder.attributes)) {
        folderName = folder.attributes.name;
      }

      const makeMessageLink = (content, id) => {
        return <Link to={`/messaging/thread/${id}`}>{content}</Link>;
      };

      const rows = folder.messages.map((message) => {
        const id = message.messageId;
        const rowClass = classNames({
          'messaging-message-row': true,
          'messaging-message-row--unread': message.readReceipt === 'UNREAD'
        });

        return (
          <tr key={id} className={rowClass}>
            <td>
              {makeMessageLink(message.senderName, id)}
            </td>
            <td>
              {makeMessageLink(message.subject, id)}
            </td>
            <td>
              {makeMessageLink(message.sentDate, id)}
            </td>
          </tr>
        );
      });

      // TODO: Use SortableTable here.
      folderMessages = (
        <table className="usa-table-borderless">
          <thead>
            <tr>
              <th>From</th>
              <th>Subject line</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      );
    }

    return (
      <div>
        <div id="messaging-content-header">
          <button
              className="messaging-menu-button"
              type="button"
              onClick={this.props.toggleFolderNav}>
            Menu
          </button>
          <h2>{folderName}</h2>
        </div>
        <div id="messaging-folder-controls">
          <ComposeButton/>
          <MessageNav
              currentRange={this.props.currentRange}
              messageCount={this.props.messageCount}/>
        </div>
        {folderMessages}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const currentFolder = state.folders.data.currentItem;
  const attributes = state.folders.data.items.find((folder) => {
    return folder.folderId === currentFolder.id;
  });
  const messages = currentFolder.messages;
  const startCount = currentFolder.startCount;
  const endCount = currentFolder.endCount;

  return {
    folder: { attributes, messages },
    currentRange: `${startCount} - ${endCount}`,
    messageCount: currentFolder.totalCount
  };
};

const mapDispatchToProps = {
  fetchFolder,
  toggleFolderNav
};

export default connect(mapStateToProps, mapDispatchToProps)(Folder);
