import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { expect } from 'chai';
import React from 'react';
import { Route } from 'react-router-dom';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfFacility,
} from '../../tests/mocks/setup';
import { FLOW_TYPES } from '../../utils/constants';
import ReasonForAppointmentPage from './ReasonForAppointmentPage';

const initialState = {
  featureToggles: {
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

describe('VAOS Page: ReasonForAppointmentPage', () => {
  beforeEach(() => mockFetch());

  describe('VA requests', () => {
    it('should show page for VA medical request', async () => {
      const store = createTestStore(initialState);
      const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
        store,
      });
      await screen.findByText(/Continue/i);

      // Should show title
      expect(
        await screen.findByRole('heading', {
          level: 1,
          name: /What’s the reason for this appointment\?/,
        }),
      ).to.exist;

      // And the user should see radio buttons for each clinic
      const radioOptions = screen.getAllByRole('radio');
      expect(radioOptions).to.have.lengthOf(4);
      await screen.findByLabelText(/This is a routine or follow-up visit./i);
      await screen.findByLabelText(/I have a new medical problem./i);
      await screen.findByLabelText(
        /I have a concern or question about my medication./i,
      );
      await screen.findByLabelText(/My reason isn’t listed here./i);

      expect(
        screen.getByRole('heading', {
          name: /Only schedule appointments for non-urgent needs/i,
        }),
      );
    });

    it('should show validation for VA medical request', async () => {
      const store = createTestStore(initialState);
      const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
        store,
      });
      await screen.findByText(/Continue/i);

      // click continue without selecting from radio button
      fireEvent.click(screen.getByText(/Continue/));

      // Then there should be a validation error
      expect(await screen.findByText('Select a reason for your appointment')).to
        .exist;
      expect(screen.history.push.called).to.be.false;

      fireEvent.click(
        screen.getByText(/This is a routine or follow-up visit./),
      );
      fireEvent.click(screen.getByText(/Continue/));
      expect(screen.queryByText('Select a reason for your appointment')).to.not
        .exist;
    });

    it('should show error msg when not entering additional detail for appointment request', async () => {
      const store = createTestStore({
        ...initialState,
        newAppointment: {
          data: {},
          pages: [],
          flowType: FLOW_TYPES.REQUEST,
        },
      });
      const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
        store,
      });
      await screen.findByText(/Continue/i);

      fireEvent.click(
        screen.getByText(/This is a routine or follow-up visit./),
      );
      fireEvent.click(screen.getByText(/Continue/));

      expect(await screen.findByRole('alert')).to.contain.text(
        'Provide more information about why you are requesting this appointment',
      );
    });

    it('should show error msg when not entering additional detail for direct schedule', async () => {
      const store = createTestStore({
        ...initialState,
        newAppointment: {
          data: {},
          pages: [],
          flowType: FLOW_TYPES.DIRECT,
        },
      });
      const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
        store,
      });
      await screen.findByText(/Continue/i);

      fireEvent.click(
        screen.getByText(/This is a routine or follow-up visit./),
      );
      fireEvent.click(screen.getByText(/Continue/));

      expect(await screen.findByRole('alert')).to.contain.text(
        'Provide more information about why you are scheduling this appointment',
      );
    });

    it.skip('should show error msg when ^ is entered in VA medical request', async () => {
      const store = createTestStore(initialState);
      const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
        store,
      });
      await screen.findByText(/Continue/i);
      fireEvent.click(
        screen.getByText(/This is a routine or follow-up visit./),
      );

      expect(
        await screen.findByTestId('reason-comment-field'),
      ).to.have.attribute(
        'label',
        'Add any details you’d like to share with your provider.',
      );
      const inputText = screen.container.querySelector('va-textarea');
      inputText.value = '^hello^';
      const changeEvent = new CustomEvent('input', {
        bubbles: true,
      });
      inputText.dispatchEvent(changeEvent);

      fireEvent.click(screen.getByText(/Continue/));

      expect(await screen.findByRole('alert')).to.contain.text(
        'following special characters are not allowed: ^ |',
      );
    });

    it.skip('should continue to the correct page based on type choice for VA medical request', async () => {
      const store = createTestStore(initialState);
      const screen = renderWithStoreAndRouter(
        <Route component={ReasonForAppointmentPage} />,
        {
          store,
        },
      );
      await screen.findByText(/Continue/i);

      fireEvent.click(
        screen.getByText(/This is a routine or follow-up visit./),
      );
      const inputText = screen.container.querySelector('va-textarea');
      inputText.value = 'This is a test';
      const changeEvent = new CustomEvent('input', {
        bubbles: true,
      });
      inputText.dispatchEvent(changeEvent);
      fireEvent.click(screen.getByText(/Continue/));

      await waitFor(() =>
        expect(screen.history.push.lastCall?.args[0]).to.equal(
          'preferred-method',
        ),
      );
    });
  });

  describe('Community care requests', () => {
    it('should show page for Community Care medical request', async () => {
      const store = createTestStore(initialState);
      await setTypeOfFacility(store, 'Community care facility');

      const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
        store,
      });
      expect(
        await screen.findByTestId('reason-comment-field'),
      ).to.have.attribute(
        'label',
        'Share any information that you think will help the provider prepare for your appointment. You don’t have to share anything if you don’t want to.',
      );
      expect(
        screen.getByRole('heading', {
          level: 1,
          name: /What’s the reason for this appointment?/i,
        }),
      );

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Only schedule appointments for non-urgent needs/i,
        }),
      );
    });

    it.skip('should show error msg when enter all spaces for Community Care medical request', async () => {
      const store = createTestStore(initialState);
      await setTypeOfFacility(store, 'Community care facility');

      const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
        store,
      });

      expect(
        await screen.findByTestId('reason-comment-field'),
      ).to.have.attribute(
        'label',
        'Share any information that you think will help the provider prepare for your appointment. You don’t have to share anything if you don’t want to.',
      );
      const inputText = screen.container.querySelector('va-textarea');
      inputText.value = '    ';
      const changeEvent = new CustomEvent('input', {
        bubbles: true,
      });
      inputText.dispatchEvent(changeEvent);

      fireEvent.click(screen.getByText(/Continue/));

      expect(await screen.findByRole('alert')).to.contain.text(
        'You must provide a response',
      );
    });

    it('should continue to the correct page for Community Care medical request', async () => {
      const store = createTestStore(initialState);
      await setTypeOfFacility(store, 'Community care facility');
      const screen = renderWithStoreAndRouter(
        <Route component={ReasonForAppointmentPage} />,
        {
          store,
        },
      );

      expect(
        await screen.findByTestId('reason-comment-field'),
      ).to.have.attribute(
        'label',
        'Share any information that you think will help the provider prepare for your appointment. You don’t have to share anything if you don’t want to.',
      );

      expect(
        await screen.getByRole('heading', {
          level: 1,
          name: /What’s the reason for this appointment?/i,
        }),
      );

      fireEvent.click(screen.getByText(/Continue/));

      await waitFor(() =>
        expect(screen.history.push.lastCall?.args[0]).to.equal(
          'contact-information',
        ),
      );
    });
  });
});
