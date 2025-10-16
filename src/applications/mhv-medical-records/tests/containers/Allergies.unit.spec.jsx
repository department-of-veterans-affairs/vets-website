import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent, waitFor, within } from '@testing-library/react';
import Allergies from '../../containers/Allergies';
import reducer from '../../reducers';
import allergies from '../fixtures/allergies.json';
import user from '../fixtures/user.json';
import { convertAllergy } from '../../reducers/allergies';

describe('Allergies list container', () => {
  const initialState = {
    featureToggles: {
      /* eslint-disable camelcase */
      mhv_accelerated_delivery_enabled: false,
      mhv_accelerated_delivery_allergies_enabled: false,
      /* eslint-enable camelcase */
      loading: false,
    },
    drupalStaticData: {
      vamcEhrData: {
        loading: false,
      },
    },
    user: {
      ...user,
      profile: {
        ...user.profile,
        facilities: [
          {
            facilityId: '983',
            isCerner: false,
          },
        ],
      },
    },
    mr: {
      allergies: {
        allergiesList: allergies.entry.map(item =>
          convertAllergy(item.resource),
        ),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<Allergies runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/allergies',
    });
  });

  it('renders without errors', () => {
    expect(screen.getByText('Allergies and reactions', { exact: true })).to
      .exist;
  });

  it('displays the first part of the subheading', () => {
    expect(
      screen.getByText(
        'Review allergies, reactions, and side effects in your VA medical records. This includes medication side effects (also called adverse drug reactions).',
        { exact: false },
      ),
    ).to.exist;
  });

  it('displays the second part of the subheading', () => {
    expect(
      screen.getByText(
        'If you have allergies that are missing from this list, tell your care team at your next appointment.',
        { exact: false },
      ),
    ).to.exist;
  });

  it('displays a count of the records', () => {
    expect(screen.getByText('Showing 1 to 5 of 5 records', { exact: false })).to
      .exist;
  });

  it.skip('displays a list of records', async () => {
    const webList = screen.getByTestId('record-list-web');
    const items = await within(webList).findAllByTestId('record-list-item');
    expect(items).to.have.lengthOf(5);
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-download-menu');
    expect(printButton).to.exist;
  });

  it('should display a download started message when the download pdf button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });

  it('should display a download started message when the download txt file button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-2'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });
});

describe('Allergies list container still loading', () => {
  it('displays a loading indicator', () => {
    const initialState = {
      user,
      mr: {
        allergies: {},
        alerts: {
          alertList: [],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<Allergies runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/allergies',
    });

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('Allergies list container with no allergies', () => {
  it('displays a no allergies message', () => {
    const initialState = {
      user,
      mr: {
        allergies: {
          allergiesList: [],
        },
        alerts: {
          alertList: [],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<Allergies runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/allergies',
    });

    expect(
      screen.getByText(
        'There are no allergies or reactions in your VA medical records.',
        { exact: true },
      ),
    ).to.exist;
  });
});

describe('Allergies list container with errors', () => {
  it('displays an error', async () => {
    const initialState = {
      user,
      mr: {
        allergies: {},
        alerts: {
          alertList: [
            {
              datestamp: '2023-10-10T16:03:28.568Z',
              isActive: true,
              type: 'error',
            },
            {
              datestamp: '2023-10-10T16:03:28.572Z',
              isActive: true,
              type: 'error',
            },
          ],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<Allergies runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/allergies',
    });

    await waitFor(() => {
      expect(
        screen.getByText('We can’t access your allergy records right now', {
          exact: false,
        }),
      ).to.exist;
    });
  });
});
