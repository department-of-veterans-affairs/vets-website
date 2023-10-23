import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import Navigation from '../../components/Navigation';
import reducer from '../../reducers';
import inbox from '../fixtures/folder-inbox-metadata.json';

describe('Navigation', async () => {
  const initialState = {
    sm: {
      folders: {
        folder: inbox,
      },
    },
  };
  const setup = (path = '/') => {
    return renderWithStoreAndRouter(<Navigation />, {
      initialState,
      reducers: reducer,
      path,
    });
  };
  let initialWidth;
  const setScreenWidth = width => {
    window.innerWidth = width;
  };
  beforeEach(async () => {
    initialWidth = window.innerWidth;
  });

  afterEach(async () => {
    await setScreenWidth(initialWidth);
  });

  it('renders without crashing', async () => {
    setScreenWidth(800);

    const screen = setup();
    await waitFor(() => {
      expect(screen.getByText('Messages')).to.exist;
    });
  });

  it('formats a nav link correctly on matching /inbox/ path', async () => {
    setScreenWidth(800);

    const screen = setup('/inbox/');
    await waitFor(() => {
      expect(screen.getByText('Inbox').parentNode).to.have.attribute(
        'class',
        'is-active',
      );
    });
  });

  it('formats a nav link correctly on matching /folders/ path', async () => {
    setScreenWidth(800);

    const screen = setup('/folders/');
    await waitFor(() => {
      expect(screen.getByText('My folders').parentNode).to.have.attribute(
        'class',
        'is-active',
      );
    });
  });

  it('formats a nav link correctly on matching /folders/:folderId path', async () => {
    setScreenWidth(800);

    const screen = setup('/folders/123456');
    await waitFor(() => {
      expect(screen.getByText('My folders').parentNode).to.have.attribute(
        'class',
        'is-active',
      );
    });
  });

  it('formats a nav link correctly on matching thread FolderId if landed on /thread/:messageId path', async () => {
    setScreenWidth(800);

    const folderName = inbox.name;
    const screen = setup('/thread/123456');
    await waitFor(() => {
      expect(screen.getByText(folderName).parentNode).to.have.attribute(
        'class',
        'is-active',
      );
    });
  });

  it('renders properly on mobile view', async () => {
    setScreenWidth(767);

    const screen = setup();
    const mobileButton = screen.getByText('In the Messages section');
    expect(mobileButton).to.exist;
    expect($('.sidebar-navigation', screen.container)).to.not.exist;

    fireEvent.click(mobileButton);
    expect($('.sidebar-navigation', screen.container)).to.exist;
    const closeNavButton = $(
      'button[aria-label="Close navigation menu"]',
      screen.container,
    );

    fireEvent.click(closeNavButton);
    expect($('.sidebar-navigation', screen.container)).to.not.exist;
  });

  it('closes mobile sidebar navigation on link click', async () => {
    setScreenWidth(767);
    const screen = setup();
    const mobileButton = screen.getByText('In the Messages section');
    fireEvent.click(mobileButton);
    fireEvent.click(screen.getByText('Inbox'));
    expect($('.sidebar-navigation', screen.container)).to.not.exist;
  });
});
