/*
This component handles:
- displaying a list of 10 messages per page
- pagination logic
- sorting messages by sent date (desc - default, asc) and by sender's name (alpha desc or asc)

Assumptions that may need to be addressed:
- This component assumes it receives a payload containing ALL messages. Of the provided
pagination metadata, per_page and total_entries is used. If each page change requires another 
api call to fetch the next set of messages, this logic will need to be refactored, but shouldn't be difficult.

Outstanding work:
- individual message links go nowhere. Another component would need to be made 
to display message details. Another react route would need to be set up to handle this view, 
probably needing to accept a URL parameter
*/
import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';
import {
  VaPagination,
  VaSelect,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation } from 'react-router-dom';
import InboxListItem from './MessageListItem';

// Arbitrarily set because the VaPagination component has a required prop for this.
// This value dictates how many pages are displayed in a pagination component
const MAX_PAGE_LIST_LENGTH = 5;
let sortOrderSelection;
const MessageList = props => {
  const location = useLocation();
  const { messages, folder } = props;
  // const perPage = messages.meta.pagination.per_page;
  const perPage = 10;
  // const totalEntries = messages.meta.pagination.total_entries;
  const totalEntries = messages?.length;

  const [currentMessages, setCurrentMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const paginatedMessages = useRef([]);

  // split messages into pages
  const paginateData = useCallback(
    data => {
      return chunk(data, perPage);
    },
    [perPage],
  );

  // get display numbers
  const fromToNums = (page, total) => {
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    return [from, to];
  };

  // sort messages
  const sortMessages = useCallback(
    data => {
      let sorted;
      if (sortOrder === 'desc') {
        sorted = data.sort((a, b) => {
          return b.sentDate > a.sentDate ? 1 : -1;
        });
      } else if (sortOrder === 'asc') {
        sorted = data.sort((a, b) => {
          return a.sentDate > b.sentDate ? 1 : -1;
        });
      } else if (sortOrder === 'alpha-asc') {
        sorted = data.sort((a, b) => {
          return a.senderName > b.senderName ? 1 : -1;
        });
      } else if (sortOrder === 'alpha-desc') {
        sorted = data.sort((a, b) => {
          return a.senderName < b.senderName ? 1 : -1;
        });
      } else if (sortOrder === 'recepient-alpha-asc') {
        sorted = data.sort((a, b) => {
          return a.recipientName > b.recipientName ? 1 : -1;
        });
      } else if (sortOrder === 'recepient-alpha-desc') {
        sorted = data.sort((a, b) => {
          return a.recipientName < b.recipientName ? 1 : -1;
        });
      }
      return sorted;
    },
    [sortOrder],
  );

  // run once on component mount to set initial message and page data
  useEffect(
    () => {
      if (messages?.length) {
        paginatedMessages.current = paginateData(sortMessages(messages));

        setCurrentMessages(paginatedMessages.current[currentPage - 1]);
      }
    },
    [currentPage, messages, paginateData, sortMessages],
  );

  // update pagination values on...page change
  const onPageChange = page => {
    setCurrentMessages(paginatedMessages.current[page - 1]);
    setCurrentPage(page);
  };

  // handle message sorting on sort button click
  const handleMessageSort = () => {
    paginatedMessages.current = paginateData(sortMessages(messages));
    setCurrentMessages(paginatedMessages.current[0]);
    setCurrentPage(1);
    setSortOrder(sortOrderSelection);
  };

  const handleOnSelect = e => {
    sortOrderSelection = e.detail.value;
  };

  const displayNums = fromToNums(currentPage, messages?.length);

  return (
    <div className="message-list vads-l-row vads-u-flex-direction--column">
      <div className="message-list-sort">
        <VaSelect
          id="sort-order-dropdown"
          label={`Sort ${
            folder.folderId === -3 ? 'Trash' : folder.name
          } messages by`}
          name="sort-order"
          value={sortOrderSelection}
          onVaSelect={e => {
            handleOnSelect(e);
          }}
        >
          <option value="desc">Newest to oldest</option>
          <option value="asc">Oldest to newest</option>

          {location.pathname !== '/sent' && location.pathname !== '/drafts' ? (
            <>
              <option value="alpha-asc">A to Z - Sender’s name</option>
              <option value="alpha-desc">Z to A - Sender’s name</option>
            </>
          ) : null}
          {location.pathname !== '/' ? (
            <>
              <option value="recepient-alpha-asc">
                A to Z - Recepient’s name
              </option>
              <option value="recepient-alpha-desc">
                Z to A - Recepient’s name
              </option>
            </>
          ) : null}
        </VaSelect>

        <button type="button" onClick={handleMessageSort}>
          Sort
        </button>
      </div>
      <div className="vads-u-padding-y--1p5 vads-l-row vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
        Displaying {displayNums[0]}
        &#8211;
        {displayNums[1]} of {totalEntries} messages
      </div>
      {currentMessages.map((message, idx) => (
        <InboxListItem
          key={`${message.messageId}+${idx}`}
          messageId={message.messageId}
          senderName={message.senderName}
          sentDate={message.sentDate}
          subject={message.subject}
          readReceipt={message.readReceipt}
          attachment={message.attachment}
        />
      ))}
      {currentMessages && (
        <VaPagination
          onPageSelect={e => onPageChange(e.detail.page)}
          page={currentPage}
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
  messages: PropTypes.array,
};
