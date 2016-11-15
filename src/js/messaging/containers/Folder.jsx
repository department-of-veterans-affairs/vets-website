import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import classNames from 'classnames';

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
    this.formattedSortParam = this.formattedSortParam.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.makeMessageNav = this.makeMessageNav.bind(this);
    this.makeMessagesTable = this.makeMessagesTable.bind(this);
    this.getQueryParams = this.getQueryParams.bind(this);
    this.buildSearchQuery = this.buildSearchQuery.bind(this);
  }

  componentDidMount() {
    const id = this.props.params.id;
    const query = this.getQueryParams();
    this.props.fetchFolder(id, query);
  }

  componentDidUpdate() {
    const query = this.getQueryParams();

    const oldId = this.props.attributes.folderId;
    const newId = +this.props.params.id;
    const idChanged = newId !== oldId;

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

  makeMessagesTable() {
    const messages = this.props.messages;
    if (!messages || messages.length === 0) {
      return <p className="msg-nomessages">You have no messages in this folder.</p>;
    }

    const makeMessageLink = (content, id) => {
      return <Link to={`/thread/${id}`}>{content}</Link>;
    };

    const currentSort = this.props.sort;

    const fields = [
      { label: 'From', value: 'senderName' },
      { label: 'Subject line', value: 'subject' },
      { label: 'Date', value: 'sentDate' }
    ];

    const sortOptions = fields.map(field => {
      return (
        <option key={field.value} value={field.value}>
          {field.label}
        </option>
      );
    });

    const sortSelect = (
      <div className="msg-folder-sort-select">
        <label htmlFor="folderSort" className="usa-sr-only">Sort by</label>
        <select
            id="folderSort"
            value={currentSort.value}
            onChange={(event) => this.handleSort(event.target.value)}>
          {sortOptions}
        </select>
      </div>
    );

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
      <div>
        {sortSelect}
        <SortableTable
            className="usa-table-borderless va-table-list msg-table-list"
            currentSort={currentSort}
            data={data}
            fields={fields}
            onSort={this.handleSort}/>
      </div>
    );
  }

  makeSortSelect() {
  }

  render() {
    const folderName = _.get(this.props.attributes, 'name');
    const messageNav = this.makeMessageNav();
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
        <div id="messaging-content-header">
          <button
              className="messaging-menu-button"
              type="button"
              onClick={this.props.toggleFolderNav}>
            Menu
          </button>
          <h2>{folderName}</h2>
        </div>
        {messageSearch}
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
    filter: folder.filter,
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
