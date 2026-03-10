import React from 'react';
import { expect } from 'chai';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import { commonReducer } from 'platform/startup/store';
import reducers from '../../../reducers';
import ComposeMessageButton from '../../../components/MessageActionButtons/ComposeMessageButton';
import { Paths } from '../../../util/constants';

describe('ComposeMessageButton component', () => {
  const initialState = {
    sm: {
      threadDetails: {
        draftInProgress: {
          messageId: 12345,
          body: 'draft body',
          subject: 'draft subject',
          recipientId: 67890,
        },
      },
    },
  };

  const setup = (state = initialState) => {
    const store = createStore(
      combineReducers({ ...commonReducer, ...reducers }),
      state,
      applyMiddleware(thunk),
    );
    return {
      ...renderWithStoreAndRouter(<ComposeMessageButton />, {
        store,
        reducers,
        path: '/',
      }),
      store,
    };
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays "Start a new message" link text', () => {
    const screen = setup();
    expect(screen.getByText('Start a new message')).to.exist;
  });

  it('renders a link with data-testid compose-message-link', () => {
    const screen = setup();
    const link = screen.getByTestId('compose-message-link');
    expect(link).to.exist;
  });

  it('links to the compose path', () => {
    const screen = setup();
    const link = screen.getByTestId('compose-message-link');
    expect(link).to.have.attribute('href', Paths.COMPOSE);
  });

  it('dispatches clearDraftInProgress when clicked', () => {
    const { getByTestId, store } = setup();
    const link = getByTestId('compose-message-link');
    fireEvent.click(link);
    const { draftInProgress } = store.getState().sm.threadDetails;
    expect(draftInProgress.messageId).to.be.null;
    expect(draftInProgress.body).to.be.null;
    expect(draftInProgress.subject).to.be.null;
    expect(draftInProgress.recipientId).to.be.null;
  });

  it('navigates to the compose path when clicked', () => {
    const screen = setup();
    const link = screen.getByTestId('compose-message-link');
    fireEvent.click(link);
    expect(screen.history.location.pathname).to.equal(Paths.COMPOSE);
  });

  it('has the correct CSS classes', () => {
    const screen = setup();
    const link = screen.getByTestId('compose-message-link');
    expect(link.className).to.include('compose-message-link');
    expect(link.className).to.include('vads-c-action-link--green');
  });
});
