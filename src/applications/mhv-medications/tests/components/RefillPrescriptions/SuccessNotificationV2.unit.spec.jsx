import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { SuccessNotificationV2 } from '../../../components/RefillPrescriptions/SuccessNotificationV2';
import { MEDICATION_REFILL_CONFIG_V2 } from '../../../util/constants';
import refillableList from '../../fixtures/refillablePrescriptionsList.json';

describe('SuccessNotificationV2 component', () => {
  const config = MEDICATION_REFILL_CONFIG_V2.SUCCESS;
  const defaultSuccessfulMeds = refillableList.slice(0, 3);
  const mockHandleClick = sinon.spy();

  const setup = (
    handleClick = mockHandleClick,
    successfulMeds = defaultSuccessfulMeds,
  ) => {
    const initialState = {
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsManagementImprovements]: true,
      },
    };

    return renderWithStoreAndRouterV6(
      <SuccessNotificationV2
        handleClick={handleClick}
        successfulMeds={successfulMeds}
      />,
      {
        initialState,
        reducers: {},
        initialEntries: ['/refill'],
      },
    );
  };

  afterEach(() => {
    mockHandleClick.reset();
  });

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('renders the success alert title', () => {
    const screen = setup();
    expect(screen.getByTestId('success-refill-title')).to.exist;
    expect(screen.getByTestId('success-refill-title').textContent).to.include(
      config.title,
    );
  });

  it('renders the medication list', () => {
    const screen = setup();
    expect(screen.getByTestId('successful-medication-list')).to.exist;
  });

  it('displays the list of successful medications', () => {
    const screen = setup();
    defaultSuccessfulMeds.forEach(med => {
      expect(screen.getByText(med.prescriptionName)).to.exist;
    });
  });

  it('renders success description with correct content', () => {
    const screen = setup();
    const descriptionContainer = screen.getByTestId(
      'success-refill-description',
    );
    expect(descriptionContainer).to.exist;
    expect(descriptionContainer.textContent).to.include(config.description);
  });

  it('renders a link to the in-progress medications page', () => {
    const screen = setup();
    const link = screen.getByTestId('back-to-medications-page-link');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.include(
      '/my-health/medications/in-progress',
    );
    expect(link.textContent).to.equal(config.linkText);
  });

  it('calls handleClick when the link is clicked', () => {
    const screen = setup();
    const link = screen.getByTestId('back-to-medications-page-link');
    link.click();
    expect(mockHandleClick.calledOnce).to.be.true;
  });
});
