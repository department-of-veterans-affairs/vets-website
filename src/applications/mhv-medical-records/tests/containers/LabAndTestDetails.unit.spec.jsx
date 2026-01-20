import { expect } from 'chai';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/dom';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import reducer from '../../reducers';
import user from '../fixtures/user.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';
import LabAndTestDetails from '../../containers/LabAndTestDetails';
import microbiology from '../fixtures/microbiology.json';
import chemhem from '../fixtures/chemHem.json';
import pathology from '../fixtures/pathology.json';
import radiologyMhv from '../fixtures/radiologyMhv.json';

describe('LabsAndTests details container', () => {
  const initialState = {
    user,
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertLabsAndTestsRecord(chemhem),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<LabAndTestDetails />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests/ex-MHV-chReport-1',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-download-menu');
    expect(printButton).to.exist;
  });

  it('displays the test name as an h1', () => {
    const testName = screen.getByText('POTASSIUM, SODIUM', {
      exact: true,
      selector: 'h1',
    });
    expect(testName).to.exist;
  });

  it('displays the type of test', () => {
    const element = screen.getByTestId('chem-hem-category');
    expect(element).to.exist;
    expect(element.textContent).to.equal('Chemistry and hematology');
  });

  it('displays the site or sample tested', () => {
    expect(screen.getByText('SERUM', { exact: false })).to.exist;
  });

  it('displays who the test was ordered by', () => {
    expect(screen.getByText('JANE A DOE', { exact: false })).to.exist;
  });

  it('displays the location', () => {
    expect(screen.getByText('Lab Site 989', { exact: false })).to.exist;
  });

  it('displays lab comments', () => {
    expect(
      screen.getByText("Jane's Test 1/20/2021 - Second lab", { exact: false }),
    ).to.exist;
    expect(screen.getByText('Added Potassium test', { exact: false })).to.exist;
    expect(screen.getAllByTestId('list-item-multiple')).to.have.length(2);
  });

  it('displays results label', () => {
    expect(screen.getByText('Results', { exact: true, selector: 'h2' })).to
      .exist;
  });

  it('displays a list of results', () => {
    expect(screen.getAllByRole('listitem')).to.exist;
  });
});

describe('LabAndTestDetails microbiology', () => {
  const initialState = {
    user,
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertLabsAndTestsRecord(microbiology),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<LabAndTestDetails />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests/ex-MHV-labReport-3',
    });
  });

  it('displays microbiology h1', () => {
    expect(
      screen.getByText('LR MICROBIOLOGY REPORT', {
        exact: true,
        selector: 'h1',
      }),
    ).to.exist;
  });
});

describe('LabAndTestDetails pathology', () => {
  const initialState = {
    user,
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertLabsAndTestsRecord(pathology),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<LabAndTestDetails />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests/ex-MHV-chReport-1',
    });
  });

  it('displays pathology label', () => {
    expect(
      screen.getByText('LR SURGICAL PATHOLOGY REPORT', {
        exact: true,
        selector: 'h1',
      }),
    ).to.exist;
  });
});

describe('LabAndTestDetails radiology', () => {
  it('displays radiology label', () => {
    const initialState = {
      user,
      mr: {
        labsAndTests: {
          labsAndTestsDetails: convertLabsAndTestsRecord(radiologyMhv),
        },
      },
    };

    const screen = renderWithStoreAndRouter(<LabAndTestDetails />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests/ex-MHV-chReport-1',
    });

    expect(
      screen.getByText('DEXA, PERIPHERAL STUDY', {
        exact: true,
        selector: 'h1',
      }),
    ).to.exist;
  });
});

describe('Accelerated LabAndTestDetails', () => {
  const cernerUser = {
    profile: {
      ...user.profile,
      facilities: [{ facilityId: '757' }],
    },
  };

  const buildInitialState = () => ({
    user: cernerUser,
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertLabsAndTestsRecord(radiologyMhv),
        labsAndTestsList: [],
      },
    },
    featureToggles: {
      loading: false,
      [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryEnabled]: true,
      [FEATURE_FLAG_NAMES.mhvAcceleratedDeliveryLabsAndTestsEnabled]: true,
    },
    drupalStaticData: {
      vamcEhrData: {
        loading: false,
        data: {
          cernerFacilities: [
            {
              vhaId: '757',
              vamcFacilityName: 'Chalmers P. Wylie Veterans Outpatient Clinic',
              vamcSystemName: 'VA Central Ohio health care',
              ehr: 'cerner',
            },
          ],
        },
      },
    },
  });

  const renderDetailsWithPath = path =>
    renderWithStoreAndRouter(
      <Switch>
        <Route path="/labs-and-tests/:labId">
          <LabAndTestDetails />
        </Route>
      </Switch>,
      {
        initialState: buildInitialState(),
        reducers: reducer,
        path,
      },
    );

  it('renders the <RadiologyDetails /> component when labId starts with r', () => {
    const screen = renderDetailsWithPath('/labs-and-tests/r12345');
    expect(screen.getByText('Imaging provider', { exact: true })).to.exist;
  });

  it('does NOT render <RadiologyDetails /> when labId does not start with r', () => {
    const screen = renderDetailsWithPath('/labs-and-tests/12345');
    const imagingProvider = screen.queryByText('Imaging provider', {
      exact: true,
    });
    expect(imagingProvider).to.equal(null);
  });
});

describe('LabAndTestDetails loading', () => {
  it('displays a loading indicator', () => {
    const initialState = {
      user,
      mr: {
        labsAndTests: {},
      },
    };

    const screen = renderWithStoreAndRouter(<LabAndTestDetails />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests/ex-MHV-chReport-1',
    });

    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('Labs and tests details container with errors', () => {
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

    const screen = renderWithStoreAndRouter(<LabAndTestDetails />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests/123',
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
