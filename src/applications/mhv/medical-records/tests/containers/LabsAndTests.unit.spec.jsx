import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import { beforeEach } from 'mocha';
import LabsAndTests from '../../containers/LabsAndTests';
import reducer from '../../reducers';
import labsAndTests from '../fixtures/labsAndTests.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';
import user from '../fixtures/user.json';

describe('LabsAndTests list container', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsList: labsAndTests.entry.map(item =>
          convertLabsAndTestsRecord(item),
        ),
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
    expect(screen.getByText('Showing 1 to 10 of 13 records', { exact: false }))
      .to.exist;
  });

  it('displays a list of records', async () => {
    await waitFor(() => {
      expect(screen.getAllByTestId('record-list-item').length).to.eq(10);
    });
  });
});

describe('Labs and tests list container still loading', () => {
  const initialState = {
    user,
    mr: {
      labsAndTests: {},
      alerts: {
        alertList: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<LabsAndTests runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });
  });

  it('displays a loading indicator', () => {
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('Labs and tests list container with no data', () => {
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

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<LabsAndTests runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });
  });

  it('displays a no labs and tests message', () => {
    expect(
      screen.getByText('You don’t have any records in Labs and tests', {
        exact: true,
      }),
    ).to.exist;
  });
});
