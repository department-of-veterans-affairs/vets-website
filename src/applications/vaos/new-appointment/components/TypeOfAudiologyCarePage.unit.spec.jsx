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

import TypeOfAudiologyCarePage from './TypeOfAudiologyCarePage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCommunityCare: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS Page: TypeOfAudiologyCarePage', () => {
  beforeEach(() => mockFetch());
  it('should show page and validation', async () => {
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /audiology/i);

    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfAudiologyCarePage} />,
      {
        store,
      },
    );
    await screen.findByText(/Continue/i);

    // Then the primary header should have focus
    const radioSelector = screen.container.querySelector('va-radio');
    expect(radioSelector).to.exist;
    expect(radioSelector).to.have.attribute(
      'label',
      'Which type of audiology care do you need?',
    );

    // And the user should see radio buttons for each clinic
    const radioOptions = screen.container.querySelectorAll('va-radio-option');
    expect(radioOptions).to.have.lengthOf(2);
    expect(radioOptions[0]).to.have.attribute('label', 'Routine hearing exam');
    expect(radioOptions[1]).to.have.attribute('label', 'Hearing aid support');

    fireEvent.click(screen.getByText(/Continue/));
    // Then there should be a validation error
    // Assertion currently disabled due to
    // https://github.com/department-of-veterans-affairs/va.gov-team/issues/82624
    // expect(await screen.findByText('You must provide a response')).to.exist;
    expect(screen.history.push.called).to.not.be.true;

    const changeEvent = new CustomEvent('selected', {
      detail: { value: 'CCAUDRTNE' }, // Routine hearing exam
    });
    radioSelector.__events.vaValueChange(changeEvent);
    await waitFor(() => {
      expect(radioSelector).to.have.attribute('value', 'CCAUDRTNE');
    });

    fireEvent.click(screen.getByText(/Continue/));
    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/request-date',
      ),
    );
  });

  it('should save audiology care choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfAudiologyCarePage} />,
      { store },
    );
    await screen.findByText(/Continue/i);

    const radioSelector = screen.container.querySelector('va-radio');
    const changeEvent = new CustomEvent('selected', {
      detail: { value: 'CCAUDHEAR' }, // Hearing aid support
    });
    radioSelector.__events.vaValueChange(changeEvent);
    await waitFor(() => {
      expect(radioSelector).to.have.attribute('value', 'CCAUDHEAR');
    });

    await cleanup();

    screen = renderWithStoreAndRouter(
      <Route component={TypeOfAudiologyCarePage} />,
      {
        store,
      },
    );

    await waitFor(() => {
      expect(radioSelector).to.have.attribute('value', 'CCAUDHEAR');
    });
  });
});
