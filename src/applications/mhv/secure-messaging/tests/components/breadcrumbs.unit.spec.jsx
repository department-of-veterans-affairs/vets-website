import React from 'react';
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import SmBreadcrumbs from '../../components/shared/SmBreadcrumbs';
import messageResponse from '../fixtures/message-response.json';
import { inbox } from '../fixtures/folder-inbox-response.json';
import reducer from '../../reducers';
import * as Constants from '../../util/constants';

describe('Breadcrumbs', () => {
  const initialState = {
    sm: {
      messageDetails: { message: messageResponse },
      folders: { folder: inbox },
    },
  };

  it('on Message Details renders without errors', () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: `/message/${messageResponse.messageId}`,
    });
    expect(screen.findByText(messageResponse.subject, { exact: true }));
  });

  it('on Compose renders without errors', () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: Constants.Breadcrumbs.COMPOSE.path,
    });
    expect(
      screen.findByText(Constants.Breadcrumbs.COMPOSE.label, { exact: true }),
    );
  });

  it('on Drafts Folder renders without errors', () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: Constants.Breadcrumbs.DRAFTS.path,
    });
    expect(
      screen.findByText(Constants.Breadcrumbs.DRAFTS.label, {
        exact: true,
      }),
    );
  });

  it('on Sent Folder renders without errors', () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: Constants.Breadcrumbs.SENT.path,
    });
    expect(
      screen.findByText(Constants.Breadcrumbs.SENT.label, {
        exact: true,
      }),
    );
  });

  it('on Trash Folder renders without errors', () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: Constants.Breadcrumbs.TRASH.path,
    });
    expect(
      screen.findByText(Constants.Breadcrumbs.TRASH.label, {
        exact: true,
      }),
    );
  });

  it('on Search Folder renders without errors', () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: Constants.Breadcrumbs.SEARCH.path,
    });
    expect(
      screen.findByText(Constants.Breadcrumbs.SEARCH.label, {
        exact: true,
      }),
    );
  });

  it('on Advanced Search Folder renders without errors', () => {
    const screen = renderWithStoreAndRouter(<SmBreadcrumbs />, {
      initialState,
      reducers: reducer,
      path: Constants.Breadcrumbs.SEARCH_ADVANCED.path,
    });
    expect(
      screen.findByText(Constants.Breadcrumbs.SEARCH.label, {
        exact: true,
      }),
    );
    expect(
      screen.findByText(Constants.Breadcrumbs.SEARCH_ADVANCED.label, {
        exact: true,
      }),
    );
  });
});
