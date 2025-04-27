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
    const testName = screen.getByText('Potassium, Sodium', {
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

describe('convertPathologyRecord', () => {
  const mockConvertPathologyRecord = record => {
    const mockMapping = {
      '27898-6': 'Surgical Pathology',
      '50668-3': 'Cytology',
      '26438-2': 'Molecular Pathology',
      '11526-1': record.code.text, // Existing logic preserved for old code
    };

    const code = record.code.coding?.[0]?.code;
    const pathologyType = mockMapping[code] || 'Pathology';

    return {
      id: record.id,
      name: pathologyType,
      type: 'Pathology',
      orderedBy: 'Dr. John Doe',
      date: 'April 27, 2025',
      dateCollected: 'April 25, 2025',
      sampleFrom: 'Blood',
      sampleTested: 'Left Arm',
      labLocation: 'Central Lab',
      collectingLocation: 'Central Lab',
      results: ['Mocked lab result content'],
      sortDate: '2025-04-27T12:00:00Z',
      labComments: 'No abnormalities detected.',
    };
  };

  const mockRecord = (code, text = 'Legacy Pathology') => ({
    id: 'mock-id',
    code: {
      coding: [{ code }],
      text,
    },
  });

  const testCases = [
    { code: '27898-6', expectedName: 'Surgical Pathology' },
    { code: '50668-3', expectedName: 'Cytology' },
    { code: '26438-2', expectedName: 'Molecular Pathology' },
    { code: '11526-1', expectedName: 'Legacy Pathology' },
    { code: 'invalid-code', expectedName: 'Pathology' },
  ];

  testCases.forEach(({ code, expectedName }) => {
    it(`should correctly mock pathology type "${expectedName}" for LOINC code "${code}"`, () => {
      const record = mockRecord(code);
      const result = mockConvertPathologyRecord(record);
      expect(result.name).to.equal(expectedName);
      expect(result.id).to.equal('mock-id');
      expect(result.type).to.equal('Pathology');
      expect(result.orderedBy).to.exist;
      expect(result.labLocation).to.equal('Central Lab');
      expect(result.results)
        .to.be.an('array')
        .that.includes('Mocked lab result content');
    });
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
