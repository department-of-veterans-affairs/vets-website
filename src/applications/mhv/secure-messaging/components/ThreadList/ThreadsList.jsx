import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ThreadListItem from './ThreadListItem';
import { threadSortingOptions } from '../../util/constants';
import ThreadListSort from './ThreadListSort';

const ThreadsList = props => {
  const {
    folder,
    threadList,
    keyword,
    pageNum,
    paginationCallback,
    sortCallback,
    sortOrder,
    threadsPerPage,
  } = props;

  const MAX_PAGE_LIST_LENGTH = 7;

  const [displayNums, setDisplayNums] = useState({
    from: 0,
    to: 0,
    label: '',
  }); // [from, to]
  const totalThreads = threadList[0]?.threadPageSize;

  const [atEndOfThreads, setAtEndOfThreads] = useState(false);

  const fromToNums = useMemo(
    () => {
      const from = (pageNum - 1) * threadsPerPage + 1;
      const to = Math.min(pageNum * threadsPerPage, totalThreads);
      return { from, to };
    },
    [pageNum, threadsPerPage, totalThreads],
  );

  useEffect(
    () => {
      // get display numbers
      if (fromToNums && totalThreads) {
        const label = `Showing ${fromToNums.from} to ${
          fromToNums.to
        } of ${totalThreads} conversations`;
        setDisplayNums({ ...fromToNums, label });
      }

      if (totalThreads === fromToNums.to) {
        setAtEndOfThreads(true);
      } else {
        setAtEndOfThreads(false);
      }
    },
    [fromToNums, totalThreads],
  );

  return (
    <>
      {threadList?.length > 1 && (
        <ThreadListSort sortOrder={sortOrder} sortCallback={sortCallback} />
      )}
      <div className="thread-list vads-l-row vads-u-flex-direction--column">
        <h2 className="sr-only">List of conversations</h2>
        <div
          role="status"
          data-testid="displaying-number-of-threads"
          className="vads-u-padding-y--1 vads-l-row vads-u-margin-top--2 vads-u-background-color--gray-light-alt vads-u-padding-left--1"
        >
          {displayNums.label}
          <span className="sr-only">
            {` sorted by ${threadSortingOptions[sortOrder].label}`}
          </span>
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
        {atEndOfThreads && (
          <div className="endOfThreads vads-u-padding-y--2">
            <span>End of conversations in this folder</span>
          </div>
        )}

        {threadList?.length > 0 && (
          <VaPagination
            maxPageListLength={MAX_PAGE_LIST_LENGTH}
            onPageSelect={e => paginationCallback(e.detail.page)}
            page={pageNum}
            pages={Math.ceil(threadList[0]?.threadPageSize / threadsPerPage)}
            uswds
          />
        )}
      </div>
    </>
  );
};

export default ThreadsList;

ThreadsList.propTypes = {
  folder: PropTypes.object,
  keyword: PropTypes.string,
  pageNum: PropTypes.number,
  paginationCallback: PropTypes.func,
  sortCallback: PropTypes.func,
  sortOrder: PropTypes.string,
  threadList: PropTypes.array,
  threadsPerPage: PropTypes.number,
};
