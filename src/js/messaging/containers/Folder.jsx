import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import classNames from 'classnames';

import { fetchFolder } from '../actions/folders';
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
    const { attributes, messages } = this.props.folder;
    let folderName;
    let folderMessages;

    if (!_.isEmpty(attributes)) {
      folderName = attributes.name;
    }

    if (messages.length > 0) {
      const makeMessageLink = (content, id) => {
        return <Link to={`/messaging/thread/${id}`}>{content}</Link>;
      };

      const rows = messages.map((message) => {
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
        <h2>{folderName}</h2>
        <div className="messaging-folder-controls">
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
  const folder = state.folders.data.currentItem;
  const startCount = folder.startCount;
  const endCount = folder.endCount;

  return {
    folder,
    currentRange: `${startCount} - ${endCount}`,
    messageCount: folder.totalCount
  };
};

const mapDispatchToProps = {
  fetchFolder
};

export default connect(mapStateToProps, mapDispatchToProps)(Folder);
