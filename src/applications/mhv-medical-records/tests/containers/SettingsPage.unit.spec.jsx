import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent } from '@testing-library/dom';
import reducer from '../../reducers';
import SettingsPage from '../../containers/SettingsPage';

describe('SettingsPage container opted in with opt in status error', () => {
  const initialState = {
    mr: {
      sharing: {
        statusError: { type: 'optin' },
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<SettingsPage />, {
      initialState,
      reducers: reducer,
      path: '/settings',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('displays sharing status', () => {
    expect(screen.getByText('Manage your electronic sharing settings')).to
      .exist;
  });

  it('displays no action available header', () => {
    expect(
      screen.getByText('opt back in', {
        exact: false,
        selector: 'h3',
      }),
    ).to.exist;
  });
});

describe('SettingsPage container opted out with opt out status error', () => {
  const initialState = {
    mr: {
      sharing: {
        statusError: { type: 'optout' },
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<SettingsPage />, {
      initialState,
      reducers: reducer,
      path: '/settings',
    });
  });

  it('displays no action available header', () => {
    expect(
      screen.getByText('opt out', {
        exact: false,
        selector: 'h3',
      }),
    ).to.exist;
  });
});

describe('SettingsPage container with error', () => {
  const initialState = {
    mr: {
      sharing: {
        statusError: 'Error',
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<SettingsPage />, {
      initialState,
      reducers: reducer,
      path: '/settings',
    });
  });

  it('displays an error', () => {
    const error = screen.getByText(
      'We’re sorry. Something went wrong in our system. Try again later.',
      {
        exact: true,
        selector: 'p',
      },
    );
    expect(error).to.exist;
  });
});

describe('SettingsPage container loading', () => {
  const initialState = {
    mr: {
      sharing: {},
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<SettingsPage />, {
      initialState,
      reducers: reducer,
      path: '/settings',
    });
  });

  it('displays a loading indicator', () => {
    const loadingIndicator = screen.getByTestId(
      'sharing-status-loading-indicator',
    );
    expect(loadingIndicator).to.exist;
  });
});

describe('SettingsPage container automatically included', () => {
  const initialState = {
    mr: {
      sharing: { isSharing: 'test' },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<SettingsPage />, {
      initialState,
      reducers: reducer,
      path: '/settings',
    });
  });

  it('displays a loading indicator', () => {
    const autoIncludeMessage = screen.getByText(
      'We automatically include you in electronic sharing.',
      {
        exact: false,
        selector: 'p',
      },
    );
    expect(autoIncludeMessage).to.exist;
  });

  it('should open the opt out confirmation modal when the open opt out modal button is clicked', () => {
    fireEvent.click(screen.getByTestId('open-opt-in-out-modal-button'));
    expect(screen.getByText('If you opt out', { exact: false })).to.exist;
  });
});

describe('SettingsPage container not sharing', () => {
  const initialState = {
    mr: {
      sharing: { isSharing: '' },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<SettingsPage />, {
      initialState,
      reducers: reducer,
      path: '/settings',
    });
  });

  it('should open the opt in confirmation modal when the open opt in modal button is clicked', () => {
    fireEvent.click(screen.getByTestId('open-opt-in-out-modal-button'));
    expect(screen.getByText('If you opt back in', { exact: false })).to.exist;
  });
});
