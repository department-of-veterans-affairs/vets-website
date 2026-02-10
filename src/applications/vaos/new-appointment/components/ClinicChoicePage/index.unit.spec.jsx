import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setVAFacility,
} from '../../../tests/mocks/setup';

import ClinicChoicePage from '.';
import MockClinicResponse from '../../../tests/fixtures/MockClinicResponse';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';
import { mockEligibilityFetches } from '../../../tests/mocks/mockApis';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS Page: ClinicChoicePage', () => {
  beforeEach(() => mockFetch());

  it('should display multiple clinics and require one to be chosen', async () => {
    // Arrange
    const clinics = MockClinicResponse.createResponses({
      clinics: [
        {
          id: '308',
          name: 'Green team clinic',
          locationId: '983',
        },
        {
          id: '309',
          name: 'Red team clinic',
          locationId: '983',
        },
      ],
    });

    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: 'primaryCare',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(
      store,
      '983',
      'primaryCare',
      new MockFacilityResponse(),
    );

    // Act
    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    // Should show title
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /Which VA clinic would you like to go to\?/,
      }),
    ).to.exist;

    // And the user should see radio buttons for each clinic
    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).to.have.lengthOf(3);
    await screen.findByLabelText(/Green team clinic/i);
    await screen.findByLabelText(/Red team clinic/i);
    await screen.findByLabelText(/I need a different clinic/i);

    // When the user continues
    userEvent.click(screen.getByText(/continue/i));

    // The user should stay on the page
    expect(await screen.findByRole('alert')).to.contain.text(
      'You must provide a response',
    );
    expect(screen.history.push.called).to.be.false;

    await cleanup();
  });

  it('should go to direct schedule flow when choosing a clinic, request flow when not', async () => {
    // Arrange
    const clinics = MockClinicResponse.createResponses({
      clinics: [
        {
          id: '308',
          name: 'Green team clinic',
          locationId: '983',
        },
        {
          id: '309',
          name: 'Red team clinic',
          locationId: '983',
        },
      ],
    });

    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: 'amputation',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /amputation care/i);
    await setVAFacility(store, '983', 'amputation', new MockFacilityResponse());

    // Act
    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    // And the user selected a clinic
    userEvent.click(screen.getByLabelText(/red team/i));
    userEvent.click(screen.getByText(/continue/i));

    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal('preferred-date'),
    );

    // choosing the third option sends you to request flow
    userEvent.click(screen.getByText(/need a different clinic/i));
    userEvent.click(screen.getByText(/continue/i));

    await waitFor(() =>
      expect(screen.history.push.secondCall.args[0]).to.equal('va-request/'),
    );

    await cleanup();
  });

  it('should show a yes/no choice when a single clinic is available and past history is available', async () => {
    // Arrange
    const clinics = MockClinicResponse.createResponses({
      clinics: [
        {
          id: '308',
          name: 'Green team clinic',
          locationId: '983',
        },
      ],
    });

    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: 'amputation',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /amputation care/i);
    await setVAFacility(store, '983', 'amputation', new MockFacilityResponse());

    // Act
    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    // Should show label
    expect(screen.baseElement).to.contain.text(
      'Your last amputation care appointment was at Green team clinic',
    );

    // Should display yes or no options
    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).to.have.lengthOf(2);
    await screen.findByLabelText(
      /Yes, make my appointment at Green team clinic/i,
    );
    await screen.findByLabelText(/No, I need a different clinic/i);

    // Yes should go to direct flow
    userEvent.click(
      screen.getByText(/Yes, make my appointment at Green team clinic/i),
    );
    userEvent.click(screen.getByText(/continue/i));
    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal('preferred-date'),
    );

    // No sends you to the request flow
    userEvent.click(screen.getByText(/No, I need a different clinic/i));
    userEvent.click(screen.getByText(/continue/i));
    await waitFor(() =>
      expect(screen.history.push.secondCall.args[0]).to.equal('va-request/'),
    );

    await cleanup();
  });

  it('should show a yes/no choice when a single clinic is available and past history is not required', async () => {
    // Arrange
    const clinics = MockClinicResponse.createResponses({
      clinics: [
        {
          id: '308',
          name: 'Green team clinic',
          locationId: '983',
        },
      ],
    });

    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: 'primaryCare',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(
      store,
      '983',
      'primaryCare',
      new MockFacilityResponse(),
    );

    // Act
    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    // Should show label
    expect(screen.baseElement).to.contain.text(
      'Primary care appointments are available at Green team clinic',
    );

    // Should display yes or no options
    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).to.have.lengthOf(2);
    await screen.findByLabelText(
      /Yes, make my appointment at Green team clinic/i,
    );
    await screen.findByLabelText(/No, I need a different clinic/i);

    // Yes should go to direct flow
    userEvent.click(
      screen.getByText(/Yes, make my appointment at Green team clinic/i),
    );
    userEvent.click(screen.getByText(/continue/i));
    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal('preferred-date'),
    );

    // No sends you to the request flow
    userEvent.click(screen.getByText(/No, I need a different clinic/i));
    userEvent.click(screen.getByText(/continue/i));
    await waitFor(() =>
      expect(screen.history.push.secondCall.args[0]).to.equal('va-request/'),
    );

    await cleanup();
  });

  it('should retain form data after page changes', async () => {
    // Arrange
    const clinics = MockClinicResponse.createResponses({
      clinics: [
        {
          id: '308',
          name: 'Green team clinic',
          locationId: '983',
        },
        {
          id: '309',
          name: 'Red team clinic',
          locationId: '983',
        },
      ],
    });

    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: 'primaryCare',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');

    // Act
    let screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    // And the user selected a clinic
    userEvent.click(screen.getByLabelText(/Green team clinic/i));
    userEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await cleanup();

    screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    expect(
      await screen.findByLabelText(/Green team clinic/i),
    ).to.have.attribute('checked');

    await cleanup();
  });

  it('should show the correct clinic name when filtered to matching', async () => {
    // Given two available clinics
    const clinics = MockClinicResponse.createResponses({
      clinics: [
        {
          id: '333',
          name: 'Filtered out clinic',
          locationId: '983',
        },
        {
          id: '308',
          name: 'Green team clinic',
          locationId: '983',
        },
      ],
    });

    // And the second clinic matches a past appointment
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: 'amputation',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      matchingClinics: clinics.slice(1),
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /amputation care/i);
    await setVAFacility(store, '983', 'amputation', new MockFacilityResponse());

    // When the page is displayed
    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });
    await screen.findByText(/last amputation care appointment/i);

    // Then the page says the last appointment was at the matching clinic
    expect(screen.baseElement).to.contain.text(
      'Your last amputation care appointment was at Green team clinic',
    );

    // And the user is asked if they want an appt at matching clinic

    expect(screen.baseElement).to.contain.text(
      'Do you you want to schedule your appointment at this clinic?',
    );
  });
});
