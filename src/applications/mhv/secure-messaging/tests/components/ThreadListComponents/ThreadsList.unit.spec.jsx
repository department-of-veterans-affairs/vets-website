import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import ThreadsList from '../../../components/ThreadList/ThreadsList';
import inbox from '../../fixtures/folder-inbox-response.json';
import listOfThreads from '../../fixtures/thread-list-response.json';
import reducers from '../../../reducers';

describe('Thread List component', () => {
  const initialState = {
    sm: {
      folders: {},
      threads: [],
    },
  };

  const setPageNum = () => 1;
  const setSortOrder = () => 'ASC';
  const setSortBy = () => 'SENDER_NAME';
  const handleThreadApiCall = () => {
    return listOfThreads;
  };
  const threadsPerPage = 10;
  const folderId = 0;
  const pageNum = 1;
  let screen;

  const setup = () => {
    return renderWithStoreAndRouter(
      <ThreadsList
        threadList={listOfThreads}
        folder={inbox}
        folderId={folderId}
        setPageNum={setPageNum}
        pageNum={pageNum}
        setSortOrder={setSortOrder}
        setSortBy={setSortBy}
        handleThreadApiCall={handleThreadApiCall}
        threadsPerPage={threadsPerPage}
      />,
      {
        path: `/inbox`,
        state: initialState,
        reducers,
      },
    );
  };
  it('renders without errors', () => {
    screen = setup();
    expect(screen);
  });
  it('renders list of threads', async () => {
    screen = setup();

    const renderedThreads = await screen.getAllByTestId('thread-list-item');
    expect(renderedThreads.length).to.equal(listOfThreads.length);
  });
});
