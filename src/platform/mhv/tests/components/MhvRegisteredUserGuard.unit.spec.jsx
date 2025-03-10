import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/dom';
import sinon from 'sinon';
import MhvRegisteredUserGuard from '../../components/MhvRegisteredUserGuard';

describe('MhvRegisteredUserGuard component', () => {
  let oldLocation;

  beforeEach(() => {
    oldLocation = global.window.location;
    delete global.window.location;
    global.window.location = {
      replace: sinon.spy(),
    };
  });

  afterEach(() => {
    global.window.location = oldLocation;
  });

  const initialState = {
    user: {
      profile: {
        verified: true,
        vaPatient: true,
        loa: {
          current: 3,
        },
      },
    },
  };

  const setup = (state = initialState, initialPath = '/') => {
    return renderWithStoreAndRouter(
      <MhvRegisteredUserGuard>
        <p>child node</p>
      </MhvRegisteredUserGuard>,
      {
        initialState: state,
        path: initialPath,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('redirects to /my-health when user is not LOA3', async () => {
    const customState = {
      user: {
        profile: {
          verified: true,
          vaPatient: true,
          loa: {
            current: 2,
          },
        },
      },
    };

    renderWithStoreAndRouter(
      <MhvRegisteredUserGuard>
        <p>child node</p>
      </MhvRegisteredUserGuard>,
      {
        initialState: customState,
        path: '/',
      },
    );

    await waitFor(() => {
      expect(window.location.replace.called).to.be.true;
    });
  });

  it('redirects to /my-health when user is not a patient', async () => {
    const customState = {
      user: {
        profile: {
          verified: true,
          vaPatient: false,
          loa: {
            current: 3,
          },
        },
      },
    };

    renderWithStoreAndRouter(
      <MhvRegisteredUserGuard>
        <p>child node</p>
      </MhvRegisteredUserGuard>,
      {
        initialState: customState,
        path: '/',
      },
    );

    await waitFor(() => {
      expect(window.location.replace.called).to.be.true;
    });
  });
});
