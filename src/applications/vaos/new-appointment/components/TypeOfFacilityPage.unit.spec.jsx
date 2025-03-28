import React from 'react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { Route } from 'react-router-dom';
import { cleanup } from '@testing-library/react';
import TypeOfFacilityPage from './TypeOfFacilityPage';
import {
  createTestStore,
  renderWithStoreAndRouter,
} from '../../tests/mocks/setup';

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

describe('VAOS Page: TypeOfFacilityPage', () => {
  beforeEach(() => mockFetch());

  it('should show form fields', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<TypeOfFacilityPage />, {
      store,
    });
    await screen.findByText(/Continue/i);

    // Then the primary header should have focus
    const radioSelector = screen.container.querySelector('va-radio');
    expect(radioSelector).to.exist;
    expect(radioSelector).to.have.attribute(
      'label',
      'Where do you prefer to receive care?',
    );

    // And the user should see radio buttons for each clinic
    const radioOptions = screen.container.querySelectorAll('va-radio-option');
    expect(radioOptions).to.have.lengthOf(2);
    expect(radioOptions[0]).to.have.attribute(
      'label',
      'VA medical center or clinic',
    );
    expect(radioOptions[1]).to.have.attribute(
      'label',
      'Community care facility',
    );
  });

  it('should show validation', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<TypeOfFacilityPage />, {
      store,
    });
    await screen.findByText(/Continue/i);

    fireEvent.click(await screen.findByText(/Continue/i));

    // Then there should be a validation error
    // Assertion currently disabled due to
    // https://github.com/department-of-veterans-affairs/va.gov-team/issues/82624
    // expect(await screen.findByRole('alert')).to.contain.text(
    //   'You must provide a response',
    // );
    expect(screen.history.push.called).not.to.be.true;

    await cleanup();
  });

  it('should continue to the correct page based on type choice', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfFacilityPage} />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    const radioSelector = screen.container.querySelector('va-radio');
    let changeEvent = new CustomEvent('selected', {
      detail: { value: 'communityCare' },
    });
    radioSelector.__events.vaValueChange(changeEvent);
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/request-date',
      ),
    );

    changeEvent = new CustomEvent('selected', {
      detail: { value: 'vamc' },
    });
    radioSelector.__events.vaValueChange(changeEvent);
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/request-date',
      ),
    );
  });

  it('should save type of facility choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfFacilityPage} />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    const radioSelector = screen.container.querySelector('va-radio');
    const changeEvent = new CustomEvent('selected', {
      detail: { value: 'communityCare' },
    });
    radioSelector.__events.vaValueChange(changeEvent);
    await cleanup();

    screen = renderWithStoreAndRouter(
      <Route component={TypeOfFacilityPage} />,
      {
        store,
      },
    );

    await waitFor(() => {
      expect(radioSelector).to.have.attribute('value', 'communityCare');
    });
  });
});
