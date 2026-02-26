import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import PartialRefillNotification from '../../../components/RefillPrescriptions/PartialRefillNotification';
import { MEDICATION_REFILL_CONFIG } from '../../../util/constants';
import refillableList from '../../fixtures/refillablePrescriptionsList.json';

describe('PartialRefillNotification component', () => {
  const defaultConfig = MEDICATION_REFILL_CONFIG.PARTIAL;
  const defaultFailedMeds = refillableList.slice(3, 6);

  const mockStore = {
    getState: () => ({
      featureToggles: {},
    }),
    subscribe: () => {},
    dispatch: () => {},
  };

  const setup = () => {
    return render(
      <Provider store={mockStore}>
        <PartialRefillNotification
          config={defaultConfig}
          failedMeds={defaultFailedMeds}
        />
      </Provider>,
    );
  };

  it('renders without errors', () => {
    const { getByTestId } = setup();
    expect(getByTestId('partial-refill')).to.exist;
  });

  it('renders the alert title', () => {
    const { getByTestId } = setup();
    expect(getByTestId('partial-refill-title').textContent).to.equal(
      defaultConfig.title,
    );
  });

  it('displays the correct description', () => {
    const { getByTestId } = setup();
    expect(getByTestId('partial-refill-description').textContent).to.equal(
      defaultConfig.description,
    );
  });

  it('renders the failed medication list', () => {
    const { getByTestId } = setup();
    expect(getByTestId('failed-medication-list')).to.exist;
  });

  it('displays the list of failed medications with bold styling', () => {
    const { getAllByTestId } = setup();
    const items = getAllByTestId(/^failed-medication-list-\d+$/);
    expect(items).to.have.lengthOf(defaultFailedMeds.length);
    items.forEach(item => {
      expect(item.classList.contains('vads-u-font-weight--bold')).to.be.true;
    });
  });

  it('displays the correct suggestion message', () => {
    const { getByTestId } = setup();
    expect(getByTestId('partial-refill-suggestion').textContent).to.equal(
      defaultConfig.suggestion,
    );
  });
});
