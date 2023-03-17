/*
This component handles:
- displaying a list of 10 threads per page
- sorting messages

Assumptions that may need to be addressed:
- 

Outstanding work:
- individual message links go nowhere. Another component would need to be made 
to display message details. Another react route would need to be set up to handle this view, 
probably needing to accept a URL parameter
*/
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { useDispatch } from 'react-redux';
import ThreadListItem from './ThreadListItem';
import { getListOfThreads } from '../../actions/threads';
// import { getThreadList } from '../../api/SmApi';

const DESCENDING = 'DESC';
const ASCENDING = 'ASC';
const SORT_BY_SENDER = 'SENDER_NAME';
const SORT_BY_RECEPIENT = 'RECIPIENT_NAME';
const SORT_BY_SENT_DATE = 'SENT_DATE';
const SORT_BY_DRAFT_DATE = 'DRAFT_DATE';
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
  const dispatch = useDispatch();
  const { folder, threadList, keyword, folderId } = props;
  const pageSize = 10;
  const totalEntries = threadList?.length;

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState(DESCENDING);
  const [sortBy, setSortBy] = useState(SORT_BY_SENDER);

  // const paginatedMessages = useRef([]);

  // split messages into pages

  // get display numbers
  const fromToNums = (page, total) => {
    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);

    return [from, to];
  };
  // sort messages
  const handleThreadSortSelection = sortOption => {
    switch (sortOption) {
      case ASCENDING:
        setSortOrder(ASCENDING);
        if (location.pathname === '/drafts') {
          setSortBy(SORT_BY_DRAFT_DATE);
          break;
        }

        setSortBy(SORT_BY_SENT_DATE);
        break;
      case DESCENDING:
        setSortOrder(DESCENDING);
        if (location.pathname === '/drafts') {
          setSortBy(SORT_BY_DRAFT_DATE);
          break;
        }
        setSortBy(SORT_BY_SENT_DATE);
        break;
      case SENDER_ALPHA_ASCENDING:
        setSortOrder(ASCENDING);
        setSortBy(SORT_BY_SENDER);
        break;
      case SENDER_ALPHA_DESCENDING:
        setSortOrder(DESCENDING);
        setSortBy(SORT_BY_SENDER);
        break;
      case RECEPIENT_ALPHA_ASCENDING:
        setSortOrder(ASCENDING);
        setSortBy(SORT_BY_RECEPIENT);
        break;
      case RECEPIENT_ALPHA_DESCENDING:
        setSortOrder(DESCENDING);
        setSortBy(SORT_BY_RECEPIENT);
        break;
      default:
        setSortOrder(ASCENDING);
        setSortBy(SORT_BY_SENT_DATE);
    }
  };

  // run once on component mount to set initial message and page data
  // useEffect(
  //   () => {
  //     if (threadlist?.length) {

  //       setCurrentMessages(threadlist);
  //     }
  //   },
  //   [currentPage, messages, paginateData, sortMessages],
  // );

  // update pagination values on...page change
  // const onPageChange = page => {
  //   setCurrentMessages(paginatedMessages.current[page - 1]);
  //   setCurrentPage(page);
  // };

  // handle message sorting on sort button click
  const handleMessageSort = () => {
    dispatch(getListOfThreads(folderId, pageSize, 1, sortBy, sortOrder));
    // paginatedMessages.current = paginateData(sortMessages(messages));
    // setCurrentMessages(paginatedMessages.current[0]);
    setCurrentPage(1);
    setSortOrder(sortOrderSelection);
  };

  const handleOnSelect = e => {
    sortOrderSelection = e.detail.value;
    handleThreadSortSelection(e.detail.value);
  };

  const displayNums = fromToNums(currentPage, threadList?.length);

  return (
    <div className="message-list vads-l-row vads-u-flex-direction--column">
      <div className="message-list-sort">
        <VaSelect
          id="sort-order-dropdown"
          label="Sort by"
          name="sort-order"
          value={sortOrderSelection}
          onVaSelect={e => {
            handleOnSelect(e);
          }}
        >
          <option value={DESCENDING}>Newest to oldest</option>
          <option value={ASCENDING}>Oldest to newest</option>
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
        {displayNums[1]} of {totalEntries} conversations
      </div>
      {threadList?.length > 0 &&
        threadList.map((thread, idx) => (
          <ThreadListItem
            key={`${thread.messageId}+${idx}`}
            messageId={thread.messageId}
            senderName={thread.senderName}
            sentDate={thread.sentDate}
            subject={thread.subject}
            readReceipt={thread.readReceipt}
            attachment={thread.attachment}
            recipientName={thread.recipientName}
            keyword={keyword}
            category={thread.category}
            activeFolder={folder}
            triageGroupName={thread.triageGroupName}
          />
        ))}
    </div>
  );
};

export default ThreadsList;

ThreadsList.propTypes = {
  folder: PropTypes.object,
  isSearch: PropTypes.bool,
  keyword: PropTypes.string,
  threadList: PropTypes.array,
};
