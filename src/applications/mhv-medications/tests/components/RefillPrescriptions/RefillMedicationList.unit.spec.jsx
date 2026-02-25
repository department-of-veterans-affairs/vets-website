import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import RefillMedicationList from '../../../components/RefillPrescriptions/RefillMedicationList';

describe('RefillMedicationList component', () => {
  const medications = [
    { prescriptionId: 1, prescriptionName: 'Medication 1' },
    { prescriptionId: 2, prescriptionName: 'Medication 2' },
  ];

  const setup = (
    meds = [],
    isMedicationsManagementImprovementsEnabled = false,
    showBold = false,
  ) => {
    const initialState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsManagementImprovements]: isMedicationsManagementImprovementsEnabled,
      },
    };

    return renderWithStoreAndRouterV6(
      <RefillMedicationList
        medications={meds}
        testId="refill-medication-list"
        showBold={showBold}
      />,
      {
        initialState,
        reducers: {},
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('renders nothing when no medications are provided', () => {
    const screen = setup([]);
    expect(screen.queryByTestId('refill-medication-list')).to.not.exist;
  });

  it('renders nothing when medications is null', () => {
    const screen = setup(null);
    expect(screen.queryByTestId('refill-medication-list')).to.not.exist;
  });

  it('renders medication list with correct number of items', () => {
    const screen = setup(medications);
    expect(screen.getByTestId('refill-medication-list')).to.exist;
    expect(screen.getByTestId('refill-medication-list-0')).to.exist;
    expect(screen.getByTestId('refill-medication-list-1')).to.exist;
  });

  it('displays medication names', () => {
    const screen = setup(medications);
    expect(screen.getByText('Medication 1')).to.exist;
    expect(screen.getByText('Medication 2')).to.exist;
  });

  describe('when mhvMedicationsManagementImprovements flag is disabled', () => {
    it('does not wrap medication names in strong tags', () => {
      const screen = setup(medications, false);
      const listItems = screen.getByTestId('refill-medication-list');
      const strongElements = listItems.querySelectorAll('strong');
      expect(strongElements).to.have.lengthOf(0);
    });
  });

  describe('when mhvMedicationsManagementImprovements flag is enabled', () => {
    it('wraps medication names in strong tags', () => {
      const screen = setup(medications, true);
      const listItems = screen.getByTestId('refill-medication-list');
      const strongElements = listItems.querySelectorAll('strong');
      expect(strongElements).to.have.lengthOf(medications.length);
      expect(strongElements[0].textContent).to.equal('Medication 1');
      expect(strongElements[1].textContent).to.equal('Medication 2');
    });
  });

  it('applies bold class when showBold is true', () => {
    const screen = setup(medications, false, true);
    const firstItem = screen.getByTestId('refill-medication-list-0');
    expect(firstItem.className).to.include('vads-u-font-weight--bold');
  });

  it('does not apply bold class when showBold is false', () => {
    const screen = setup(medications, false, false);
    const firstItem = screen.getByTestId('refill-medication-list-0');
    expect(firstItem.className).to.not.include('vads-u-font-weight--bold');
  });
});
