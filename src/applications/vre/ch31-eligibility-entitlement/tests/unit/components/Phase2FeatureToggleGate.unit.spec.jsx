/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import * as FeatureToggleHooks from 'platform/utilities/feature-toggles/useFeatureToggle';
import Phase2FeatureToggleGate from '../../../components/Phase2FeatureToggleGate';

const mockFeatureToggle = toggle => ({
  useToggleValue: () => toggle,
  TOGGLE_NAMES: {
    vre_eligibility_status_phase_2_updates:
      'vre_eligibility_status_phase_2_updates',
  },
});

describe('<Phase2FeatureToggleGate>', () => {
  let sandbox;
  const fallbackTitle = 'Test Page';
  const childText = 'Feature content';

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders children when feature flag is enabled', () => {
    sandbox
      .stub(FeatureToggleHooks, 'useFeatureToggle')
      .returns(mockFeatureToggle(true));

    const { getByText } = render(
      <Phase2FeatureToggleGate fallbackTitle={fallbackTitle}>
        <div>{childText}</div>
      </Phase2FeatureToggleGate>,
    );
    expect(getByText(childText)).to.exist;
  });

  it('renders fallback message when feature flag is disabled', () => {
    sandbox
      .stub(FeatureToggleHooks, 'useFeatureToggle')
      .returns(mockFeatureToggle(false));

    const { getByText, queryByText } = render(
      <Phase2FeatureToggleGate fallbackTitle={fallbackTitle}>
        <div>{childText}</div>
      </Phase2FeatureToggleGate>,
    );
    expect(getByText(fallbackTitle)).to.exist;
    expect(getByText('This page isn’t available right now.')).to.exist;
    expect(queryByText(childText)).to.be.null;
  });
});
