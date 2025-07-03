import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import UnreadMessagesCard from '../../../components/health-care/UnreadMessagesCard';

const mockStore = configureMockStore();

describe('UnreadMessagesCard', () => {
  let store;

  it('renders "No unread messages" when unreadMessagesCount is 0', () => {
    store = mockStore({
      health: {
        msg: {
          unreadCount: {
            count: 0,
          },
        },
      },
    });

    const screen = render(
      <Provider store={store}>
        <UnreadMessagesCard />
      </Provider>,
    );

    expect(screen.getByText('No unread messages')).to.exist;
  });

  it('renders "1 unread message" when unreadMessagesCount is 1', () => {
    store = mockStore({
      health: {
        msg: {
          unreadCount: {
            count: 1,
          },
        },
      },
    });

    const screen = render(
      <Provider store={store}>
        <UnreadMessagesCard />
      </Provider>,
    );

    expect(screen.getByText('1 unread message')).to.exist;
  });

  it('renders "2 unread messages" when unreadMessagesCount is 2', () => {
    store = mockStore({
      health: {
        msg: {
          unreadCount: {
            count: 2,
          },
        },
      },
    });

    const screen = render(
      <Provider store={store}>
        <UnreadMessagesCard />
      </Provider>,
    );
    expect(screen.getByText('2 unread messages')).to.exist;
  });
});
