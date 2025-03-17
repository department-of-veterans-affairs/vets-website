import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useLocation } from 'react-router-dom';
import ThreadListItem from './ThreadListItem';
import { Paths, threadSortingOptions } from '../../util/constants';
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

  const location = useLocation();

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
  const multipleThreads = totalThreads > 1 ? 's' : '';
  const sortedListText =
    (location.pathname === Paths.DRAFTS ? 'draft' : 'conversation') +
    multipleThreads;

  useEffect(
    () => {
      // get display numbers
      if (fromToNums && totalThreads) {
        const label = `Showing ${fromToNums.from} to ${
          fromToNums.to
        } of ${totalThreads} ${sortedListText}`;
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
          <div className="mobile:vads-l-grid-container mobile:vads-u-max-width--100">
            <div className="mobile:vads-l-row mobile:vads-u-max-width--100">
              <div className="mobile:vads-u-margin-left--neg2 mobile:vads-l-col--12 mobile:vads-u-padding-left--0 mobile:vads-u-max-width--100">
                <VaPagination
                  className="sm-pagination"
                  maxPageListLength={MAX_PAGE_LIST_LENGTH}
                  onPageSelect={e => paginationCallback(e.detail.page)}
                  page={pageNum}
                  pages={Math.ceil(
                    threadList[0]?.threadPageSize / threadsPerPage,
                  )}
                  uswds
                  data-dd-action-name="Pagination"
                />
              </div>
            </div>
          </div>
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
