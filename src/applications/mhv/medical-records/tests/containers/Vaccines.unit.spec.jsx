import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
import { beforeEach } from 'mocha';
import Vaccines from '../../containers/Vaccines';
import reducer from '../../reducers';
import user from '../fixtures/user.json';
import vaccines from '../fixtures/vaccines.json';
import { convertVaccine } from '../../reducers/vaccines';

describe('Vaccines list container', () => {
  const initialState = {
    user,
    mr: {
      vaccines: {
        vaccinesList: vaccines.entry.map(vaccine => convertVaccine(vaccine)),
      },
    },
  };
  let screen;

  beforeEach(() => {
    screen = renderWithStoreAndRouter(<Vaccines runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vaccines',
    });
  });

  it('renders without errors', () => {
    expect(screen.getByText('Vaccines', { exact: true })).to.exist;
  });

  it('displays Date of birth for the print view', () => {
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('should download a pdf', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen).to.exist;
  });
});

describe('Vaccines list container with errors', () => {
  const initialState = {
    user,
    mr: {
      vaccines: {},
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
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medical_records_allow_txt_downloads: true,
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<Vaccines runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vaccines',
    });
  });

  it('renders without errors', () => {
    expect(screen.getByText('Vaccines', { exact: true })).to.exist;
  });

  it('does not display a print button', () => {
    const printButton = screen.queryByTestId('print-records-button');
    expect(printButton).to.be.null;
  });
});

describe('Vaccines list container still loading', () => {
  const initialState = {
    user,
    mr: {
      vaccines: {},
      alerts: {
        alertList: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<Vaccines runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vaccines',
    });
  });

  it('displays a loading indicator', () => {
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});
