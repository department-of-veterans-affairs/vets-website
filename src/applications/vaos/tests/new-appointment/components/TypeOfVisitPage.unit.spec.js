import React from 'react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';

import TypeOfVisitPage from '../../../new-appointment/components/TypeOfVisitPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: false,
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
describe('VAOS Page: TypeOfVisitPage ', () => {
  beforeEach(() => mockFetch());
  it('should show page', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<TypeOfVisitPage />, {
      store,
    });

    expect(await screen.findByText(/Continue/i)).to.exist;

    const radioSelector = screen.container.querySelector('va-radio');
    expect(radioSelector).to.exist;
    expect(radioSelector).to.have.attribute(
      'label',
      'How do you want to attend this appointment?',
    );

    const radioOptions = screen.container.querySelectorAll('va-radio-option');
    expect(radioOptions).to.have.lengthOf(3);
    expect(radioOptions[0]).to.have.attribute('label', 'In person');
    expect(radioOptions[1]).to.have.attribute('label', 'By phone');
    expect(radioOptions[2]).to.have.attribute(
      'label',
      'Through VA Video Connect (telehealth)',
    );
  });

  it('should not submit empty form', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(<TypeOfVisitPage />, {
      store,
    });
    expect(await screen.findByText(/Continue/i)).to.exist;

    fireEvent.click(screen.getByText(/Continue/));

    expect(screen.history.push.called).to.not.be.true;

    // Assertion currently disabled due to
    // https://github.com/department-of-veterans-affairs/va.gov-team/issues/82624
    // expect(await screen.findByRole('alert')).to.contain.text(
    //   'Select an option',
    // );
  });

  it('should save type of visit choice on page change', async () => {
    const store = createTestStore(initialState);
    let screen = renderWithStoreAndRouter(
      <Route component={TypeOfVisitPage} />,
      {
        store,
      },
    );

    // Wait for page to render completely
    expect(await screen.findByText(/Continue/i)).to.exist;

    const radioSelector = screen.container.querySelector('va-radio');
    const changeEvent = new CustomEvent('selected', {
      detail: { value: 'clinic' },
    });
    radioSelector.__events.vaValueChange(changeEvent);
    let [firstRadioOption] = screen.container.querySelectorAll(
      'va-radio-option',
    );
    expect(firstRadioOption).to.have.attribute('checked', 'true');
    await cleanup();

    screen = renderWithStoreAndRouter(<Route component={TypeOfVisitPage} />, {
      store,
    });

    [firstRadioOption] = screen.container.querySelectorAll('va-radio-option');
    expect(firstRadioOption).to.have.attribute('checked', 'true');
  });

  it('should continue to the correct page once type is selected', async () => {
    const store = createTestStore(initialState);
    const screen = renderWithStoreAndRouter(
      <Route component={TypeOfVisitPage} />,
      {
        store,
      },
    );

    // Wait for page to render completely
    expect(await screen.findByText(/Continue/i)).to.exist;

    const radioSelector = screen.container.querySelector('va-radio');
    const changeEvent = new CustomEvent('selected', {
      detail: { value: 'clinic' },
    });
    radioSelector.__events.vaValueChange(changeEvent);
    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() =>
      expect(screen.history.push.lastCall?.args[0]).to.equal(
        '/new-appointment/contact-info',
      ),
    );
  });
});
