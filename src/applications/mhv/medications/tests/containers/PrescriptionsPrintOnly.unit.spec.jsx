import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../reducers';
import PrescriptionsPrintOnly from '../../containers/PrescriptionsPrintOnly';
import { allergiesList } from '../fixtures/allergiesList.json';
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

  it('renders without errors', async () => {
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
});
