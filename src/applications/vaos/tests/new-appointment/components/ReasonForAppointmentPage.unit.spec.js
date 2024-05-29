import React from 'react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { Route } from 'react-router-dom';
import ReasonForAppointmentPage from '../../../new-appointment/components/ReasonForAppointmentPage';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfFacility,
} from '../../mocks/setup';

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

      const radioSelector = screen.container.querySelector('va-radio');
      await waitFor(() => {
        expect(radioSelector).to.exist;
        expect(radioSelector).to.have.attribute(
          'label',
          'What’s the reason for this appointment?',
        );
      });

      const radioOptions = screen.container.querySelectorAll('va-radio-option');
      await waitFor(() => {
        expect(radioOptions).to.have.lengthOf(4);
        expect(radioOptions[0]).to.have.attribute(
          'label',
          'This is a routine or follow-up visit.',
        );
      });

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
      const radioSelector = screen.container.querySelector('va-radio');
      await waitFor(() => {
        expect(radioSelector).to.exist;
        expect(radioSelector).to.have.attribute(
          'label',
          'What’s the reason for this appointment?',
        );
      });

      const radioOptions = screen.container.querySelectorAll('va-radio-option');
      await waitFor(() => {
        expect(radioOptions).to.have.lengthOf(4);
        expect(radioOptions[0]).to.have.attribute(
          'label',
          'This is a routine or follow-up visit.',
        );
      });
      // click continue without selecting from radio button
      fireEvent.click(screen.getByText(/Continue/));
      expect(radioSelector.error).to.exist;

      const changeEvent = new CustomEvent('selected', {
        detail: { value: 'routine-follow-up' },
      });
      // select a radio option routine followup
      radioSelector.__events.vaValueChange(changeEvent);
      fireEvent.click(screen.getByText(/Continue/));
      expect(radioSelector.error).to.not.exist;
    });

    it('should show error msg when not entering additional detail for VA medical request', async () => {
      const store = createTestStore(initialState);
      const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
        store,
      });

      const radioOptions = screen.container.querySelectorAll('va-radio-option');
      await waitFor(() => {
        expect(radioOptions).to.have.lengthOf(4);
        expect(radioOptions[0]).to.have.attribute(
          'label',
          'This is a routine or follow-up visit.',
        );
      });

      fireEvent.click(screen.getByText(/Continue/));

      expect(await screen.findByRole('alert')).to.contain.text(
        'Provide more information about why you are requesting this appointment',
      );
    });

    it('should show error msg when ^ is entered in VA medical request', async () => {
      const store = createTestStore(initialState);
      const screen = renderWithStoreAndRouter(<ReasonForAppointmentPage />, {
        store,
      });
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

    it('should continue to the correct page based on type choice for VA medical request', async () => {
      const store = createTestStore(initialState);
      const screen = renderWithStoreAndRouter(
        <Route component={ReasonForAppointmentPage} />,
        {
          store,
        },
      );

      const radioOptions = screen.container.querySelectorAll('va-radio-option');
      const radioSelector = screen.container.querySelector('va-radio');
      const inputText = screen.container.querySelector('va-textarea');
      inputText.value = 'This is a test';

      await waitFor(() => {
        expect(radioOptions).to.have.lengthOf(4);
        expect(radioOptions[0]).to.have.attribute(
          'label',
          'This is a routine or follow-up visit.',
        );
      });

      // select a radio button
      let changeEvent = new CustomEvent('selected', {
        detail: { value: 'routine-follow-up' },
      });

      radioSelector.__events.vaValueChange(changeEvent);

      await waitFor(() => {
        expect(radioSelector).to.have.attribute('value', 'routine-follow-up');
      });

      changeEvent = new CustomEvent('input', {
        bubbles: true,
      });
      inputText.dispatchEvent(changeEvent);

      fireEvent.click(screen.getByText(/Continue/));

      await waitFor(() =>
        expect(screen.history.push.lastCall?.args[0]).to.equal(
          '/new-appointment/choose-visit-type',
        ),
      );
    });
  });

  describe('Community care requests', () => {
    it('should show page for Community Care medical request', async () => {
      const store = createTestStore(initialState);
      await setTypeOfFacility(store, /Community Care/i);

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
      await setTypeOfFacility(store, /Community Care/i);
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
          '/new-appointment/contact-info',
        ),
      );
    });
  });
});
