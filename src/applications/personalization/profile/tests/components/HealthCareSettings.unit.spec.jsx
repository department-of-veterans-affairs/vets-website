import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup } from '@testing-library/react';
import * as featureToggles from 'platform/utilities/feature-toggles';

import HealthCareSettings from '../../components/HealthCareSettings';
import { PROFILE_PATH_NAMES } from '../../constants';
import { renderWithProfileReducersAndRouter as render } from '../unit-test-helpers';

describe('HealthCareSettings', () => {
  const sandbox = sinon.createSandbox();
  let useToggleValueStub;

  const getInitialState = ({
    schedulingPreferencesPilotEligible = false,
  } = {}) => ({
    user: {
      profile: {
        schedulingPreferencesPilotEligible,
      },
    },
  });

  beforeEach(() => {
    useToggleValueStub = sandbox.stub().returns(false);
    sandbox.stub(featureToggles, 'useFeatureToggle').returns({
      useToggleValue: useToggleValueStub,
      TOGGLE_NAMES: {
        profileHideHealthCareContacts: 'profileHideHealthCareContacts',
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
    cleanup();
  });

  it('renders the page header', () => {
    const { getByText } = render(<HealthCareSettings />, {
      initialState: getInitialState(),
    });
    expect(getByText('Health care settings')).to.exist;
  });

  it('renders the Messages signature link', () => {
    const { container } = render(<HealthCareSettings />, {
      initialState: getInitialState(),
    });
    const link = container.querySelector(
      `va-link[text="${PROFILE_PATH_NAMES.MESSAGES_SIGNATURE}"]`,
    );
    expect(link).to.exist;
  });

  it('renders the Health care contacts link when toggle is disabled', () => {
    useToggleValueStub.returns(false);
    const { container } = render(<HealthCareSettings />, {
      initialState: getInitialState(),
    });
    const link = container.querySelector(
      `va-link[text="${PROFILE_PATH_NAMES.HEALTH_CARE_CONTACTS}"]`,
    );
    expect(link).to.exist;
  });

  it('renders the Scheduling preferences link when user is eligible', () => {
    const { container } = render(<HealthCareSettings />, {
      initialState: getInitialState({
        schedulingPreferencesPilotEligible: true,
      }),
    });
    const link = container.querySelector(
      `va-link[text="${PROFILE_PATH_NAMES.SCHEDULING_PREFERENCES}"]`,
    );
    expect(link).to.exist;
  });

  it('does not render the Scheduling preferences link when user is not eligible', () => {
    const { container } = render(<HealthCareSettings />, {
      initialState: getInitialState({
        schedulingPreferencesPilotEligible: false,
      }),
    });
    const link = container.querySelector(
      `va-link[text="${PROFILE_PATH_NAMES.SCHEDULING_PREFERENCES}"]`,
    );
    expect(link).to.not.exist;
  });

  it('renders the My HealtheVet card', () => {
    const { getByText } = render(<HealthCareSettings />, {
      initialState: getInitialState(),
    });
    expect(
      getByText(/Go to My HealtheVet on VA.gov to manage your appointments/),
    ).to.exist;
  });

  it('sets the document title', () => {
    render(<HealthCareSettings />, {
      initialState: getInitialState(),
    });
    expect(document.title).to.include('Health care settings');
  });
});
