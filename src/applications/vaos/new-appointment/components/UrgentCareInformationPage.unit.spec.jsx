import React from 'react';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { expect } from 'chai';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';
import UrgentCareInformationPage from './UrgentCareInformationPage';

describe('VAOS Page: UrgentCareInformationPage', () => {
  beforeEach(() => mockFetch());

  it('should show page', async () => {
    // Arrange
    const store = createTestStore();

    // Act
    const screen = renderWithStoreAndRouter(<UrgentCareInformationPage />, {
      store,
    });

    // Assert
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Only schedule appointments for non-urgent needs/i,
      }),
    );
    expect(
      screen.getByText(
        /You can schedule or request non-urgent appointments for future dates./i,
      ),
    );
    expect(
      screen.getByRole('link', { name: /Start scheduling an appointment/i }),
    );
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /If you need help sooner, use one of these urgent communications options:/i,
      }),
    );
    expect(screen.getByRole('link', { name: /urgent care facility/i }));
    expect(
      screen.getByRole('link', {
        name: /Learn how to choose between urgent and emergency care/i,
      }),
    );
  });

  it('should continue to the type of care page', async () => {
    // Arrange
    const store = createTestStore();

    // Act
    const screen = renderWithStoreAndRouter(<UrgentCareInformationPage />, {
      store,
    });

    const link = screen.getByRole('link', {
      name: 'Start scheduling an appointment',
    });
    link.click();

    // Assert
    expect(screen.history.push.lastCall?.args[0]).to.equal(
      '/schedule/type-of-care',
    );
  });
});
