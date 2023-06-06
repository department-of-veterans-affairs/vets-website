import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ThreadListItem from './ThreadListItem';

const ThreadsList = props => {
  const { folder, threadList, keyword, pageNum, threadsPerPage } = props;

  const [displayNums, setDisplayNums] = useState({
    from: 0,
    to: 0,
    label: '',
  }); // [from, to]
  const totalThreads = threadList[0]?.threadPageSize;

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
        const label = `Displaying ${fromToNums.from} - ${
          fromToNums.to
        } of ${totalThreads} conversations`;
        setDisplayNums({ ...fromToNums, label });
      }
    },
    [fromToNums, totalThreads],
  );

  return (
    <div className="thread-list vads-l-row vads-u-flex-direction--column">
      <div
        aria-label={displayNums.label.replace('-', 'to')}
        data-testid="displaying-number-of-threads"
        className="vads-u-padding-y--1 vads-l-row vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light"
      >
        {displayNums.label}
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
    </div>
  );
};

export default ThreadsList;

ThreadsList.propTypes = {
  folder: PropTypes.object,
  keyword: PropTypes.string,
  pageNum: PropTypes.number,
  threadList: PropTypes.array,
  threadsPerPage: PropTypes.number,
};
