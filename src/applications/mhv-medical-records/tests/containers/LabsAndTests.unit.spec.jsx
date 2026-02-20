import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import { beforeEach } from 'mocha';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
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

describe('Labs and tests accelerated path with imaging studies gating', () => {
  const buildAcceleratedState = (overrides = {}) => ({
    user: {
      ...user,
      profile: {
        ...user.profile,
        facilities: [{ facilityId: '983', isCerner: true }],
      },
    },
    mr: {
      labsAndTests: {
        labsAndTestsList: [],
        listState: 'FETCHED',
        dateRange: {
          option: '3',
          fromDate: '2025-08-13',
          toDate: '2025-11-13',
        },
      },
      alerts: { alertList: [] },
    },
    drupalStaticData: {
      vamcEhrData: {
        loading: false,
        data: {
          cernerFacilities: [{ vhaId: '983' }],
        },
      },
    },
    featureToggles: {
      loading: false,
      [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
      [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryLabsAndTestsEnabled]: true,
      ...overrides,
    },
  });

  it('displays DateRangeSelector when accelerating', () => {
    const initialState = buildAcceleratedState();

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    expect(screen.getByTestId('date-range-selector')).to.exist;
  });

  it('displays the no records message when accelerating with empty list', () => {
    const initialState = buildAcceleratedState();

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    expect(
      screen.getByText('There are no lab and test results', { exact: false }),
    ).to.exist;
  });

  it('does not display NewRecordsIndicator when accelerating', () => {
    const initialState = buildAcceleratedState();

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });

    // NewRecordsIndicator should not render in the accelerated path
    expect(screen.queryByTestId('new-records-indicator')).to.not.exist;
  });

  it('dispatches getAcceleratedImagingStudiesList when both flags are true', async () => {
    mockApiRequest({ entry: [] });
    const dispatchedActions = [];
    const recordingMiddleware = () => next => action => {
      dispatchedActions.push(action);
      return next(action);
    };

    const initialState = buildAcceleratedState({
      [FEATURE_FLAG_NAMES.mhvMedicalRecordsFetchScdfImagingStudies]: true,
    });

    renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
      additionalMiddlewares: [recordingMiddleware],
    });

    await waitFor(() => {
      const hasImagingStudiesAction = dispatchedActions.some(
        a => a.type === 'MR_LABS_AND_TESTS_GET_IMAGING_STUDIES',
      );
      expect(hasImagingStudiesAction).to.be.true;
    });
  });

  it('does not dispatch SCDF images action when studies flag is false', async () => {
    const dispatchedActions = [];
    const recordingMiddleware = () => next => action => {
      dispatchedActions.push(action);
      return next(action);
    };

    const initialState = buildAcceleratedState({
      [FEATURE_FLAG_NAMES.mhvMedicalRecordsFetchScdfImagingStudies]: false,
    });

    renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
      additionalMiddlewares: [recordingMiddleware],
    });

    // Wait a tick to allow any effects to fire
    await new Promise(resolve => setTimeout(resolve, 100));

    const hasImagingStudiesAction = dispatchedActions.some(
      a => a.type === 'MR_LABS_AND_TESTS_GET_IMAGING_STUDIES',
    );
    expect(hasImagingStudiesAction).to.be.false;
  });

  it('does not dispatch SCDF images action when labs flag is false', async () => {
    const dispatchedActions = [];
    const recordingMiddleware = () => next => action => {
      dispatchedActions.push(action);
      return next(action);
    };

    // Disable labs acceleration but enable imaging studies
    const initialState = buildAcceleratedState({
      [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryLabsAndTestsEnabled]: false,
      [FEATURE_FLAG_NAMES.mhvMedicalRecordsFetchScdfImagingStudies]: true,
    });

    renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
      additionalMiddlewares: [recordingMiddleware],
    });

    // Wait a tick to allow any effects to fire
    await new Promise(resolve => setTimeout(resolve, 100));

    const hasImagingStudiesAction = dispatchedActions.some(
      a => a.type === 'MR_LABS_AND_TESTS_GET_IMAGING_STUDIES',
    );
    expect(hasImagingStudiesAction).to.be.false;
  });
});
