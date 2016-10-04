import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import classNames from 'classnames';

import { fetchFolder, toggleFolderNav } from '../actions/folders';
import { toggleAdvancedSearch, setDateRange } from '../actions/search';

import ComposeButton from '../components/ComposeButton';
import MessageNav from '../components/MessageNav';
import MessageSearch from '../components/MessageSearch';

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

  makeMessageNav() {
    const { folder, currentRange, messageCount, page, totalPages } = this.props;

    if (messageCount === 0) {
      return null;
    }

    const folderId = folder.attributes.folderId;
    let handleClickPrev;
    let handleClickNext;

    if (page > 1) {
      handleClickPrev = () => {
        this.props.fetchFolder(folderId, { page: page - 1 });
      };
    }

    if (page < totalPages) {
      handleClickNext = () => {
        this.props.fetchFolder(folderId, { page: page + 1 });
      };
    }

    return (
      <MessageNav
          currentRange={currentRange}
          messageCount={messageCount}
          onClickPrev={handleClickPrev}
          onClickNext={handleClickNext}/>
    );
  }

  makeMessagesTable(messages) {
    if (messages.length === 0) {
      return null;
    }

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
    return (
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

  render() {
    const { attributes, messages } = this.props.folder;
    let folderName;

    if (!_.isEmpty(attributes)) {
      folderName = attributes.name;
    }

    const messageNav = this.makeMessageNav();
    const folderMessages = this.makeMessagesTable(messages);

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
        <MessageSearch
            isAdvancedVisible={this.props.isAdvancedVisible}
            searchDateRangeEnd={this.props.searchDateRangeEnd}
            onAdvancedSearch={this.props.toggleAdvancedSearch}
            onDateChange={this.props.setDateRange}
            searchDateRangeStart={this.props.searchDateRangeStart}
            onSubmit={(e) => { e.preventDefault(); }}/>
        <div id="messaging-folder-controls">
          <ComposeButton/>
          {messageNav}
        </div>
        {folderMessages}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const folder = state.folders.data.currentItem;
  const pagination = folder.pagination;
  const page = pagination.currentPage;
  const perPage = pagination.perPage;
  const totalPages = pagination.totalPages;

  const totalCount = pagination.totalEntries;
  const startCount = 1 + (page - 1) * perPage;
  const endCount = Math.min(totalCount, page * perPage);

  return {
    folder,
    currentRange: `${startCount} - ${endCount}`,
    messageCount: totalCount,
    page,
    totalPages,
    isAdvancedVisible: state.search.advanced.visible,
    searchDateRangeStart: state.search.advanced.params.dateRange.start,
    searchDateRangeEnd: state.search.advanced.params.dateRange.end
  };
};

const mapDispatchToProps = {
  fetchFolder,
  toggleFolderNav,
  toggleAdvancedSearch,
  setDateRange
};

export default connect(mapStateToProps, mapDispatchToProps)(Folder);
