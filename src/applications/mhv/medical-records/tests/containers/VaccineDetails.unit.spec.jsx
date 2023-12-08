import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent, waitFor } from '@testing-library/dom';
import VaccineDetails from '../../containers/VaccineDetails';
import reducer from '../../reducers';
import vaccine from '../fixtures/vaccine.json';
import vaccineWithMissingFields from '../fixtures/vaccineWithMissingFields.json';
import user from '../fixtures/user.json';
import { convertVaccine } from '../../reducers/vaccines';
import { EMPTY_FIELD } from '../../util/constants';

describe('Vaccines details container', () => {
  const initialState = {
    user,
    mr: { vaccines: { vaccineDetails: convertVaccine(vaccine) } },
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medical_records_allow_txt_downloads: true,
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<VaccineDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vaccine-details/957',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('displays Date of birth for the print view', () => {
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the vaccine name as an h1', () => {
    const vaccineName = screen.getByText(
      'Vaccines: INFLUENZA, INJECTABLE, QUADRIVALENT',
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(vaccineName).to.exist;
  });

  it('displays the formatted received date', () => {
    const formattedDate = screen.getByText('August', {
      exact: false,
      selector: 'span',
    });
    expect(formattedDate).to.exist;
  });

  it('displays the location', () => {
    expect(
      screen.getByText('ADTP BURNETT', {
        exact: true,
        selector: 'p',
      }),
    ).to.exist;
  });

  it('should download a pdf', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen).to.exist;
  });

  it('should download a text file', () => {
    fireEvent.click(screen.getByTestId('printButton-2'));
    expect(screen).to.exist;
  });
});

describe('Vaccines details container still loading', () => {
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
    screen = renderWithStoreAndRouter(<VaccineDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vaccines/123',
    });
  });

  it('displays a loading indicator', () => {
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('Vaccine details container with errors', () => {
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
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<VaccineDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/vaccine/123',
    });
  });

  it('should not display the formatted date if the date is missing', () => {
    waitFor(() => {
      expect(screen.queryByTestId('header-time').innerHTML).to.contain(
        EMPTY_FIELD,
      );
    });
  });
});

describe('Vaccine details component with no date', () => {
  it('should not display the formatted date if dateSigned is missing', () => {
    const record = convertVaccine(vaccineWithMissingFields);
    const initialState = {
      mr: {
        vaccines: {
          vaccineDetails: record,
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <VaccineDetails record={record} runningUnitTest />,
      {
        initialState,
        reducers: reducer,
        path: '/vaccines/954',
      },
    );
    waitFor(() => {
      expect(screen.queryByTestId('header-time').innerHTML).to.contain(
        EMPTY_FIELD,
      );
    });
  });
});
