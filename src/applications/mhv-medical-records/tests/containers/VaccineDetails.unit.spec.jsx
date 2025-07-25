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
import cernerUser from '../fixtures/user.cerner.json';
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

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-download-menu');
    expect(printButton).to.exist;
  });

  it('displays the vaccine name as an h1', () => {
    const vaccineName = screen.getByText(
      'INFLUENZA, INJECTABLE, QUADRIVALENT',
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

  it('should display a download started message when the download pdf button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });

  it('should display a download started message when the download txt file button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-2'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
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

/// start here
describe('Vaccines details container conditional field rendering', () => {
  let screen;

  describe('when accelerated vaccines is enabled', () => {
    const acceleratedRecord = {
      date: 'January 14, 2021',
      doseDisplay: '1 of 2',
      doseNumber: null,
      id: 'I2-2BCP5BAI6N7NQSAPSVIJ6INQ4A000000',
      location: 'Cheyenne VA Medical Center',
      manufacturer: 'Moderna US, Inc.',
      name: 'COVID-19',
      note:
        'Dose #2 of 2 of COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose vaccine administered.',
      reaction: 'Reactions are noted in the medical record.',
      seriesDoses: undefined,
      shortDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose',
    };

    beforeEach(() => {
      const initialState = {
        user: cernerUser,
        mr: {
          vaccines: { vaccineDetails: acceleratedRecord },
        },
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_accelerated_delivery_enabled: true,
          // eslint-disable-next-line camelcase
          mhv_accelerated_delivery_vaccines_enabled: true,
        },
      };

      screen = renderWithStoreAndRouter(<VaccineDetails runningUnitTest />, {
        initialState,
        reducers: reducer,
        path: '/vaccine-details/957',
      });
    });

    it('shows accelerated vaccine fields when conditions are met', () => {
      // Check if the component renders without errors
      expect(screen).to.exist;
      expect(
        screen.getByText(acceleratedRecord.name, {
          exact: true,
        }),
      ).to.exist;
      expect(
        screen.getByText(acceleratedRecord.location, {
          exact: true,
        }),
      ).to.exist;
      expect(screen.getByText('January 14, 2021', { exact: true })).to.exist;
      expect(screen.getByText(acceleratedRecord.doseDisplay, { exact: true }))
        .to.exist;
      expect(screen.getByText(acceleratedRecord.manufacturer, { exact: true }))
        .to.exist;
      expect(
        screen.getByText(acceleratedRecord.shortDescription, { exact: true }),
      ).to.exist;
      expect(screen.getByText(acceleratedRecord.reaction, { exact: true })).to
        .exist;
      expect(screen.getByText(acceleratedRecord.note, { exact: true })).to
        .exist;
    });
  });
});
