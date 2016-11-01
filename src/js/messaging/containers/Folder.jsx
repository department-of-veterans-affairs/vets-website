import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';
import classNames from 'classnames';

import SortableTable from '../../common/components/SortableTable';

import {
  fetchFolder,
  sendSearch,
  setDateRange,
  setSearchParam,
  toggleAdvancedSearch,
  toggleFolderNav,
  resetPagination
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
    this.handleSearch = this.handleSearch.bind(this);
    this.makeMessageNav = this.makeMessageNav.bind(this);
    this.makeMessagesTable = this.makeMessagesTable.bind(this);
    this.getQueryParams = this.getQueryParams.bind(this);
    this.buildQuery = this.buildQuery.bind(this);
  }

  componentDidMount() {
    const id = this.props.params.id;
    const query = this.getQueryParams();
    if (query.search) {
      this.props.sendSearch(id, query);
    } else {
      this.props.fetchFolder(id, query);
    }
  }

  componentDidUpdate() {
    const oldId = this.props.attributes.folderId;
    const newId = +this.props.params.id;
    const query = this.getQueryParams();

    const oldPage = this.props.page;
    const newPage = +query.page || oldPage;

    const oldSort = this.formattedSortParam(
      this.props.sort.value,
      this.props.sort.order
    );

    const newSort = query.sort || oldSort;

    if (newId !== oldId || newPage !== oldPage || newSort !== oldSort) {
      if (query.search) {
        this.props.sendSearch(newId, query);
      } else {
        this.props.fetchFolder(newId, query);
      }
    }
  }

  getQueryParams() {
    const queryParams = [
      'page',
      'sort',
      'filter[[subject][match]]',
      'filter[[sent_date][gteq]]',
      'filter[[sent_date][lteq]]',
      'filter[[sender_name][eq]]',
      'filter[[sender_name][match]]',
      'filter[[subject][eq]]',
      'filter[[subject][match]]',
      'search'
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

  buildQuery(object) {
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

    filters.search = object.search;
    filters.page = this.props.page;
    filters.sort = this.formattedSortParam(
      this.props.sort.value,
      this.props.sort.order
    );

    return filters;
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

  handleSearch(searchParams) {
    this.props.resetPagination();
    const filters = this.buildQuery(searchParams);

    this.context.router.push({
      pathname: `${paths.FOLDERS_URL}/${this.props.params.id}`,
      query: Object.assign(this.props.location.query, filters)
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
      return <h1 className="msg-nomessages">No messages</h1>;
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
    const folderId = _.get(this.props.attributes, 'folderId', 0);
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
            folder={+folderId}
            isAdvancedVisible={this.props.isAdvancedVisible}
            onAdvancedSearch={this.props.toggleAdvancedSearch}
            onDateChange={this.props.setDateRange}
            params={this.props.searchParams}
            onFieldChange={this.props.setSearchParam}
            onSubmit={this.handleSearch}/>
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
    searchParams: state.search.params,
    sort: folder.sort
  };
};

const mapDispatchToProps = {
  fetchFolder,
  sendSearch,
  setDateRange,
  setSearchParam,
  toggleAdvancedSearch,
  toggleFolderNav,
  resetPagination
};

export default connect(mapStateToProps, mapDispatchToProps)(Folder);
