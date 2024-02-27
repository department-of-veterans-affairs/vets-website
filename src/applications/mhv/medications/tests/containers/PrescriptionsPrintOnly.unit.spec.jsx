import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import reducers from '../../reducers';
import PrescriptionsPrintOnly from '../../containers/PrescriptionsPrintOnly';
import { allergiesList } from '../fixtures/allergiesList.json';
import { prescriptionsList } from '../fixtures/prescriptionsList.json';
import { rxListSortingOptions } from '../../util/constants';

describe('Medications List Print Page', () => {
  const setup = (params = {}) => {
    return renderWithStoreAndRouter(<PrescriptionsPrintOnly />, {
      initialState: {
        rx: {
          prescriptions: {
            selectedSortOption: rxListSortingOptions.alphabeticalOrder,
          },
          allergies: {
            allergiesList: { allergiesList },
          },
        },
      },
      reducers,
      path: '/?page=1',
      ...params,
    });
  };

  it('renders without errors', () => {
    mockApiRequest(prescriptionsList);
    const screen = setup();
    expect(screen);
  });

  it('Medications | Veterans Affairs', () => {
    const screen = setup();
    const rxName = screen.findByText('Medications | Veterans Affairs');
    expect(rxName).to.exist;
  });
  it('does not render for paths other than medication list and details', () => {
    const screen = setup({ path: '/foo' });
    expect(screen.queryByTestId('name-date-of-birth')).to.not.exist;
  });
  it('displays "This is a list of prescriptions and other..." message', () => {
    mockApiRequest(prescriptionsList);
    const screen = setup();
    expect(
      screen.findByText(
        'This is a list of prescriptions and other medications in your VA medical records. When you download medication records, we also include a list of allergies and reactions in your VA medical records.',
      ),
    ).to.exist;
  });
});
