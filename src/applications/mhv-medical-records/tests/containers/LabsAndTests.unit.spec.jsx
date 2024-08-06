import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import { beforeEach } from 'mocha';
import LabsAndTests from '../../containers/LabsAndTests';
import reducer from '../../reducers';
import labsAndTests from '../fixtures/labsAndTests.json';
import {
  convertLabsAndTestsRecord,
  extractSpecimen,
} from '../../reducers/labsAndTests';
import radiologyTests from '../fixtures/radiologyRecordsMhv.json';
import user from '../fixtures/user.json';

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

describe('extractSpecimen function', () => {
  const testRecord = {
    specimen: [
      {
        reference: '#ex-MHV-specimen-3',
      },
    ],
  };
  const testRecord2 = {
    contained: [{ id: 'a1', resourceType: 'Practitioner', type: 'TypeA' }],
  };
  it('should return an object if correct parameter is passed', () => {
    const record = extractSpecimen(testRecord);
    expect(record).to.eq('#ex-MHV-specimen-3');
  });

  it('should return "null" if record is passed without a specimen key', () => {
    const record = extractSpecimen(testRecord2);
    expect(record).to.eq(null);
  });
});
