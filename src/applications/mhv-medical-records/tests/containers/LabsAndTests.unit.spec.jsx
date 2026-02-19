import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import { beforeEach } from 'mocha';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import LabsAndTests from '../../containers/LabsAndTests';
import reducer from '../../reducers';
import labsAndTests from '../fixtures/labsAndTests.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';
import radiologyTests from '../fixtures/radiologyRecordsMhv.json';
import user from '../fixtures/user.json';
import { studyJobStatus } from '../../util/constants';

describe('LabsAndTests list container', () => {
  const labsAndTestsFhir = labsAndTests.entry.map(item =>
    convertLabsAndTestsRecord(item),
  );
  const radiologyTestsMhv = radiologyTests.map(item =>
    convertLabsAndTestsRecord(item),
  );
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsList: [...labsAndTestsFhir, ...radiologyTestsMhv],
        // Ensure dateRange exists to avoid access during render
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
    screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });
  });

  it('renders without errors', () => {
    expect(screen.getByText('Lab and test results', { exact: true })).to.exist;
  });

  it('displays a subheading', () => {
    expect(
      screen.getByText('Most lab and test results are available', {
        exact: false,
      }),
    ).to.exist;
  });

  it('displays a count of the records', () => {
    expect(screen.getByText('Showing 1 to 10 of 34 records', { exact: false }))
      .to.exist;
  });

  it('displays a list of records', async () => {
    await waitFor(() => {
      // counting shown records plus all records due to print view
      expect(screen.getAllByTestId('record-list-item').length).to.eq(44);
    });
  });
});

describe('Labs and tests list container still loading', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      user,
      mr: {
        labsAndTests: {
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
    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });

  it('displays a loading indicator when feature toggles global loading is true', () => {
    initialState.featureToggles = { loading: true };
    initialState.drupalStaticData = { vamcEhrData: { loading: false } };

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });

  it('displays a loading indicator when drupal vamcEhrData loading is true', () => {
    initialState.featureToggles = { loading: false };
    initialState.drupalStaticData = { vamcEhrData: { loading: true } };

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('Labs and tests list container with no data', () => {
  it('displays a no labs and tests message', () => {
    const initialState = {
      user,
      mr: {
        labsAndTests: {
          labsAndTestsList: [],
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

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    expect(
      screen.getByText(
        'There are no lab and test results in your VA medical records.',
        {
          exact: false,
        },
      ),
    ).to.exist;
  });
});

describe('LabsAndTests does not flash NoRecordsMessage before data loads', () => {
  it('does not show NoRecordsMessage when labsAndTestsList is undefined', () => {
    const initialState = {
      user,
      mr: {
        labsAndTests: {
          labsAndTestsList: undefined, // Data not yet fetched
          dateRange: {
            option: '3',
            fromDate: '2025-08-13',
            toDate: '2025-11-13',
          },
        },
        alerts: { alertList: [] },
      },
    };

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    // Should NOT show the no records message when data is undefined
    expect(
      screen.queryByText(
        'There are no lab and test results in your VA medical records.',
        { exact: false },
      ),
    ).to.not.exist;
  });
});

describe('Labs and tests list container with errors', () => {
  it('displays an error', async () => {
    const initialState = {
      user,
      mr: {
        labsAndTests: {
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

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          'We can’t access your labs and tests records right now',
          {
            exact: false,
          },
        ),
      ).to.exist;
    });
  });
});

describe('Labs and tests list container with radiology images ready', () => {
  const radiologyTestsMhv = radiologyTests.map(item =>
    convertLabsAndTestsRecord(item),
  );

  it('displays the images ready alert and download links', async () => {
    const stateWithRadiology = {
      user,
      mr: {
        labsAndTests: {
          labsAndTestsList: radiologyTestsMhv,
          dateRange: {
            option: '3',
            fromDate: '2025-08-13',
            toDate: '2025-11-13',
          },
        },
        images: {
          imageStatus: radiologyTestsMhv.map(r => ({
            studyIdUrn: r.studyId,
            status: studyJobStatus.COMPLETE,
            endDate: Date.now(),
          })),
        },
        alerts: { alertList: [] },
      },
    };

    const { getByTestId, getAllByTestId, getByText } = renderWithStoreAndRouter(
      <LabsAndTests />,
      {
        initialState: stateWithRadiology,
        reducers: reducer,
        path: '/labs-and-tests',
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
        stateWithRadiology.mr.labsAndTests.labsAndTestsList.length,
      );

      // (optional) spot-check the first href
      expect(links[0].getAttribute('href')).to.equal(
        `/labs-and-tests/${radiologyTestsMhv[0].id}/images`,
      );
    });
  });
});

describe('Labs and tests list container with warnings', () => {
  const labsAndTestsFhir = labsAndTests.entry.map(item =>
    convertLabsAndTestsRecord(item),
  );

  it('displays a warning banner when warnings are present', async () => {
    const stateWithWarnings = {
      user,
      mr: {
        labsAndTests: {
          labsAndTestsList: labsAndTestsFhir,
          warnings: [{ source: 'oracle-health', message: 'Binary not found' }],
          dateRange: {
            option: '3',
            fromDate: '2025-08-13',
            toDate: '2025-11-13',
          },
        },
        alerts: { alertList: [] },
      },
    };

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState: stateWithWarnings,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    await waitFor(() => {
      expect(screen.getByTestId('alert-partial-records-warning')).to.exist;
      expect(screen.getByText(/Some records may be incomplete/i)).to.exist;
    });
  });

  it('does not display a warning banner when warnings are empty', () => {
    const stateNoWarnings = {
      user,
      mr: {
        labsAndTests: {
          labsAndTestsList: labsAndTestsFhir,
          warnings: [],
          dateRange: {
            option: '3',
            fromDate: '2025-08-13',
            toDate: '2025-11-13',
          },
        },
        alerts: { alertList: [] },
      },
    };

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState: stateNoWarnings,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    expect(screen.queryByTestId('alert-partial-records-warning')).to.not.exist;
  });
});

describe('Labs and tests list container with holdTimeMessagingUpdate feature flag', () => {
  const labsAndTestsFhir = labsAndTests.entry.map(item =>
    convertLabsAndTestsRecord(item),
  );
  const radiologyTestsMhv = radiologyTests.map(item =>
    convertLabsAndTestsRecord(item),
  );

  let initialState;

  beforeEach(() => {
    initialState = {
      mr: {
        labsAndTests: {
          labsAndTestsList: [...labsAndTestsFhir, ...radiologyTestsMhv],
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

  it('displays the old hold time message when holdTimeMessagingUpdate is false', () => {
    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    expect(screen.getByText(/Most lab and test results are available/i)).to
      .exist;
    expect(screen.getByText(/36 hours/i)).to.exist;
    expect(screen.getByText(/14 days/i)).to.exist;
  });

  it('displays the new HoldTimeInfo when holdTimeMessagingUpdate is true', () => {
    initialState.featureToggles[
      FEATURE_FLAG_NAMES.mhvMedicalRecordsHoldTimeMessagingUpdate
    ] = true;

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    const paragraph = screen.container.querySelector('p');
    expect(paragraph.textContent).to.include(
      'Your test results are available here',
    );

    // does not display old hold time message
    expect(screen.queryByText(/36 hours/i)).to.not.exist;
    expect(screen.queryByText(/14 days/i)).to.not.exist;
  });

  it('displays va-additional-info when holdTimeMessagingUpdate is true', () => {
    initialState.featureToggles[
      FEATURE_FLAG_NAMES.mhvMedicalRecordsHoldTimeMessagingUpdate
    ] = true;

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    const additionalInfo = screen.container.querySelector('va-additional-info');
    expect(additionalInfo).to.exist;
    expect(additionalInfo.getAttribute('trigger')).to.equal(
      'What to know before reviewing your results',
    );
  });
});
