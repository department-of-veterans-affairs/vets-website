/*
Outstanding work:
- Uncomment pagination code once pagination bug is fixed by backend. Currently the api doesnt return correct amount of results per page.
- error handling when there are no threads in a folder
*/

import React from 'react';
import PropTypes from 'prop-types';
import {
  // VaPagination,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import ThreadListItem from './ThreadListItem';
import { threadSortingOptions } from '../../util/constants';

const SENDER_ALPHA_ASCENDING = 'sender-alpha-asc';
const SENDER_ALPHA_DESCENDING = 'sender-alpha-desc';
const RECEPIENT_ALPHA_ASCENDING = 'recepient-alpha-asc';
const RECEPIENT_ALPHA_DESCENDING = 'recepient-alpha-desc';

// Arbitrarily set because the VaPagination component has a required prop for this.
// This value dictates how many pages are displayed in a pagination component
// const MAX_PAGE_LIST_LENGTH = 5;

let sortOrderSelection;
const ThreadsList = props => {
  const location = useLocation();
  const {
    folder,
    threadList,
    keyword,
    setPageNum,
    pageNum,
    setSortOrder,
    setSortBy,
    handleThreadApiCall,
    threadsPerPage,
  } = props;

  const totalEntries = threadList?.length;
  const totalThreads = threadList[0]?.threadPageSize;
  // get display numbers
  const fromToNums = (page, total) => {
    const from = (page - 1) * threadsPerPage + 1;
    const to = Math.min(page * threadsPerPage, total);
    return [from, to];
  };
  // sort messages
  const handleThreadSortSelection = sortOption => {
    switch (sortOption) {
      case threadSortingOptions.ASCENDING:
        setSortOrder(threadSortingOptions.ASCENDING);
        if (location.pathname === '/drafts') {
          setSortBy(threadSortingOptions.SORT_BY_DRAFT_DATE);
          break;
        }
        setSortBy(threadSortingOptions.SORT_BY_SENT_DATE);
        break;
      case threadSortingOptions.DESCENDING:
        setSortOrder(threadSortingOptions.DESCENDING);
        if (location.pathname === '/drafts') {
          setSortBy(threadSortingOptions.SORT_BY_DRAFT_DATE);
          break;
        }
        setSortBy(threadSortingOptions.SORT_BY_SENT_DATE);
        break;
      case SENDER_ALPHA_ASCENDING:
        setSortOrder(threadSortingOptions.ASCENDING);
        setSortBy(threadSortingOptions.SORT_BY_SENDER);
        break;
      case SENDER_ALPHA_DESCENDING:
        setSortOrder(threadSortingOptions.DESCENDING);
        setSortBy(threadSortingOptions.SORT_BY_SENDER);
        break;
      case RECEPIENT_ALPHA_ASCENDING:
        setSortOrder(threadSortingOptions.ASCENDING);
        setSortBy(threadSortingOptions.SORT_BY_RECEPIENT);
        break;
      case RECEPIENT_ALPHA_DESCENDING:
        setSortOrder(threadSortingOptions.DESCENDING);
        setSortBy(threadSortingOptions.SORT_BY_RECEPIENT);
        break;
      default:
        setSortOrder(threadSortingOptions.ASCENDING);
        setSortBy(threadSortingOptions.SORT_BY_SENT_DATE);
    }
  };

  // update pagination values on...page change
  // const onPageChange = page => {
  //   setPageNum(page);
  // };

  // handle message sorting on sort button click
  const handleMessageSort = () => {
    setSortOrder(sortOrderSelection);
    setPageNum(1);
    handleThreadApiCall();
  };

  const handleOnSelect = e => {
    sortOrderSelection = e.detail.value;
    handleThreadSortSelection(e.detail.value);
  };

  const displayNums = fromToNums(pageNum, totalEntries);
  // const totalThreadPages = Math.ceil(totalThreads / threadsPerPage);

  return (
    <div className="thread-list vads-l-row vads-u-flex-direction--column">
      <div className="thread-list-sort">
        <VaSelect
          id="sort-order-dropdown"
          label="Sort by"
          name="sort-order"
          value={sortOrderSelection}
          onVaSelect={e => {
            handleOnSelect(e);
          }}
        >
          <option value={threadSortingOptions.DESCENDING}>
            Newest to oldest
          </option>
          <option value={threadSortingOptions.ASCENDING}>
            Oldest to newest
          </option>
          {location.pathname !== '/sent' && location.pathname !== '/drafts' ? (
            <>
              <option value={SENDER_ALPHA_ASCENDING}>
                A to Z - Sender’s name
              </option>
              <option value={SENDER_ALPHA_DESCENDING}>
                Z to A - Sender’s name
              </option>
            </>
          ) : (
            <>
              <option value={RECEPIENT_ALPHA_ASCENDING}>
                A to Z - Recipient’s name
              </option>
              <option value={RECEPIENT_ALPHA_DESCENDING}>
                Z to A - Recipient’s name
              </option>
            </>
          )}
        </VaSelect>

        <va-button
          type="button"
          text="Sort"
          label="Sort"
          data-testid="sort-button"
          onClick={() => {
            handleMessageSort();
            recordEvent({
              event: 'cta-button-click',
              'button-type': 'primary',
              'button-click-label': 'Sort messages',
            });
          }}
        />
      </div>
      <div className="vads-u-padding-y--1 vads-l-row vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
        Displaying {displayNums[0]}
        &#8211;
        {displayNums[1]} of {totalThreads} conversations
      </div>
      {threadList?.length > 0 &&
        threadList.map((thread, idx) => (
          <ThreadListItem
            key={`${thread.messageId}+${idx}`}
            keyword={keyword}
            activeFolder={folder}
            thread={thread}
          />
        ))}
      {/* {totalThreads > 1 && (
        <VaPagination
          onPageSelect={e => onPageChange(e.detail.page)}
          page={pageNum}
          pages={totalThreadPages}
          maxPageListLength={MAX_PAGE_LIST_LENGTH}
          showLastPage
        />
      )} */}
    </div>
  );
};

export default ThreadsList;

ThreadsList.propTypes = {
  folder: PropTypes.object,
  handleThreadApiCall: PropTypes.func,
  isSearch: PropTypes.bool,
  keyword: PropTypes.string,
  pageNum: PropTypes.number,
  setSortBy: PropTypes.func,
  setPageNum: PropTypes.func,
  setSortOrder: PropTypes.func,
  threadList: PropTypes.array,
  threadsPerPage: PropTypes.number,
};
