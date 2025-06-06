import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import GroupedMedications from '../../../components/PrescriptionDetails/GroupedMedications';
import groupedMedicationsList from '../../fixtures/groupedMedicationsList.json';

describe('Grouped medications component', () => {
  const setup = () => {
    return renderWithStoreAndRouterV6(
      <GroupedMedications groupedMedicationsList={groupedMedicationsList} />,
      {
        initialState: {},
        reducers: {},
        initialEntries: ['/prescriptions/1234567891'],
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.findByText('Previous prescriptions'));
  });

  it('displays "showing ..." information ', async () => {
    const screen = setup();
    await waitFor(() => {
      expect(
        screen.getByText(
          `Showing 1 to 10 of ${
            groupedMedicationsList.length
          } prescriptions, from newest to oldest`,
        ),
      ).to.exist;
    });
  });

  it('displays the prescription number of one of the meds on the list', async () => {
    const screen = setup();
    await waitFor(() => {
      // Look for the label text first
      expect(screen.getByText('Prescription number:')).to.exist;
      // Then check for the prescription number inside a span
      const rxNumber = groupedMedicationsList[0].prescriptionNumber;
      const rxSpan = screen.getByText(rxNumber, { selector: 'span' });
      expect(rxSpan).to.exist;
    });
  });
});
