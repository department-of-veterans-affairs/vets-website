import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import prescriptionsListItem from '../../fixtures/prescriptionsListItem.json';
import MedicationsListCard from '../../../components/MedicationsList/MedicationsListCard';
import reducers from '../../../reducers';

describe('Medication card component', () => {
  const rx = prescriptionsListItem;
  const setup = () => {
    return renderWithStoreAndRouter(<MedicationsListCard rx={rx} />, {
      path: '/',
      state: {},
      reducers,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });
});
