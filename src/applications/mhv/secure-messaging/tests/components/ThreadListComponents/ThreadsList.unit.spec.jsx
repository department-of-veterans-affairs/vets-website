import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
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

  const setup = (
    threads,
    pageNumber = pageNum,
    threadsOnPage = threadsPerPage,
  ) => {
    return renderWithStoreAndRouter(
      <ThreadsList
        threadList={threads}
        folder={inbox}
        pageNum={pageNumber}
        sortOrder={threadSortingOptions.SENT_DATE_DESCENDING.value}
        paginationCallback={handleThreadApiCall}
        threadsPerPage={threadsOnPage}
      />,
      {
        path: Paths.INBOX,
        state: initialState,
        reducers,
      },
    );
  };
  it('renders without errors', () => {
    const screen = setup(listOfThreads);
    expect(screen);
  });
  it('renders list of threads', async () => {
    const screen = setup(listOfThreads);

    const renderedThreads = await screen.getAllByTestId('thread-list-item');
    expect(renderedThreads.length).to.equal(listOfThreads.length);
  });
  it('list with no threads', async () => {
    const noThreads = [];
    const screen = setup(noThreads);

    const renderedThreads = await screen.queryAllByTestId('thread-list-item');
    expect(renderedThreads.length).not.to.be.greaterThan(0);
  });

  it('displays "End of conversations" after last thread', async () => {
    const screen = setup(listOfThreads.slice(0, 3), 2, 10);
    await waitFor(() => {
      expect(screen.getByText('End of conversations in this folder')).to.exist;
    });
  });
});
