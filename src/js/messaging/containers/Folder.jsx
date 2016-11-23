import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import classNames from 'classnames';

import LoadingIndicator from '../../common/components/LoadingIndicator';
import SortableTable from '../../common/components/SortableTable';

import {
  fetchFolder,
  moveMessageToFolder,
  openAlert,
  openMoveToNewFolderModal,
  setDateRange,
  setSearchParam,
  toggleAdvancedSearch,
  toggleFolderMoveTo,
  toggleFolderNav
} from '../actions';

import ComposeButton from '../components/ComposeButton';
import MessageNav from '../components/MessageNav';
import MessageSearch from '../components/MessageSearch';
import MoveTo from '../components/MoveTo';
import { formattedDate } from '../utils/helpers';

export class Folder extends React.Component {
  constructor(props) {
    super(props);
    this.buildSearchQuery = this.buildSearchQuery.bind(this);
    this.getQueryParams = this.getQueryParams.bind(this);
    this.getRequestedFolderId = this.getRequestedFolderId.bind(this);
    this.formattedSortParam = this.formattedSortParam.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.makeMessageNav = this.makeMessageNav.bind(this);
    this.makeMessagesTable = this.makeMessagesTable.bind(this);
    this.makeSortMenu = this.makeSortMenu.bind(this);
  }

  componentDidMount() {
    if (!this.props.loading.inProgress && this.props.folders.size) {
      const id = this.getRequestedFolderId();
      const query = this.getQueryParams();
      this.props.fetchFolder(id, query);
    }
  }

  componentDidUpdate() {
    const loading = this.props.loading;

    if (!loading.inProgress && this.props.folders.size) {
      const lastRequest = loading.request;
      const requestedId = this.getRequestedFolderId();
      const query = this.getQueryParams();

      // Only proceed with fetching the requested folder
      // if it's not the same as the most recent request.
      const shouldFetchFolder =
        !lastRequest ||
        requestedId !== lastRequest.id ||
        !_.isEqual(query, lastRequest.query);

      if (shouldFetchFolder) {
        this.props.fetchFolder(requestedId, query);
      }
    }
  }

  getRequestedFolderId() {
    const folderName = this.props.params.folderName;
    const folder = this.props.folders.get(folderName);
    return folder ? folder.folderId : null;
  }

  getQueryParams() {
    const queryParams = [
      'page',
      'sort',
      'filter[[sent_date][gteq]]',
      'filter[[sent_date][lteq]]',
      'filter[[sender_name][eq]]',
      'filter[[sender_name][match]]',
      'filter[[subject][eq]]',
      'filter[[subject][match]]'
    ];
    return _.pick(this.props.location.query, queryParams);
  }

  formattedSortParam(value, order) {
    const formattedValue = _.snakeCase(value);
    const sort = order === 'DESC'
                    ? `-${formattedValue}`
                    : formattedValue;
    return sort;
  }

  buildSearchQuery(object) {
    const filters = {};

    if (object.term.value) {
      filters['filter[[subject][match]]'] = object.term.value;
    }

    if (object.from.field.value) {
      const fromExact = object.from.exact ? 'eq' : 'match';
      filters[`filter[[sender_name][${fromExact}]]`] = object.from.field.value;
    }

    if (object.subject.field.value) {
      const subjectExact = object.subject.exact ? 'eq' : 'match';
      filters[`filter[[subject][${subjectExact}]]`] = object.subject.field.value;
    }

    if (object.dateRange.start) {
      filters['filter[[sent_date][gteq]]'] = object.dateRange.start.format();
    }

    if (object.dateRange.end) {
      filters['filter[[sent_date][lteq]]'] = object.dateRange.end.format();
    }

    return filters;
  }

  handlePageSelect(page) {
    this.context.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, page }
    });
  }

  handleSort(value, order) {
    const sort = this.formattedSortParam(value, order);
    this.context.router.push({
      ...this.props.location,
      query: { ...this.props.location.query, sort }
    });
  }

  handleSearch(searchParams) {
    const filters = this.buildSearchQuery(searchParams);

    this.context.router.push({
      ...this.props.location,
      query: filters
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

  makeSortMenu() {
    if (!this.props.messages || this.props.messages.length === 0) {
      return null;
    }

    const fields = [
      { label: 'most recent', value: 'sentDate', order: 'DESC' },
      { label: 'subject line', value: 'subject', order: 'ASC' },
      { label: 'sender', value: 'senderName', order: 'ASC' }
    ];

    const folderName = this.props.attributes.name;
    const isDraftsFolder = folderName === 'Drafts';
    const isSentFolder = folderName === 'Sent';

    if (isDraftsFolder || isSentFolder) {
      fields[2] = { label: 'recipient', value: 'recipientName', order: 'ASC' };
    }

    const sortOptions = fields.map(field => {
      return (
        <option
            key={field.value}
            value={field.value}
            data-order={field.order}>
          Sort by {field.label}
        </option>
      );
    });

    const handleSort = (event) => {
      const menu = event.target;
      const selectedIndex = menu.selectedIndex;
      const sortValue = menu.value;
      const sortOrder = menu[selectedIndex].dataset.order;
      this.handleSort(sortValue, sortOrder);
    };

    return (
      <div className="msg-folder-sort-select">
        <label htmlFor="folderSort" className="usa-sr-only">Sort by</label>
        <select
            id="folderSort"
            value={this.props.sort.value}
            onChange={handleSort}>
          {sortOptions}
        </select>
      </div>
    );
  }

  makeMessagesTable() {
    const messages = this.props.messages;
    if (!messages || messages.length === 0) {
      return <p className="msg-nomessages">You have no messages in this folder.</p>;
    }

    const makeMessageLink = (content, id) => {
      return <Link to={`/${this.props.params.folderName}/${id}`}>{content}</Link>;
    };

    const fields = [
      { label: 'From', value: 'senderName' },
      { label: 'Subject line', value: 'subject' },
      { label: 'Date', value: 'sentDate' }
    ];

    const folderId = this.props.attributes.folderId;
    const folderName = this.props.attributes.name;
    const isDraftsFolder = folderName === 'Drafts';
    const isSentFolder = folderName === 'Sent';
    const moveToFolders = [];
    const markUnread = folderId >= 0;

    if (isDraftsFolder || isSentFolder) {
      fields[0] = { label: 'To', value: 'recipientName' };

      // Hide 'Date' column for Drafts. There is no creation date
      // available, and drafts don't have sent dates.
      if (isDraftsFolder) {
        fields.pop();
      }
    } else {
      fields.push({ label: '', value: 'moveToButton' });

      // Exclude the current folder from the list of folders
      // that are passed down to the MoveTo component.
      this.props.folders.forEach((folder) => {
        if (folderId !== folder.folderId) {
          moveToFolders.push(folder);
        }
      });
    }

    const data = this.props.messages.map(message => {
      const id = message.messageId;
      const rowClass = classNames({
        'messaging-message-row': true,
        'messaging-message-row--unread':
          markUnread && message.readReceipt !== 'READ'
      });

      const moveToButton = (
        <MoveTo
            folders={moveToFolders}
            isOpen={id === this.props.moveToId}
            messageId={id}
            onChooseFolder={this.props.moveMessageToFolder}
            onCreateFolder={this.props.openMoveToNewFolderModal}
            onToggleMoveTo={() => this.props.toggleFolderMoveTo(id)}/>
      );

      return {
        id,
        rowClass,
        recipientName: makeMessageLink(message.recipientName, id),
        senderName: makeMessageLink(message.senderName, id),
        subject: makeMessageLink(message.subject, id),
        sentDate: makeMessageLink(formattedDate(message.sentDate), id),
        moveToButton
      };
    });

    return (
      <SortableTable
          className="usa-table-borderless va-table-list msg-table-list"
          currentSort={this.props.sort}
          data={data}
          fields={fields}
          onSort={this.handleSort}/>
    );
  }

  render() {
    const loading = this.props.loading;

    if (loading.inProgress) {
      return <LoadingIndicator message="is loading the folder..."/>;
    }

    const folderId = _.get(this.props.attributes, 'folderId', null);

    if (folderId === null) {
      const lastRequest = loading.request;

      if (lastRequest && lastRequest.id !== null) {
        const reloadFolder = () => {
          this.props.fetchFolder(lastRequest.id, lastRequest.query);
        };

        return (
          <p>
            Could not retrieve the folder.&nbsp;
            <a onClick={reloadFolder}>Click here to try again.</a>
          </p>
        );
      }

      return <p>Sorry, this folder does not exist.</p>;
    }

    const folderName = _.get(this.props.attributes, 'name');
    const messageNav = this.makeMessageNav();
    const sortMenu = this.makeSortMenu();
    const folderMessages = this.makeMessagesTable();

    let messageSearch;
    if (this.props.messages && this.props.messages.length) {
      messageSearch = (<MessageSearch
          isAdvancedVisible={this.props.isAdvancedVisible}
          onAdvancedSearch={this.props.toggleAdvancedSearch}
          onDateChange={this.props.setDateRange}
          onError={this.props.openAlert}
          onFieldChange={this.props.setSearchParam}
          onSubmit={this.handleSearch}
          params={this.props.searchParams}/>);
    }

    return (
      <div>
        <div
            id="messaging-content-header"
            className="messaging-folder-header">
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
          {messageSearch}
          {messageNav}
        </div>
        {sortMenu}
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
    filter: folder.filter,
    folders: state.folders.data.items,
    loading: state.folders.ui.loading,
    messageCount: totalCount,
    messages,
    moveToId: state.folders.ui.moveToId,
    page,
    totalPages,
    isAdvancedVisible: state.search.advanced.visible,
    searchParams: state.search.params,
    sort: folder.sort
  };
};

const mapDispatchToProps = {
  fetchFolder,
  moveMessageToFolder,
  openAlert,
  openMoveToNewFolderModal,
  setDateRange,
  setSearchParam,
  toggleAdvancedSearch,
  toggleFolderMoveTo,
  toggleFolderNav
};

export default connect(mapStateToProps, mapDispatchToProps)(Folder);
