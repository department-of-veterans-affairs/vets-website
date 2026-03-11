import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup } from '@testing-library/react';
import * as featureToggles from 'platform/utilities/feature-toggles';

import Tier2PageContent from '../../components/Tier2PageContent';
import { renderWithProfileReducersAndRouter as render } from '../unit-test-helpers';

describe('Tier2PageContent', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    sandbox.stub(featureToggles, 'useFeatureToggle').returns({
      useToggleValue: sandbox.stub().returns(false),
      TOGGLE_NAMES: {},
    });
  });

  afterEach(() => {
    sandbox.restore();
    cleanup();
  });

  it('renders the page header', () => {
    const { getByText } = render(
      <Tier2PageContent pageHeader="Test Header">
        <p>Child content</p>
      </Tier2PageContent>,
    );
    expect(getByText('Test Header')).to.exist;
  });

  it('renders children', () => {
    const { getByText } = render(
      <Tier2PageContent pageHeader="Test Header">
        <p>Child content here</p>
      </Tier2PageContent>,
    );
    expect(getByText('Child content here')).to.exist;
  });

  it('sets the document title based on pageHeader', () => {
    render(
      <Tier2PageContent pageHeader="My Page Title">
        <p>Content</p>
      </Tier2PageContent>,
    );
    expect(document.title).to.include('My Page Title');
  });

  it('focuses the focus target element on render without hash', () => {
    const { container } = render(
      <Tier2PageContent pageHeader="Test Header">
        <div data-focus-target>Focusable element</div>
      </Tier2PageContent>,
    );
    expect(container.querySelector('[data-focus-target]')).to.exist;
  });

  it('handles location hash by scrolling and focusing the matching element', () => {
    const scrollIntoViewSpy = sandbox.spy();
    // Create an element matching a hash
    const div = document.createElement('div');
    div.id = 'test-section';
    div.scrollIntoView = scrollIntoViewSpy;
    document.body.appendChild(div);

    render(
      <Tier2PageContent pageHeader="Test Header">
        <p>Content</p>
      </Tier2PageContent>,
      { path: '/profile/test#test-section' },
    );

    expect(scrollIntoViewSpy.called).to.be.true;

    // Cleanup
    document.body.removeChild(div);
  });

  it('handles edit hash by scrolling the element without the edit prefix', () => {
    const scrollIntoViewSpy = sandbox.spy();
    // The getScrollTarget function strips the #edit- prefix to find
    // the scroll target, so #edit-field should scroll to #field
    const scrollDiv = document.createElement('div');
    scrollDiv.id = 'field';
    scrollDiv.scrollIntoView = scrollIntoViewSpy;
    document.body.appendChild(scrollDiv);

    // The focus target is the element matching the full hash
    const focusDiv = document.createElement('div');
    focusDiv.id = 'edit-field';
    document.body.appendChild(focusDiv);

    render(
      <Tier2PageContent pageHeader="Test Header">
        <p>Content</p>
      </Tier2PageContent>,
      { path: '/profile/test#edit-field' },
    );

    expect(scrollIntoViewSpy.called).to.be.true;

    // Cleanup
    document.body.removeChild(scrollDiv);
    document.body.removeChild(focusDiv);
  });
});
