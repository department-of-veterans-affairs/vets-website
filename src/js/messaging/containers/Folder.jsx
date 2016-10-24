import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import classNames from 'classnames';

import SortableTable from '../../common/components/SortableTable';

import {
  fetchFolder,
  setDateRange,
  toggleAdvancedSearch,
  toggleFolderNav
} from '../actions';

import ComposeButton from '../components/ComposeButton';
import MessageNav from '../components/MessageNav';
import MessageSearch from '../components/MessageSearch';
import { paths } from '../config';
import { formattedDate } from '../utils/helpers';

export class Folder extends React.Component {
  constructor(props) {
    super(props);
    this.formattedSortParam = this.formattedSortParam.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.makeMessageNav = this.makeMessageNav.bind(this);
    this.makeMessagesTable = this.makeMessagesTable.bind(this);
  }

  componentDidMount() {
    const id = this.props.params.id;
    const query = _.pick(this.props.location.query, ['page', 'sort']);
    this.props.fetchFolder(id, query);
  }

  componentDidUpdate() {
    const oldId = this.props.attributes.folderId;
    const newId = +this.props.params.id;

    const query = _.pick(this.props.location.query, ['page', 'sort']);

    const oldPage = this.props.page;
    const newPage = +query.page || oldPage;

    const oldSort = this.formattedSortParam(
      this.props.sort.value,
      this.props.sort.order
    );
    const newSort = query.sort || oldSort;

    if (newId !== oldId || newPage !== oldPage || newSort !== oldSort) {
      this.props.fetchFolder(newId, query);
    }
  }

  formattedSortParam(value, order) {
    const formattedValue = _.snakeCase(value);
    const sort = order === 'DESC'
                    ? `-${formattedValue}`
                    : formattedValue;
    return sort;
  }

  handlePageSelect(page) {
    this.context.router.push({
      pathname: `${paths.FOLDERS_URL}/${this.props.params.id}`,
      query: { ...this.props.location.query, page }
    });
  }

  handleSort(value, order) {
    const sort = this.formattedSortParam(value, order);
    this.context.router.push({
      pathname: `${paths.FOLDERS_URL}/${this.props.params.id}`,
      query: { ...this.props.location.query, sort }
    });
  }

  makeMessageNav() {
    const { currentRange, messageCount, page, totalPages } = this.props;

    if (messageCount === 0) {
      return null;
    }

    return (
      <MessageNav
          currentRange={currentRange}
          messageCount={messageCount}
          onItemSelect={this.handlePageSelect}
          itemNumber={page}
          totalItems={totalPages}/>
    );
  }

  makeMessagesTable() {
    const messages = this.props.messages;
    if (!messages || messages.length === 0) { return null; }

    const makeMessageLink = (content, id) => {
      return <Link to={`/thread/${id}`}>{content}</Link>;
    };

    const currentSort = this.props.sort;

    const fields = [
      { label: 'From', value: 'senderName' },
      { label: 'Subject line', value: 'subject' },
      { label: 'Date', value: 'sentDate' }
    ];

    const data = this.props.messages.map(message => {
      const id = message.messageId;
      const rowClass = classNames({
        'messaging-message-row': true,
        'messaging-message-row--unread': message.readReceipt === 'UNREAD'
      });

      return {
        id,
        rowClass,
        senderName: makeMessageLink(message.senderName, id),
        subject: makeMessageLink(message.subject, id),
        sentDate: makeMessageLink(formattedDate(message.sentDate), id)
      };
    });

    return (
      <SortableTable
          className="usa-table-borderless va-table-list"
          currentSort={currentSort}
          data={data}
          fields={fields}
          onSort={this.handleSort}/>
    );
  }

  render() {
    const folderName = _.get(this.props.attributes, 'name');
    const messageNav = this.makeMessageNav();
    const folderMessages = this.makeMessagesTable();

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

Folder.contextTypes = {
  router: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  const folder = state.folders.data.currentItem;
  const { attributes, messages } = folder;
  const pagination = folder.pagination;
  const page = pagination.currentPage;
  const perPage = pagination.perPage;
  const totalPages = pagination.totalPages;

  const totalCount = pagination.totalEntries;
  const startCount = 1 + (page - 1) * perPage;
  const endCount = Math.min(totalCount, page * perPage);

  return {
    attributes,
    currentRange: `${startCount} - ${endCount}`,
    messageCount: totalCount,
    messages,
    page,
    totalPages,
    isAdvancedVisible: state.search.advanced.visible,
    searchDateRangeStart: state.search.advanced.params.dateRange.start,
    searchDateRangeEnd: state.search.advanced.params.dateRange.end,
    sort: folder.sort
  };
};

const mapDispatchToProps = {
  fetchFolder,
  setDateRange,
  toggleAdvancedSearch,
  toggleFolderNav
};

export default connect(mapStateToProps, mapDispatchToProps)(Folder);
