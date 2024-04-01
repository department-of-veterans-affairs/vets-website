import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import Navigation from '../../components/Navigation';
import reducer from '../../reducers';

describe('Navigation', async () => {
  const paths = [
    {
      path: '/',
      label: 'Medical records',
      datatestid: 'about-va-medical-records-sidebar',
      subpaths: [
        {
          path: '/vaccines',
          label: 'Vaccines',
          datatestid: 'vaccines-sidebar',
        },
        {
          path: '/allergies',
          label: 'Allergies and reactions',
          datatestid: 'allergies-sidebar',
        },
      ],
    },
  ];

  const initialState = {
    mr: {},
  };

  const setup = (path = '/') => {
    return renderWithStoreAndRouter(<Navigation paths={paths} />, {
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
      expect(screen.getByText('Medical records')).to.exist;
    });
  });

  it('renders properly on mobile view', async () => {
    setScreenWidth(480);

    const screen = setup();
    const mobileButtonText = screen.getByText('In this section');
    expect(mobileButtonText).to.exist;
    expect($('.sidebar-navigation', screen.container)).to.not.exist;
    fireEvent.click(screen.getByTestId('section-guide-button'));
    expect($('.sidebar-navigation', screen.container)).to.exist;
    const closeNavButton = $(
      'button[aria-label="Close navigation menu"]',
      screen.container,
    );

    fireEvent.click(closeNavButton);
    expect($('.sidebar-navigation', screen.container)).to.not.exist;
  });

  it('closes mobile sidebar navigation on link click', async () => {
    setScreenWidth(480);
    const screen = setup();
    const mobileButton = screen.getByText('In this section');
    fireEvent.click(mobileButton);
    fireEvent.click(screen.getByTestId('vaccines-sidebar'));
    waitFor(() => {
      expect($('.sidebar-navigation', screen.container)).to.not.exist;
    });
  });
});
