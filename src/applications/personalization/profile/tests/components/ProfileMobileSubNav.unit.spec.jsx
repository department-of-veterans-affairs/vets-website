import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
import * as featureToggles from 'platform/utilities/feature-toggles';

import ProfileMobileSubNav from '../../components/ProfileMobileSubNav';
import { renderWithProfileReducersAndRouter as render } from '../unit-test-helpers';

const defaultRoutes = [
  { path: '/profile/personal-information', name: 'Personal information' },
  { path: '/profile/contact-information', name: 'Contact information' },
  { path: '/profile/military-information', name: 'Military information' },
];

const defaultProps = {
  isLOA3: true,
  isInMVI: true,
  isSchedulingPreferencesPilotEligible: false,
  routes: defaultRoutes,
};

describe('ProfileMobileSubNav', () => {
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

  it('renders the open menu button when menu is closed', () => {
    const { container } = render(<ProfileMobileSubNav {...defaultProps} />);
    const openButton = container.querySelector('.open-menu');
    expect(openButton).to.exist;
    expect(openButton.textContent).to.include('Profile menu');
  });

  it('does not render close button when menu is closed', () => {
    const { container } = render(<ProfileMobileSubNav {...defaultProps} />);
    expect(container.querySelector('.close-menu')).to.not.exist;
  });

  it('opens the menu when the open button is clicked', () => {
    const { container } = render(<ProfileMobileSubNav {...defaultProps} />);
    const openButton = container.querySelector('.open-menu');
    fireEvent.click(openButton);

    // Now the close button should be visible and open button hidden
    expect(container.querySelector('.close-menu')).to.exist;
    expect(container.querySelector('.open-menu')).to.not.exist;
  });

  it('renders ProfileSubNav when menu is open', () => {
    const { container, getByText } = render(
      <ProfileMobileSubNav {...defaultProps} />,
    );
    fireEvent.click(container.querySelector('.open-menu'));

    // ProfileSubNav should render the route names as links
    expect(getByText('Personal information')).to.exist;
  });

  it('closes the menu when the close button is clicked', () => {
    const { container } = render(<ProfileMobileSubNav {...defaultProps} />);
    // Open the menu first
    fireEvent.click(container.querySelector('.open-menu'));
    expect(container.querySelector('.close-menu')).to.exist;

    // Close the menu
    fireEvent.click(container.querySelector('.close-menu'));
    expect(container.querySelector('.close-menu')).to.not.exist;
    expect(container.querySelector('.open-menu')).to.exist;
  });

  it('closes the menu when escape key is pressed', async () => {
    const { container } = render(<ProfileMobileSubNav {...defaultProps} />);
    // Open the menu first
    fireEvent.click(container.querySelector('.open-menu'));
    expect(container.querySelector('.close-menu')).to.exist;

    // Press escape
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(container.querySelector('.close-menu')).to.not.exist;
      expect(container.querySelector('.open-menu')).to.exist;
    });
  });

  it('shows the correct aria-labelledby when menu is closed', () => {
    const { container } = render(<ProfileMobileSubNav {...defaultProps} />);
    const nav = container.querySelector('nav');
    expect(nav.getAttribute('aria-labelledby')).to.equal(
      'mobile-subnav-header-button',
    );
  });

  it('shows the correct aria-labelledby when menu is open', () => {
    const { container } = render(<ProfileMobileSubNav {...defaultProps} />);
    fireEvent.click(container.querySelector('.open-menu'));

    const nav = container.querySelector('nav');
    expect(nav.getAttribute('aria-labelledby')).to.equal(
      'mobile-subnav-header',
    );
  });

  it('renders the menu header text when menu is open', () => {
    const { container } = render(<ProfileMobileSubNav {...defaultProps} />);
    fireEvent.click(container.querySelector('.open-menu'));

    const header = container.querySelector('#mobile-subnav-header');
    expect(header).to.exist;
    expect(header.textContent).to.include('Profile menu');
  });
});
