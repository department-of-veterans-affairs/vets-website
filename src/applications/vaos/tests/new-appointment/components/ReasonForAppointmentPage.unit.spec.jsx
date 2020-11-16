import React from 'react';
import { expect } from 'chai';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfFacility,
} from '../../mocks/setup';
import { fireEvent, waitFor } from '@testing-library/dom';
import ReasonForAppointmentPage from '../../../new-appointment/components/ReasonForAppointmentPage';
import { Route } from 'react-router-dom';
import { cleanup } from '@testing-library/react';
import { startDirectScheduleFlow } from '../../../new-appointment/redux/actions';

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

describe('VAOS integration: reason for appointment page with a single-site user', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show page for VA medical request', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
      store,
    });

    expect(screen.baseElement).to.contain.text(
      'Please let us know why you’re making this appointment',
    );

    expect((await screen.findAllByRole('radio')).length).to.equal(4);

    expect(
      screen.getByRole('heading', {
        name: /If you have an urgent medical need, please:/i,
      }),
    );
  });

  it('should show page for Community Care medical request', async () => {
    const store = createTestStore(initialState);
    await setTypeOfFacility(store, /Community Care/i);

    const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
      store,
    });

    expect(screen.baseElement).to.contain.text(
      'Tell us the reason for this appointment',
    );

    const textBox = await screen.findByRole('textbox');
    expect(textBox).to.exist;
    expect(textBox)
      .to.have.attribute('maxlength')
      .to.equal('100');

    expect(
      screen.getByRole('heading', {
        name: /If you have an urgent medical need, please:/i,
      }),
    );
  });

  it('should show validation for VA medical request', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
      store,
    });

    await screen.findByLabelText(/Routine or follow-up visit/i);
    fireEvent.click(screen.getByText(/Continue/));
    expect(await screen.findByRole('alert')).to.contain.text(
      'Please provide a response',
    );
  });

  it('should show error msg when enter all spaces for VA medical request', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
      store,
    });

    fireEvent.click(
      await screen.findByLabelText(/Routine or follow-up visit/i),
    );
    const textBox = screen.getByRole('textbox');
    fireEvent.change(textBox, { target: { value: '   ' } });
    expect(textBox.value).to.equal('   ');
    fireEvent.click(screen.getByText(/Continue/));

    expect(await screen.findByRole('alert')).to.contain.text(
      'Please provide a response',
    );
  });

  it('should show alternate textbox char length if navigated via direct schedule flow', async () => {
    const store = createTestStore(initialState);
    store.dispatch(startDirectScheduleFlow());

    const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
      store,
    });

    fireEvent.click(
      await screen.findByLabelText(/Routine or follow-up visit/i),
    );

    const textBox = screen.getByRole('textbox');
    expect(textBox).to.exist;
    expect(textBox)
      .to.have.attribute('maxlength')
      .to.equal('131');

    expect(
      screen.getByRole('heading', {
        name: /If you have an urgent medical need, please:/i,
      }),
    );
  });

  it('should show error msg when enter all spaces for Community Care medical request', async () => {
    const store = createTestStore(initialState);
    await setTypeOfFacility(store, /Community Care/i);

    const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
      store,
    });

    expect(screen.baseElement).to.contain.text(
      'Tell us the reason for this appointment',
    );

    const textBox = await screen.findByRole('textbox');
    fireEvent.change(textBox, { target: { value: '   ' } });
    expect(textBox.value).to.equal('   ');
    fireEvent.click(screen.getByText(/Continue/));

    expect(await screen.findByRole('alert')).to.contain.text(
      'Please provide a response',
    );
  });

  it('should continue to the correct page based on type choice for VA medical request', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <Route component={ReasonForAppointmentPage} />,
      {
        store,
      },
    );

    fireEvent.click(
      await screen.findByLabelText(/Routine or follow-up visit/i),
    );
    const textBox = screen.getByRole('textbox');
    fireEvent.change(textBox, { target: { value: 'test' } });
    expect(textBox.value).to.equal('test');

    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/choose-visit-type',
      ),
    );
  });

  it('should continue to the correct page for Community Care medical request', async () => {
    const store = createTestStore(initialState);
    await setTypeOfFacility(store, /Community Care/i);
    const screen = renderWithStoreAndRouter(
      <Route component={ReasonForAppointmentPage} />,
      {
        store,
      },
    );

    expect(screen.baseElement).to.contain.text(
      'Tell us the reason for this appointment',
    );

    const textBox = await screen.findByRole('textbox');
    fireEvent.change(textBox, { target: { value: 'test' } });
    expect(textBox.value).to.equal('test');

    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/contact-info',
      ),
    );
  });

  it('should save reason choice on for VA medical request page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={ReasonForAppointmentPage} />,
      {
        store,
      },
    );

    fireEvent.click(
      await screen.findByLabelText(/Routine or follow-up visit/i),
    );
    await cleanup();

    screen = renderWithStoreAndRouter(
      <Route component={ReasonForAppointmentPage} />,
      {
        store,
      },
    );

    expect(
      await screen.findByLabelText(/Routine or follow-up visit/i),
    ).to.have.attribute('checked');
  });
});
