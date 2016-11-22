import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import classNames from 'classnames';

import LoadingIndicator from '../../common/components/LoadingIndicator';
import SortableTable from '../../common/components/SortableTable';

import {
  fetchFolder,
  openAlert,
  setDateRange,
  setSearchParam,
  toggleAdvancedSearch,
  toggleFolderNav
} from '../actions';

import ComposeButton from '../components/ComposeButton';
import MessageNav from '../components/MessageNav';
import MessageSearch from '../components/MessageSearch';
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
    if (!this.props.loading) {
      const id = this.getRequestedFolderId();
      const query = this.getQueryParams();
      this.props.fetchFolder(id, query);
    }
  }

  componentDidUpdate() {
    if (!this.props.loading) {
      const oldId = this.props.attributes.folderId;
      const newId = this.getRequestedFolderId();

      if (newId === null) { return; }

      const idChanged = newId !== oldId;

      const query = this.getQueryParams();

      const pageChanged = () => {
        const oldPage = this.props.page;
        const newPage = +query.page || oldPage;
        return newPage !== oldPage;
      };

      const sortChanged = () => {
        const oldSort = this.formattedSortParam(
          this.props.sort.value,
          this.props.sort.order
        );
        const newSort = query.sort || oldSort;
        return newSort !== oldSort;
      };

      const filterChanged = () => {
        const fromDateSearchChanged =
          query['filter[[sent_date][gteq]]'] !==
          _.get(this.props.filter, 'sentDate.gteq');

        const toDateSearchChanged =
          query['filter[[sent_date][lteq]]'] !==
          _.get(this.props.filter, 'sentDate.lteq');

        const senderSearchChanged =
          (query['filter[[sender_name][eq]]'] !==
          _.get(this.props.filter, 'senderName.eq')) ||
          (query['filter[[sender_name][match]]'] !==
          _.get(this.props.filter, 'senderName.match'));

        const subjectSearchChanged =
          (query['filter[[subject][eq]]'] !==
          _.get(this.props.filter, 'subject.eq')) ||
          (query['filter[[subject][match]]'] !==
          _.get(this.props.filter, 'subject.match'));

        return (
          fromDateSearchChanged ||
          toDateSearchChanged ||
          senderSearchChanged ||
          subjectSearchChanged
        );
      };

      const shouldUpdate =
        idChanged ||
        pageChanged() ||
        sortChanged() ||
        filterChanged();

      if (shouldUpdate) {
        this.props.fetchFolder(newId, query);
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
    const markUnread = folderId >= 0;

    const data = this.props.messages.map(message => {
      const id = message.messageId;
      const rowClass = classNames({
        'messaging-message-row': true,
        'messaging-message-row--unread':
          markUnread && message.readReceipt !== 'READ'
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
          className="usa-table-borderless va-table-list msg-table-list"
          currentSort={this.props.sort}
          data={data}
          fields={fields}
          onSort={this.handleSort}/>
    );
  }

  render() {
    if (this.props.loading) {
      return <LoadingIndicator message="is loading the folder..."/>;
    }

    if (this.getRequestedFolderId() === null) {
      return <b>Sorry, this folder does not exist.</b>;
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
    page,
    totalPages,
    isAdvancedVisible: state.search.advanced.visible,
    searchParams: state.search.params,
    sort: folder.sort
  };
};

const mapDispatchToProps = {
  fetchFolder,
  openAlert,
  setDateRange,
  setSearchParam,
  toggleAdvancedSearch,
  toggleFolderNav
};

export default connect(mapStateToProps, mapDispatchToProps)(Folder);
