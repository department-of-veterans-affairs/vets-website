import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';

import AgeEligibility from '../../components/AgeEligibility';

const createMockStore = profile => {
  return createStore(() => ({
    user: {
      profile: profile || {},
    },
  }));
};

const renderWithStore = (component, profile) => {
  const store = createMockStore(profile);
  return render(<Provider store={store}>{component}</Provider>);
};

describe('<AgeEligibility />', () => {
  let timerStub;

  beforeEach(() => {
    const fixed = new Date('2024-12-31T00:00:00Z').getTime();
    timerStub = sinon.useFakeTimers({ now: fixed, toFake: ['Date'] });
  });

  afterEach(() => {
    cleanup();
    if (timerStub) timerStub.restore();
  });

  it('should return null when DateOfBirth is missing', () => {
    const profile = {};

    const { container } = renderWithStore(<AgeEligibility />, profile);

    expect(container.firstChild).to.be.null;
  });

  it('should return null when DateOfBirth is invalid', () => {
    const profile = {
      dob: 'invalid-date',
    };

    const { container } = renderWithStore(<AgeEligibility />, profile);

    expect(container.firstChild).to.be.null;
  });

  it('should show error alert when age is less than 18', () => {
    const profile = {
      dob: '2010-06-15',
    };

    const { container, getByText } = renderWithStore(
      <AgeEligibility />,
      profile,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('status', 'error');
    expect(alert).to.have.attribute('role', 'alert');
    expect(getByText(/You do not qualify/i)).to.exist;
    expect(getByText(/You must be 18 or older to submit this application/i)).to
      .exist;
  });

  it('should show warning alert when age is greater than 62', () => {
    const profile = {
      dob: '1960-01-01',
    };

    const { container, getByText } = renderWithStore(
      <AgeEligibility />,
      profile,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert).to.have.attribute('status', 'warning');
    expect(alert).to.have.attribute('role', 'alert');
    expect(alert).to.have.attribute('id', 'age-eligibility-alert');
    expect(getByText(/You may not qualify/i)).to.exist;
    expect(
      getByText(
        /If you're 62 or older, you may not be eligible for this program./i,
      ),
    ).to.exist;
  });

  it('should return null when age is between 18 and 62 (inclusive)', () => {
    const profile = {
      dob: '2000-06-15',
    };

    const { container } = renderWithStore(<AgeEligibility />, profile);

    expect(container.firstChild).to.be.null;
  });
});
