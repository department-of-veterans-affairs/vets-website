import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';
import sinon from 'sinon';

import ContactInformation from '@@profile/components/contact-information/ContactInformation';
import {
  createBasicInitialState,
  createFeatureTogglesState,
  renderWithProfileReducers,
} from '../../unit-test-helpers';

const makeState = () => ({
  ...createBasicInitialState(),
  ...createFeatureTogglesState(),
});

/**
 * Deep-link hash behavior unit tests
 *
 * Note: These tests verify that the correct elements are made focusable (tabindex="-1")
 * but do not test actual focus behavior. jsdom does not fully support focus management,
 * especially for web components with shadow DOM.
 *
 * Actual focus behavior is tested in E2E tests:
 * @see src/applications/personalization/profile/tests/e2e/contact-information/deep-links.cypress.spec.js
 */
describe('ContactInformation deep-link hash behavior', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers({
      shouldAdvanceTime: false,
      toFake: ['setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'],
    });
  });

  afterEach(() => {
    if (clock) {
      clock.restore();
    }
    document.body.innerHTML = '';
  });

  const renderWithHash = hash => {
    window.history.pushState({}, '', `/profile/contact-information${hash}`);
    const initialState = makeState();
    return renderWithProfileReducers(
      <MemoryRouter initialEntries={[`/profile/contact-information${hash}`]}>
        <ContactInformation />
      </MemoryRouter>,
      { initialState },
    );
  };

  it('renders with default focus target when no hash present', () => {
    const { container } = renderWithHash('');
    clock.tick(500);

    const defaultTarget = container.querySelector('[data-focus-target="true"]');
    expect(defaultTarget).to.exist;
    expect(defaultTarget.getAttribute('tabindex')).to.equal('-1');
  });

  it('renders with matching element for valid legacy hash', () => {
    const anchor = document.createElement('div');
    anchor.id = 'home-phone';
    document.body.appendChild(anchor);

    renderWithHash('#home-phone');
    clock.tick(500);

    expect(anchor.getAttribute('tabindex')).to.equal('-1');
  });

  it('renders with matching edit button for valid #edit-* hash', () => {
    const btn = document.createElement('va-button');
    btn.setAttribute('label', 'Edit Home Phone');
    document.body.appendChild(btn);

    renderWithHash('#edit-home-phone');
    clock.tick(500);

    expect(btn.getAttribute('tabindex')).to.equal('-1');
  });

  it('falls back to default target for invalid hash', () => {
    const { container } = renderWithHash('#edit-nonexistent');
    clock.tick(2000); // Allow retries to exhaust

    const defaultTarget = container.querySelector('[data-focus-target="true"]');
    expect(defaultTarget).to.exist;
    expect(defaultTarget.getAttribute('tabindex')).to.equal('-1');
  });
});
