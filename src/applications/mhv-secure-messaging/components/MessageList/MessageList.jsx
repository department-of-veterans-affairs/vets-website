/*
This component handles:
- displaying a list of 10 messages per page
- pagination logic
- sorting messages by sent date (desc - default, asc) and by sender's name (alpha desc or asc)

Assumptions that may need to be addressed:
- This component assumes it receives a payload containing ALL messages. Of the provided
pagination metadata, per_page and total_entries is used. If each page change requires another 
api call to fetch the next set of messages, this logic will need to be refactored, but shouldn't be difficult.
*/

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import MessageListItem from './MessageListItem';
import ThreadListSort from '../ThreadList/ThreadListSort';
import { setSearchPage, setSearchSort } from '../../actions/search';
import { Paths, threadSortingOptions } from '../../util/constants';

// Arbitrarily set because the VaPagination component has a required prop for this.
// This value dictates how many pages are displayed in a pagination component
const MAX_PAGE_LIST_LENGTH = 7;
const {
  SENT_DATE_ASCENDING,
  SENT_DATE_DESCENDING,
  DRAFT_DATE_ASCENDING,
  DRAFT_DATE_DESCENDING,
  RECEPIENT_ALPHA_ASCENDING,
  RECEPIENT_ALPHA_DESCENDING,
  SENDER_ALPHA_ASCENDING,
  SENDER_ALPHA_DESCENDING,
} = threadSortingOptions;
const MessageList = props => {
  const dispatch = useDispatch();
  const { folder, messages, keyword, isSearch, sortOrder, page } = props;

  const location = useLocation();
  const perPage = 10;
  const totalEntries = messages?.length;
  const multipleThreads = totalEntries > 1 ? 's' : '';
  const sortedListText =
    (location.pathname === Paths.DRAFTS ? 'draft' : 'message') +
    multipleThreads;

  const [currentMessages, setCurrentMessages] = useState([]);
  const [displayNums, setDisplayNums] = useState({
    from: 0,
    to: 0,
    label: '',
  }); // [from, to]
  const paginatedMessages = useRef([]);
  const displayingNumberOfMesssagesRef = useRef();

  // split messages into pages
  const paginateData = useCallback(
    data => {
      return chunk(data, perPage);
    },
    [perPage],
  );

  const fromToNums = useMemo(
    () => {
      const from = (page - 1) * perPage + 1;
      const to = Math.min(page * perPage, messages?.length);
      return { from, to };
    },
    [page, perPage, messages?.length],
  );

  // sort messages
  const sortMessages = useCallback(
    data => {
      return data.sort((a, b) => {
        if (
          [SENT_DATE_DESCENDING.value, DRAFT_DATE_DESCENDING.value].includes(
            sortOrder,
          ) ||
          (sortOrder === SENDER_ALPHA_ASCENDING.value &&
            a.senderName === b.senderName) ||
          (sortOrder === SENDER_ALPHA_DESCENDING.value &&
            a.senderName === b.senderName) ||
          (sortOrder === RECEPIENT_ALPHA_DESCENDING.value &&
            a.recipientName === b.recipientName)
        ) {
          return b.sentDate > a.sentDate ? 1 : -1;
        }
        if (
          [SENT_DATE_ASCENDING.value, DRAFT_DATE_ASCENDING.value].includes(
            sortOrder,
          )
        ) {
          return a.sentDate > b.sentDate ? 1 : -1;
        }

        if (sortOrder === SENDER_ALPHA_ASCENDING.value) {
          return a.senderName.toLowerCase() > b.senderName.toLowerCase()
            ? 1
            : -1;
        }
        if (sortOrder === SENDER_ALPHA_DESCENDING.value) {
          return a.senderName.toLowerCase() < b.senderName.toLowerCase()
            ? 1
            : -1;
        }
        if (sortOrder === RECEPIENT_ALPHA_ASCENDING.value) {
          return a.recipientName.toLowerCase() > b.recipientName.toLowerCase()
            ? 1
            : -1;
        }

        if (sortOrder === RECEPIENT_ALPHA_DESCENDING.value) {
          return a.recipientName.toLowerCase() < b.recipientName.toLowerCase()
            ? 1
            : -1;
        }
        return 0;
      });
    },
    [sortOrder],
  );

  useEffect(
    () => {
      if (messages?.length) {
        paginatedMessages.current = paginateData(sortMessages(messages));

        const maxPage = paginatedMessages.current.length;
        if (page > maxPage) {
          dispatch(setSearchPage(1));
          setCurrentMessages(paginatedMessages.current[0]);
        } else {
          setCurrentMessages(paginatedMessages.current[page - 1]);
        }
      }
    },
    [page, messages, paginateData, sortMessages, dispatch],
  );

  // update pagination values on...page change
  const onPageChange = pageValue => {
    setCurrentMessages(paginatedMessages.current[pageValue - 1]);
    dispatch(setSearchPage(pageValue));
    focusElement(displayingNumberOfMesssagesRef.current);
  };

  useEffect(
    () => {
      // get display numbers
      if (fromToNums && messages.length) {
        const label = `Showing ${fromToNums.from} - ${fromToNums.to} of ${
          messages.length
        } found messages`;
        setDisplayNums({ ...fromToNums, label });
      }
    },
    [fromToNums, messages.length],
  );

  const sortCallback = sortOrderValue => {
    dispatch(setSearchSort(sortOrderValue));
    dispatch(setSearchPage(1));
    recordEvent({
      event: 'cta-button-click',
      'button-type': 'primary',
      'button-click-label': 'Sort filtered messages',
    });
    focusElement(displayingNumberOfMesssagesRef.current);
  };

  return (
    <div className="message-list vads-l-row vads-u-flex-direction--column">
      {messages?.length > 1 && (
        <ThreadListSort sortOrder={sortOrder} sortCallback={sortCallback} />
      )}

      <h2 className="sr-only">List of filtered conversations</h2>
      <div
        role="status"
        ref={displayingNumberOfMesssagesRef}
        className="vads-u-padding-y--1 vads-l-row vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light"
      >
        {`Showing ${displayNums.from} to ${
          displayNums.to
        } of ${totalEntries} ${sortedListText}`}

        <span className="sr-only">
          {` sorted by ${threadSortingOptions[sortOrder].label}`}
        </span>
      </div>
      {currentMessages?.length > 0 &&
        currentMessages.map((message, idx) => (
          <MessageListItem
            key={`${message.messageId}+${idx}`}
            message={message}
            keyword={keyword}
            activeFolder={folder}
          />
        ))}
      {page === paginatedMessages.current.length && (
        <p className="vads-u-margin-y--3 vads-u-color--gray-medium">
          End of {!isSearch ? 'messages in this folder' : 'search results'}
        </p>
      )}
      {currentMessages &&
        paginatedMessages.current.length > 1 && (
          <VaPagination
            onPageSelect={e => onPageChange(e.detail.page)}
            page={page}
            pages={paginatedMessages.current.length}
            maxPageListLength={MAX_PAGE_LIST_LENGTH}
            showLastPage
          />
        )}
    </div>
  );
};

export default MessageList;

MessageList.propTypes = {
  folder: PropTypes.object,
  isSearch: PropTypes.bool,
  keyword: PropTypes.string,
  messages: PropTypes.array,
  page: PropTypes.number,
  sortOrder: PropTypes.string,
};
