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
import { convertAllergy } from '../../reducers/allergies';

describe('Allergy details container', () => {
  const initialState = {
    user,
    mr: {
      allergies: {
        allergyDetails: convertAllergy(allergy),
      },
    },
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medical_records_allow_txt_downloads: true,
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
