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

  it('does not display thread sort if only 1 thread exists in folder', async () => {
    const oneThread = [listOfThreads[0]];
    const screen = setup(oneThread);

    const renderedThreads = await screen.queryAllByTestId('thread-list-item');
    expect(renderedThreads.length).not.to.be.greaterThan(1);
    expect(screen.queryByTestId('thread-list-sort')).to.not.exist;
  });

  it('displays "End of conversations" after last thread', async () => {
    const screen = setup(listOfThreads.slice(0, 3), 2, 10);
    await waitFor(() => {
      expect(screen.getByText('End of conversations in this folder')).to.exist;
    });
  });

  it('displays V3 va-pagingation component', () => {
    const screen = setup(listOfThreads);
    screen;
    expect(document.querySelector('va-pagination[uswds="true"]')).to.exist;
  });

  it('displays V3 va-pagination component on last page if threadList has at least one threadListItem', async () => {
    const screen = setup(listOfThreads, 2, 10);

    await waitFor(() => {
      expect(screen.getByText('Showing 11 to 11 of 11 conversations')).to.exist;

      expect(document.querySelector('va-pagination[page="2"]')).to.exist;
      expect(document.querySelector('va-pagination[pages="2"]')).to.exist;
      expect(document.querySelector('va-pagination[uswds="true"]')).to.exist;
    });
  });
});
