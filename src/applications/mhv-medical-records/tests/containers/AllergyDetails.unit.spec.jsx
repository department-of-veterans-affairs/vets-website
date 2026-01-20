import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent, waitFor } from '@testing-library/dom';
import AllergyDetails from '../../containers/AllergyDetails';
import reducer from '../../reducers';
import allergy from '../fixtures/allergy.json';
import allergyWithMissingFields from '../fixtures/allergyWithMissingFields.json';
import allergyWithMultipleCategories from '../fixtures/allergyWithMultipleCategories.json';
import user from '../fixtures/user.json';
import {
  convertAllergy,
  convertUnifiedAllergy,
} from '../../reducers/allergies';

describe('Allergy details container', () => {
  const initialState = {
    user,
    mr: {
      allergies: {
        allergyDetails: convertAllergy(allergy),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<AllergyDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/allergies/7006',
    });
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-download-menu');
    expect(printButton).to.exist;
  });

  it('displays the allergy name', () => {
    const allergyName = screen.getByText('NUTS', {
      exact: true,
      selector: 'h1',
    });
    expect(allergyName).to.exist;
  });

  it('displays the date entered', () => {
    expect(screen.getByText('August', { exact: false })).to.exist;
  });

  it('displays the reaction', () => {
    expect(screen.getByText('RASH', { exact: false })).to.exist;
  });

  it('displays the type of allergy', () => {
    expect(screen.getByText('food', { exact: false })).to.exist;
  });

  it('displays the location', () => {
    expect(
      screen.getByText('SLC10.FO-BAYPINES.MED.VA.GOV', {
        exact: true,
        selector: 'p',
      }),
    ).to.exist;
  });

  it('displays provider notes', () => {
    expect(screen.getByText("Maruf's test", { exact: false })).to.exist;
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

describe('Allergy details container with date missing', () => {
  const initialState = {
    user,
    mr: {
      allergies: {
        allergyDetails: convertAllergy(allergyWithMissingFields),
      },
      alerts: {
        alertList: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<AllergyDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/allergies/123',
    });
  });

  it('should not display the formatted date if date is missing', () => {
    waitFor(() => {
      expect(screen.queryByTestId('header-time').innerHTML).to.contain(
        'None recorded',
      );
    });
  });
});

describe('Allergy details container still loading', () => {
  const initialState = {
    user,
    mr: {
      allergies: {},
      alerts: {
        alertList: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<AllergyDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/allergies/123',
    });
  });

  it('displays a loading indicator', () => {
    expect(screen.getByTestId('loading-indicator')).to.exist;
  });
});

describe('Allergy details container with errors', () => {
  const initialState = {
    user,
    mr: {
      allergies: {},
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
    screen = renderWithStoreAndRouter(<AllergyDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/allergies/123',
    });
  });

  it('displays an error', async () => {
    await waitFor(() => {
      expect(
        screen.getByText('We can’t access your allergy records right now', {
          exact: false,
        }),
      ).to.exist;
    });
  });
});

describe('Allergy details container with multiple categories/types', () => {
  const initialState = {
    user,
    mr: {
      allergies: {
        allergyDetails: convertAllergy(allergyWithMultipleCategories),
      },
      alerts: {
        alertList: [],
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<AllergyDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/allergies/123',
    });
  });

  it('should include the array of allergy types as a joined list', async () => {
    await waitFor(() => {
      expect(screen.getByText('Food, medication, drug allergy')).to.exist;
    });
  });
});

describe('AllergyDetails with unified data', () => {
  const unifiedAllergyData = {
    id: '132892323',
    type: 'allergy',
    attributes: {
      id: '132892323',
      name: 'penicillins',
      categories: ['medication'],
      date: '2025-02-25T17:50:49Z',
      reactions: ['Urticaria (Hives)', 'Sneezing'], // Backend sends 'reactions'
      location: 'VA Medical Center',
      // observedHistoric: null, // Not available in Oracle Health FHIR
      notes: [
        'Patient reports adverse reaction to previously prescribed pencicillins',
      ],
      provider: 'Borland, Victoria A',
    },
  };

  const cernerUser = {
    profile: {
      ...user.profile,
      facilities: [{ facilityId: '757' }],
    },
  };

  const initialState = {
    user: cernerUser,
    mr: {
      allergies: {
        allergyDetails: {
          ...convertUnifiedAllergy(unifiedAllergyData),
          isOracleHealthData: true,
        },
      },
    },
    featureToggles: {
      loading: false,
      // eslint-disable-next-line camelcase
      mhv_accelerated_delivery_enabled: true,
      // eslint-disable-next-line camelcase
      mhv_accelerated_delivery_allergies_enabled: true,
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
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<AllergyDetails runningUnitTest />, {
      initialState,
      reducers: reducer,
      path: '/allergies/132892323',
    });
  });

  it('renders unified allergy details without errors', () => {
    expect(screen.getByText('penicillins')).to.exist;
  });

  it('displays unified allergy data correctly', async () => {
    await waitFor(() => {
      expect(screen.getByText('penicillins')).to.exist;
      expect(screen.getByText('Medication')).to.exist;
      expect(screen.getByText('February 25, 2025')).to.exist;
      expect(screen.getByText('Urticaria (Hives)')).to.exist;
      expect(screen.getByText('Sneezing')).to.exist;
      expect(screen.getByText('Borland, Victoria A')).to.exist;
    });
  });

  it('displays Oracle Health data indicator', async () => {
    await waitFor(() => {
      expect(
        screen.getByText(
          'Patient reports adverse reaction to previously prescribed pencicillins',
        ),
      ).to.exist;
    });
  });
});
