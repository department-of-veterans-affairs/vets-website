import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import { beforeEach } from 'mocha';
import LabsAndTests from '../../containers/LabsAndTests';
import reducer from '../../reducers';
import labsAndTests from '../fixtures/labsAndTests.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';
import radiologyTests from '../fixtures/radiologyRecordsMhv.json';
import user from '../fixtures/user.json';
import { loadStates, studyJobStatus } from '../../util/constants';
import { Actions } from '../../util/actionTypes';

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
  it('displays a loading indicator', () => {
    const initialState = {
      user,
      mr: {
        labsAndTests: {},
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

describe('Labs and tests list container with errors', () => {
  it('displays an error', async () => {
    const initialState = {
      user,
      mr: {
        labsAndTests: {},
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

describe('Labs and Tests unmount cleanup', () => {
  const baseInitialState = {
    drupalStaticData: { vamcEhrData: { loading: false } },
    user: {},
    mr: {
      labsAndTests: {
        labsAndTestsList: [],
        listState: loadStates.FETCHING,
        listCurrentAsOf: new Date(),
      },
      alerts: { alertList: [] },
      refresh: { status: null, initialFhirLoad: false },
    },
  };

  it('resets listState to PRE_FETCH when unmounting while FETCHING', () => {
    let updatedToPreFetch = false;
    const tappedReducers = {
      ...reducer,
      mr: (state, action) => {
        if (
          action?.type === Actions.LabsAndTests.UPDATE_LIST_STATE &&
          action?.payload === loadStates.PRE_FETCH
        ) {
          updatedToPreFetch = true;
        }
        return reducer.mr(state, action);
      },
    };

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState: baseInitialState,
      reducers: tappedReducers,
      path: '/labs-and-tests',
    });

    // Simulate navigating away
    screen.unmount();

    expect(updatedToPreFetch).to.be.true;
  });

  it('does not reset listState when not FETCHING at unmount', () => {
    let updatedToPreFetch = false;
    const tappedReducers = {
      ...reducer,
      mr: (state, action) => {
        if (
          action?.type === Actions.LabsAndTests.UPDATE_LIST_STATE &&
          action?.payload === loadStates.PRE_FETCH
        ) {
          updatedToPreFetch = true;
        }
        return reducer.mr(state, action);
      },
    };

    const initialState = {
      ...baseInitialState,
      mr: {
        ...baseInitialState.mr,
        labsAndTests: {
          ...baseInitialState.mr.labsAndTests,
          listState: loadStates.FETCHED,
        },
      },
    };

    const screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: tappedReducers,
      path: '/labs-and-tests',
    });

    screen.unmount();

    expect(updatedToPreFetch).to.be.false;
  });
});
