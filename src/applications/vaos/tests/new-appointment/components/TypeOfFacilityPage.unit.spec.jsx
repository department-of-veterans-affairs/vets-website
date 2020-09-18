import React from 'react';
import { expect } from 'chai';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import {
  createTestStore,
  setTypeOfCare,
  renderWithStoreAndRouter,
} from '../../mocks/setup';

import { fireEvent } from '@testing-library/dom';
import TypeOfFacilityPage from '../../../new-appointment/components/TypeOfFacilityPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVSPAppointmentNew: false,
    vaOnlineSchedulingDirect: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS integration: VA facility page with a single-site user', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show form with single required facility question', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);

    const screen = renderWithStoreAndRouter(<TypeOfFacilityPage />, {
      store,
    });

    // Check for page title
    expect(screen.baseElement).to.contain.text(
      'Choose where you want to receive your care',
    );

    // Check for page subtitle
    expect(screen.baseElement).to.contain.text(
      'You’re eligible to see either a VA provider or community care provider for this type of care.(*Required)',
    );

    // Check for option 1 radio
    expect(
      screen.getByRole('radio', {
        name: /va medical center or clinic go to a va medical center or clinic for this appointment/i,
      }),
    ).to.have.attribute('value', 'vamc');

    // Check for option 2 radio
    expect(
      screen.getByRole('radio', {
        name: /community care facility go to a community care facility near your home/i,
      }),
    ).to.have.attribute('value', 'communityCare');

    // Click on the continue button without an option selected
    fireEvent.click(screen.getByRole('button', { name: /continue »/i }));

    // Check for alert to be shown
    await expect(screen.getByRole('alert')).to.contain.text(
      'Please provide a response',
    );

    // Click on option 2 radio
    fireEvent.click(
      screen.getByRole('radio', {
        name: /community care facility go to a community care facility near your home/i,
      }),
    );

    // Click on the continue button with an option selected
    fireEvent.click(screen.getByRole('button', { name: /continue »/i }));

    // Check for next page to be navigated to
    await expect(screen.baseElement).to.contain.text(
      'Choose a day and time for your appointment',
    );

    // const radio = getByLabelText('First')
    // fireEvent.change(radio, { target: { value: "second" } });
    // expect(radio.value).toBe('second')
    // fireEvent.click(screen.getByRole('radio', { name: /community care facility go to a community care facility near your home/i }));
  });
});
