import React from 'react';
import PropTypes from 'prop-types';
import ThreadListItem from './ThreadListItem';

const ThreadsList = props => {
  const { folder, threadList, keyword, pageNum, threadsPerPage } = props;

  const totalEntries = threadList?.length;
  const totalThreads = threadList[0]?.threadPageSize;
  // get display numbers
  const fromToNums = (page, total) => {
    const from = (page - 1) * threadsPerPage + 1;
    const to = Math.min(page * threadsPerPage, total);
    return { from, to };
  };

  const displayNums = fromToNums(pageNum, totalEntries);

  return (
    <div className="thread-list vads-l-row vads-u-flex-direction--column">
      <div className="vads-u-padding-y--1 vads-l-row vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
        Displaying {displayNums.from}
        &#8211;
        {displayNums.to} of {totalThreads} conversations
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
