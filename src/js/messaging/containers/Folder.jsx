import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import classNames from 'classnames';

import { fetchFolder } from '../actions/folders';

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
        const id = message.message_id;
        const rowClass = classNames({
          'messaging-message-row': true,
          'messaging-message-row--unread': message.read_receipt === 'UNREAD'
        });

        return (
          <tr key={id} className={rowClass}>
            <td>
              {makeMessageLink(message.sender_name, id)}
            </td>
            <td>
              {makeMessageLink(message.subject, id)}
            </td>
            <td>
              {makeMessageLink(message.sent_date, id)}
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
        <h2>{folderName}</h2>
        {folderMessages}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const currentFolder = state.folders.data.currentItem;
  const attributes = state.folders.data.items.find((folder) => {
    return folder.folder_id === currentFolder.id;
  });
  const messages = currentFolder.messages;

  return {
    folder: { attributes, messages }
  };
};

const mapDispatchToProps = {
  fetchFolder
};

export default connect(mapStateToProps, mapDispatchToProps)(Folder);
