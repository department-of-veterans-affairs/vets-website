import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import ThreadsList from '../../../components/ThreadList/ThreadsList';
import inbox from '../../fixtures/folder-inbox-response.json';
import listOfThreads from '../../fixtures/thread-list-response.json';
import reducers from '../../../reducers';
import { Paths, threadSortingOptions } from '../../../util/constants';

describe('Thread List component', () => {
  const initialState = {
    sm: {
      folders: {},
      threads: {
        threadList: [],
      },
    },
  };

  const handleThreadApiCall = () => {
    return listOfThreads;
  };
  const threadsPerPage = 10;
  const pageNum = 1;
  let screen;

  const setup = threads => {
    return renderWithStoreAndRouter(
      <ThreadsList
        threadList={threads}
        folder={inbox}
        pageNum={pageNum}
        sortOrder={threadSortingOptions.SENT_DATE_DESCENDING.value}
        paginationCallback={handleThreadApiCall}
        threadsPerPage={threadsPerPage}
      />,
      {
        path: Paths.INBOX,
        state: initialState,
        reducers,
      },
    );
  };
  it('renders without errors', () => {
    screen = setup(listOfThreads);
    expect(screen);
  });
  it('renders list of threads', async () => {
    screen = setup(listOfThreads);

    const renderedThreads = await screen.getAllByTestId('thread-list-item');
    expect(renderedThreads.length).to.equal(listOfThreads.length);
  });
  it('list with no threads', async () => {
    const noThreads = [];
    screen = setup(noThreads);

    const renderedThreads = await screen.queryAllByTestId('thread-list-item');
    expect(renderedThreads.length).not.to.be.greaterThan(0);
  });
});
