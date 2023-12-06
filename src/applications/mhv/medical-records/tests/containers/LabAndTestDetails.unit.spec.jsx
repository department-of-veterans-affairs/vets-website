import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import user from '../fixtures/user.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';
import LabAndTestDetails from '../../containers/LabAndTestDetails';
import microbiology from '../fixtures/microbiology.json';
import chemhem from '../fixtures/chemHem.json';
import pathology from '../fixtures/pathology.json';
// import ekg from '../fixtures/ekg.json';
import radiology from '../fixtures/radiology.json';

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

  it('displays date of birth for the print view', () => {
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the test name as an h1', () => {
    const testName = screen.getByText(
      'POTASSIUM:SCNC:PT:SER/PLAS:QN:, SODIUM:SCNC:PT:SER/PLAS:QN:',
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(testName).to.exist;
  });

  it('displays the type of test', () => {
    expect(
      screen.getByText(
        'POTASSIUM:SCNC:PT:SER/PLAS:QN:, SODIUM:SCNC:PT:SER/PLAS:QN:',
        { exact: true, selector: 'p' },
      ),
    ).to.exist;
  });

  it('displays the sample tested, ordered by, ordering location, and collection location', () => {
    expect(
      screen.getAllByText('None noted', {
        exact: true,
        selector: 'p',
      }).length,
    ).to.eq(6);
  });

  it('displays provider notes', () => {
    expect(
      screen.getByText(
        "Lisa's Test 1/20/2021 - Second lab Added Potassium test",
        { exact: false },
      ),
    ).to.exist;
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
      path: '/labs-and-tests/ex-MHV-chReport-1',
    });
  });

  it('displays microbiology label', () => {
    expect(screen.getByText('Microbiology')).to.exist;
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

// describe('LabAndTestDetails ekg', () => {
//   const initialState = {
//     user,
//     mr: {
//       labsAndTests: {
//         labsAndTestsDetails: convertLabsAndTestsRecord(ekg),
//       },
//     },
//   };

//   let screen;
//   beforeEach(() => {
//     screen = renderWithStoreAndRouter(<LabAndTestDetails />, {
//       initialState,
//       reducers: reducer,
//       path: '/labs-and-tests/ex-MHV-chReport-1',
//     });
//   });

//   it('displays ekg label', () => {
//     expect(
//       screen.getByText('Electrocardiogram (EKG)', {
//         exact: true,
//         selector: 'h1',
//       }),
//     ).to.exist;
//   });
// });

describe('LabAndTestDetails radiology', () => {
  it('displays radiology label', () => {
    const initialState = {
      user,
      mr: {
        labsAndTests: {
          labsAndTestsDetails: convertLabsAndTestsRecord(radiology),
        },
      },
    };

    const screen = renderWithStoreAndRouter(<LabAndTestDetails />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests/ex-MHV-chReport-1',
    });

    expect(
      screen.getByText(
        'RADIOLOGIC EXAMINATION, SPINE, LUMBOSACRAL; 2 OR 3 VIEWS',
        {
          exact: true,
          selector: 'h1',
        },
      ),
    ).to.exist;
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
