import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';
import PersonalInformation from '../../components/PersonalInformation';

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

describe('<PersonalInformation />', () => {
  let querySelectorStub;

  beforeEach(() => {
    querySelectorStub = sinon.stub(document, 'querySelector');
    querySelectorStub.returns(null);
  });

  afterEach(() => {
    cleanup();
    if (querySelectorStub) querySelectorStub.restore();
  });

  it('should render personal information when all fields are present', () => {
    const profile = {
      dob: '1990-05-15',
      userFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
        suffix: 'Jr.',
      },
      ssn: '123456789',
    };

    const { container, getByText } = renderWithStore(
      <PersonalInformation formData={{}} />,
      profile,
    );

    expect(getByText(/Confirm the personal information/i)).to.exist;
    expect(getByText(/John A Doe, Jr./i)).to.exist;
    expect(getByText(/Last 4 digits of Social Security number/i)).to.exist;
    expect(getByText(/May 15, 1990/i)).to.exist;
    expect(container.querySelector('va-card')).to.exist;
  });

  it('should show error alert when name is missing', () => {
    const profile = {
      dob: '1990-05-15',
      userFullName: {},
      ssn: '123456789',
    };

    const { container, getByText } = renderWithStore(
      <PersonalInformation formData={{}} />,
      profile,
    );

    expect(getByText(/We need more information/i)).to.exist;
    expect(getByText(/missing your name/i)).to.exist;
    expect(container.querySelector('va-alert')).to.exist;
  });

  it('should show error alert when date of birth is missing', () => {
    const profile = {
      userFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
      },
      ssn: '123456789',
    };

    const { getByText } = renderWithStore(
      <PersonalInformation formData={{}} />,
      profile,
    );

    expect(getByText(/We need more information/i)).to.exist;
    expect(getByText(/missing your date of birth/i)).to.exist;
  });

  it('should show error alert when SSN is missing', () => {
    const profile = {
      dob: '1990-05-15',
      userFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
      },
    };

    const { getByText } = renderWithStore(
      <PersonalInformation formData={{}} />,
      profile,
    );

    expect(getByText(/We need more information/i)).to.exist;
    expect(getByText(/missing your Social Security number/i)).to.exist;
  });

  it('should use formData SSN when profile SSN is missing', () => {
    const profile = {
      dob: '1990-05-15',
      userFullName: {
        first: 'John',
        middle: 'A',
        last: 'Doe',
      },
    };

    const { getByText } = renderWithStore(
      <PersonalInformation formData={{ ssn: '987654321' }} />,
      profile,
    );

    expect(getByText(/Confirm the personal information/i)).to.exist;
    expect(getByText(/Last 4 digits of Social Security number/i)).to.exist;
  });
});
