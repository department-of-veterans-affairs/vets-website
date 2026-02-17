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
          `Showing 1 to 10 of ${groupedMedicationsList.length} prescriptions, from newest to oldest`,
        ),
      ).to.exist;
    });
  });

  it('displays the prescription number of one of the meds on the list', async () => {
    const screen = setup();
    await waitFor(() => {
      // Get all h3s with the label
      const h3s = screen.getAllByText('Prescription number:', {
        selector: 'h3',
      });
      expect(h3s).to.have.length.above(0);

      // Check the first h3 contains the correct span with the prescription number
      const rxNumber = groupedMedicationsList[0].prescriptionNumber;
      const span = h3s[0].querySelector('span');
      expect(span).to.exist;
      expect(span.textContent.trim()).to.equal(String(rxNumber));
    });
  });

  it('displays "Not available" when prescription number is missing', async () => {
    const medicationsWithMissingNumber = [
      {
        ...groupedMedicationsList[0],
        prescriptionNumber: null,
        prescriptionId: 'test-id-1',
      },
    ];

    const screen = renderWithStoreAndRouterV6(
      <GroupedMedications
        groupedMedicationsList={medicationsWithMissingNumber}
      />,
      {
        initialState: {},
        reducers: {},
        initialEntries: ['/prescriptions/1234567891'],
      },
    );

    await waitFor(() => {
      const h3s = screen.getAllByText('Prescription number:', {
        selector: 'h3',
      });
      expect(h3s).to.have.length(1);

      const span = h3s[0].querySelector('span');
      expect(span).to.exist;
      expect(span.textContent.trim()).to.equal('Not available');
    });
  });
});
