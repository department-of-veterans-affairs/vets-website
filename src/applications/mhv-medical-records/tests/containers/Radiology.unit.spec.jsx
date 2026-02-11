import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import { beforeEach } from 'mocha';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import Radiology from '../../containers/Radiology';
import reducer from '../../reducers';
import radiologyTests from '../fixtures/radiologyRecordsMhv.json';
import { convertMhvRadiologyRecord } from '../../util/imagesUtil';
import user from '../fixtures/user.json';
import { studyJobStatus } from '../../util/constants';

describe('Radiology list container', () => {
  const radiologyRecords = radiologyTests.map(item =>
    convertMhvRadiologyRecord({ ...item, hash: `hash-${item.id}` }),
  );
  const initialState = {
    mr: {
      radiology: {
        radiologyList: radiologyRecords,
        dateRange: {
          option: '3',
          fromDate: '2025-08-13',
          toDate: '2025-11-13',
        },
      },
    },
  };

  let screen = null;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<Radiology />, {
      initialState,
      reducers: reducer,
      path: '/imaging-results',
    });
  });

  it('renders without errors', () => {
    expect(
      screen.getByText('Medical imaging results', {
        exact: true,
        selector: 'h1',
      }),
    ).to.exist;
  });

  it('displays a subheading', () => {
    expect(
      screen.getByText('Review reports from your VA imaging tests', {
        exact: false,
      }),
    ).to.exist;
  });

  it('displays a list of records', async () => {
    await waitFor(() => {
      expect(screen.getAllByTestId('record-list-item').length).to.be.at.least(
        1,
      );
    });
  });
});

describe('Radiology list container still loading', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      user,
      mr: {
        radiology: {
          dateRange: {
            option: '3',
            fromDate: '2025-08-13',
            toDate: '2025-11-13',
          },
        },
        alerts: {
          alertList: [],
        },
      },
    };
  });

  it('displays a loading indicator', () => {
    const screen = renderWithStoreAndRouter(<Radiology />, {
      initialState,
      reducers: reducer,
      path: '/imaging-results',
    });

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });

  it('displays a loading indicator when feature toggles global loading is true', () => {
    initialState.featureToggles = { loading: true };
    initialState.drupalStaticData = { vamcEhrData: { loading: false } };

    const screen = renderWithStoreAndRouter(<Radiology />, {
      initialState,
      reducers: reducer,
      path: '/imaging-results',
    });

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });

  it('displays a loading indicator when drupal vamcEhrData loading is true', () => {
    initialState.featureToggles = { loading: false };
    initialState.drupalStaticData = { vamcEhrData: { loading: true } };

    const screen = renderWithStoreAndRouter(<Radiology />, {
      initialState,
      reducers: reducer,
      path: '/imaging-results',
    });

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('Radiology list container with no data', () => {
  it('displays a no radiology records message', () => {
    const initialState = {
      user,
      mr: {
        radiology: {
          radiologyList: [],
          dateRange: {
            option: '3',
            fromDate: '2025-08-13',
            toDate: '2025-11-13',
          },
        },
        alerts: {
          alertList: [],
        },
      },
    };

    const screen = renderWithStoreAndRouter(<Radiology />, {
      initialState,
      reducers: reducer,
      path: '/imaging-results',
    });

    // The text is inside a va-alert web component
    const alert = screen.container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.textContent).to.include(
      'any radiology records in your VA medical records',
    );
  });
});

describe('Radiology does not flash NoRecordsMessage before data loads', () => {
  it('does not show NoRecordsMessage when radiologyList is undefined', () => {
    const initialState = {
      user,
      mr: {
        radiology: {
          radiologyList: undefined, // Data not yet fetched
          dateRange: {
            option: '3',
            fromDate: '2025-08-13',
            toDate: '2025-11-13',
          },
        },
        alerts: { alertList: [] },
      },
    };

    const screen = renderWithStoreAndRouter(<Radiology />, {
      initialState,
      reducers: reducer,
      path: '/imaging-results',
    });

    // Should NOT show the no records message when data is undefined
    expect(
      screen.queryByText(
        "You don't have any radiology records in your VA medical records.",
        { exact: false },
      ),
    ).to.not.exist;
  });
});

describe('Radiology list container with errors', () => {
  it('displays an error', async () => {
    const initialState = {
      user,
      mr: {
        radiology: {
          dateRange: {
            option: '3',
            fromDate: '2025-08-13',
            toDate: '2025-11-13',
          },
        },
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

    const screen = renderWithStoreAndRouter(<Radiology />, {
      initialState,
      reducers: reducer,
      path: '/imaging-results',
    });

    await waitFor(() => {
      expect(screen.getByTestId('expired-alert-message')).to.exist;
    });
  });
});

describe('Radiology list container with images ready', () => {
  const radiologyRecords = radiologyTests.map(item =>
    convertMhvRadiologyRecord({ ...item, hash: `hash-${item.id}` }),
  );

  it('displays the images ready alert and download links', async () => {
    const stateWithRadiology = {
      user,
      mr: {
        radiology: {
          radiologyList: radiologyRecords,
          dateRange: {
            option: '3',
            fromDate: '2025-08-13',
            toDate: '2025-11-13',
          },
        },
        images: {
          imageStatus: radiologyRecords.map(r => ({
            studyIdUrn: r.studyId,
            status: studyJobStatus.COMPLETE,
            endDate: Date.now(),
          })),
        },
        alerts: { alertList: [] },
      },
    };

    const { getByTestId, getAllByTestId, getByText } = renderWithStoreAndRouter(
      <Radiology />,
      {
        initialState: stateWithRadiology,
        reducers: reducer,
        path: '/imaging-results',
      },
    );

    await waitFor(() => {
      // the single VaAlert wrapper
      expect(getByTestId('alert-images-ready')).to.exist;
      // the heading inside it
      expect(getByText(/Images ready/i)).to.exist;

      // now grab *all* the download links
      const links = getAllByTestId('radiology-view-all-images');
      // we should get one per record in our list
      expect(links.length).to.equal(
        stateWithRadiology.mr.radiology.radiologyList.length,
      );

      // spot-check the first href
      expect(links[0].getAttribute('href')).to.equal(
        `/imaging-results/${radiologyRecords[0].id}/images`,
      );
    });
  });
});

describe('Radiology list container with holdTimeMessagingUpdate feature flag', () => {
  const radiologyRecords = radiologyTests.map(item =>
    convertMhvRadiologyRecord({ ...item, hash: `hash-${item.id}` }),
  );

  let initialState;

  beforeEach(() => {
    initialState = {
      mr: {
        radiology: {
          radiologyList: radiologyRecords,
          dateRange: {
            option: '3',
            fromDate: '2025-08-13',
            toDate: '2025-11-13',
          },
        },
      },
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicalRecordsHoldTimeMessagingUpdate]: false,
      },
    };
  });

  it('displays the old message when holdTimeMessagingUpdate is false', () => {
    const screen = renderWithStoreAndRouter(<Radiology />, {
      initialState,
      reducers: reducer,
      path: '/imaging-results',
    });

    expect(screen.getByText(/Review reports from your VA imaging tests/i)).to
      .exist;
  });

  it('displays the new HoldTimeInfo when holdTimeMessagingUpdate is true', () => {
    initialState.featureToggles[
      FEATURE_FLAG_NAMES.mhvMedicalRecordsHoldTimeMessagingUpdate
    ] = true;

    const screen = renderWithStoreAndRouter(<Radiology />, {
      initialState,
      reducers: reducer,
      path: '/imaging-results',
    });

    const paragraph = screen.container.querySelector('p');
    expect(paragraph.textContent).to.include(
      'Your test results are available here',
    );
  });

  it('displays va-additional-info when holdTimeMessagingUpdate is true', () => {
    initialState.featureToggles[
      FEATURE_FLAG_NAMES.mhvMedicalRecordsHoldTimeMessagingUpdate
    ] = true;

    const screen = renderWithStoreAndRouter(<Radiology />, {
      initialState,
      reducers: reducer,
      path: '/imaging-results',
    });

    const additionalInfo = screen.container.querySelector('va-additional-info');
    expect(additionalInfo).to.exist;
    expect(additionalInfo.getAttribute('trigger')).to.equal(
      'What to know before reviewing your results',
    );
  });
});
