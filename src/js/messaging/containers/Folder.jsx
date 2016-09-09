import React from 'react';
import { connect } from 'react-redux';

import { fetchFolder } from '../actions/folders';

class Folder extends React.Component {
  componentWillMount() {
    // TODO: When the API supports getting messages for any folder,
    // fetch the folder with the id from the URL.
    // const id = this.props.param.id
    this.props.dispatch(fetchFolder());
  }

  render() {
    const folder = this.props.folder;
    let folderName;
    let folderMessages;

    if (folder) {
      folderName = folder.name;

      const rows = folder.messages.map(message => {
        return (
          <tr key={message.message_id}>
            <td>{message.sender_name}</td>
            <td>{message.category}</td>
            <td>{message.subject}</td>
            <td>{message.sent_date}</td>
          </tr>
        );
      });

      // TODO: Use SortableTable here.
      folderMessages = (
        <table className="usa-table-borderless">
          <thead>
            <tr>
              <th>From</th>
              <th>Category</th>
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
  return {
    folder: state.folders.currentItem
  };
};

export default connect(mapStateToProps)(Folder);
