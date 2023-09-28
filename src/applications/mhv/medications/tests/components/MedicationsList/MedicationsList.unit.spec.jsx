import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import prescriptions from '../../fixtures/presciptions.json';
import MedicationsList from '../../../components/MedicationsList/MedicationsList';

describe('Medicaitons List component', () => {
  const setup = () => {
    return renderWithStoreAndRouter(
      <MedicationsList rxList={prescriptions} />,
      {
        path: '/',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });
});
