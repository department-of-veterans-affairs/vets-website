import React from 'react';
import { Route } from 'react-router-dom';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';

import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';

import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
} from '../../tests/mocks/setup';

import TypeOfMentalHealthPage from './TypeOfMentalHealthPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCommunityCare: true,
    vaOnlineSchedulingAddSubstanceUseDisorder: true,
    vaOnlineSchedulingAddPrimaryCareMentalHealthInitiative: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS Page: TypeOfMentalHealthPage', () => {
  beforeEach(() => mockFetch());
  it('should show all three options and validation', async () => {
    const store = createTestStore(initialState);
    const nextPage = await setTypeOfCare(store, /mental health/i);
    expect(nextPage).to.equal('mental-health');

    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfMentalHealthPage} />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // Should show title
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Which type of mental health care do you need\?/,
      }),
    ).to.exist;

    // And the user should see radio buttons for each type of sleep care
    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).to.have.lengthOf(3);
    await screen.findByLabelText(
      /Mental health care in a primary care setting/i,
    );
    await screen.findByLabelText(/Mental health care with a specialist/i);
    await screen.findByLabelText(/Substance use problem services/i);

    fireEvent.click(screen.getByText(/Continue/));
    // Then there should be a validation error
    expect(await screen.findByText('You must provide a response')).to.exist;
    expect(screen.history.push.called).to.be.false;

    fireEvent.click(screen.getByText(/Mental health care with a specialist/));
    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal('location'),
    );
  });

  it('should show substance use service when vaOnlineSchedulingAddSubstanceUseDisorder=true', async () => {
    const store = createTestStore({
      ...initialState,
      featureToggles: {
        vaOnlineSchedulingCommunityCare: true,
        vaOnlineSchedulingAddSubstanceUseDisorder: true,
        vaOnlineSchedulingAddPrimaryCareMentalHealthInitiative: false,
      },
    });
    const nextPage = await setTypeOfCare(store, /mental health/i);
    expect(nextPage).to.equal('mental-health');

    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfMentalHealthPage} />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // Should show title
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Which type of mental health care do you need\?/,
      }),
    ).to.exist;

    // And the user should see radio buttons for each type of sleep care
    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).to.have.lengthOf(2);
    await screen.findByLabelText(/Mental health care with a specialist/i);
    await screen.findByLabelText(/Substance use problem services/i);
  });

  it('should show PCMHI when vaOnlineSchedulingAddPrimaryCareMentalHealthInitiative=true', async () => {
    const store = createTestStore({
      ...initialState,
      featureToggles: {
        vaOnlineSchedulingCommunityCare: true,
        vaOnlineSchedulingAddSubstanceUseDisorder: false,
        vaOnlineSchedulingAddPrimaryCareMentalHealthInitiative: true,
      },
    });
    const nextPage = await setTypeOfCare(store, /mental health/i);
    expect(nextPage).to.equal('mental-health');

    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfMentalHealthPage} />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // Should show title
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Which type of mental health care do you need\?/,
      }),
    ).to.exist;

    // And the user should see radio buttons for each type of sleep care
    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).to.have.lengthOf(2);
    await screen.findByLabelText(
      /Mental health care in a primary care setting/i,
    );
    await screen.findByLabelText(/Mental health care with a specialist/i);
  });

  it('should save mental health care with a specialist choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfMentalHealthPage} />,
      { store },
    );
    await screen.findByText(/Continue/i);

    fireEvent.click(screen.getByText(/Mental health care with a specialist/));
    await cleanup();

    screen = renderWithStoreAndRouter(
      <Route component={TypeOfMentalHealthPage} />,
      {
        store,
      },
    );

    expect(
      await screen.findByLabelText(/Mental health care with a specialist/i),
    ).to.have.attribute('checked');
  });
});
