import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import reducers from '../../../reducers';
import ComposeMessageButton from '../../../components/MessageActionButtons/ComposeMessageButton';
import { Paths } from '../../../util/constants';

describe('ComposeMessageButton component', () => {
  const initialState = {
    sm: {
      threadDetails: {
        draftInProgress: {},
      },
    },
  };

  const setup = () => {
    return renderWithStoreAndRouter(<ComposeMessageButton />, {
      initialState,
      reducers,
      path: '/',
    });
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
