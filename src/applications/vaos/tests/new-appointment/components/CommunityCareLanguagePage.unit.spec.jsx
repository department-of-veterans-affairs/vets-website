import React from 'react';
import { expect } from 'chai';
import userEvent from '@testing-library/user-event';
import { cleanup } from '@testing-library/react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import CommunityCareLanguagePage from '../../../new-appointment/components/CommunityCareLanguagePage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVSPAppointmentNew: false,
    vaOnlineSchedulingDirect: true,
    vaOnlineSchedulingCommunityCare: true,
  },
  user: {
    profile: {
      facilities: [
        { facilityId: '983', isCerner: false },
        { facilityId: '984', isCerner: false },
      ],
    },
  },
};

describe('VAOS <CommunityCareLanguagePage>', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show page with language choice', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<CommunityCareLanguagePage />, {
      store,
    });

    expect((await screen.findAllByRole('combobox')).length).to.equal(1);

    expect(screen.baseElement).to.contain.text('Select the preferred language');
  });

  it('should show validation for VA medical request', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<CommunityCareLanguagePage />, {
      store,
    });

    await screen.findByLabelText(/select the preferred language/i);
    fireEvent.click(screen.getByText(/Continue/));
    expect(await screen.findByRole('alert')).to.contain.text(
      'Please provide a response',
    );
  });

  it('should continue to the next page', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<CommunityCareLanguagePage />, {
      store,
    });

    await screen.findByLabelText(/select the preferred language/i);
    userEvent.selectOptions(screen.getByRole('combobox'), [
      screen.getByText(/English/i),
    ]);
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/reason-appointment',
      ),
    );
  });

  it('should save language choice', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(<CommunityCareLanguagePage />, {
      store,
    });

    await screen.findByLabelText(/select the preferred language/i);
    userEvent.selectOptions(screen.getByRole('combobox'), [
      screen.getByText(/English/i),
    ]);
    await cleanup();

    screen = renderWithStoreAndRouter(<CommunityCareLanguagePage />, {
      store,
    });

    expect((await screen.findByText(/English/i)).selected).to.be.true;
  });
});
