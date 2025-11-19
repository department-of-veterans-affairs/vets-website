import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RouterLinkAction from '../../../components/shared/RouterLinkAction';
import reducer from '../../../reducers';

describe('RouterLinkAction component', () => {
  const initialState = {
    sm: {
      alerts: { alertList: [] },
    },
  };

  const setup = (customProps = {}) => {
    const props = {
      href: '/my-health/secure-messages/inbox',
      text: 'Go to inbox',
      ...customProps,
    };

    return renderWithStoreAndRouter(<RouterLinkAction {...props} />, {
      initialState,
      reducers: reducer,
      path: '/my-health/secure-messages',
    });
  };

  it('renders a va-link element', () => {
    const { container } = setup();
    const link = container.querySelector('va-link');
    expect(link).to.exist;
  });

  it('renders with correct href attribute', () => {
    const { container } = setup({ href: '/test-path' });
    const link = container.querySelector('va-link');
    expect(link.getAttribute('href')).to.equal('/test-path');
  });

  it('renders with correct text attribute', () => {
    const { container } = setup({ text: 'Test Link Text' });
    const link = container.querySelector('va-link');
    expect(link.getAttribute('text')).to.equal('Test Link Text');
  });

  it('renders with active attribute for action link styling by default', () => {
    const { container } = setup();
    const link = container.querySelector('va-link');
    expect(link).to.have.attribute('active');
  });

  it('renders without active attribute when active={false}', () => {
    const { container } = setup({ active: false });
    const link = container.querySelector('va-link');
    expect(link).to.not.have.attribute('active');
  });

  it('renders with active attribute when active={true} is explicit', () => {
    const { container } = setup({ active: true });
    const link = container.querySelector('va-link');
    expect(link).to.have.attribute('active');
  });

  it('renders with label attribute when provided', () => {
    const { container } = setup({ label: 'Custom aria label' });
    const link = container.querySelector('va-link');
    expect(link.getAttribute('label')).to.equal('Custom aria label');
  });

  it('renders with reverse attribute when reverse=true', () => {
    const { container } = setup({ reverse: true });
    const link = container.querySelector('va-link');
    expect(link).to.have.attribute('reverse');
  });

  it('does not render reverse attribute when reverse=false', () => {
    const { container } = setup({ reverse: false });
    const link = container.querySelector('va-link');
    expect(link).to.not.have.attribute('reverse');
  });

  it('passes through additional props', () => {
    const { container } = setup({ 'data-testid': 'custom-test-id' });
    const link = container.querySelector('va-link');
    expect(link.getAttribute('data-testid')).to.equal('custom-test-id');
  });

  describe('React Router integration', () => {
    it('renders with correct href for internal navigation', () => {
      const { container } = setup({
        href: '/my-health/secure-messages/compose',
      });
      const link = container.querySelector('va-link');

      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal(
        '/my-health/secure-messages/compose',
      );
    });

    it('handles paths with query parameters', () => {
      const hrefWithQuery = '/my-health/secure-messages/inbox?folder=custom';
      const { container } = setup({ href: hrefWithQuery });
      const link = container.querySelector('va-link');

      expect(link.getAttribute('href')).to.equal(hrefWithQuery);
    });

    it('handles paths with hash fragments', () => {
      const hrefWithHash = '/profile/personal-information#messaging-signature';
      const { container } = setup({ href: hrefWithHash });
      const link = container.querySelector('va-link');

      expect(link.getAttribute('href')).to.equal(hrefWithHash);
    });
  });

  describe('accessibility', () => {
    it('announces link purpose with aria-label', () => {
      const { container } = setup({
        text: 'Go',
        label: 'Go to your inbox to read messages',
      });
      const link = container.querySelector('va-link');

      expect(link.getAttribute('text')).to.equal('Go');
      expect(link.getAttribute('label')).to.equal(
        'Go to your inbox to read messages',
      );
    });
  });

  describe('component variants', () => {
    it('renders with active attribute for action link styling', () => {
      const { container } = setup({ text: 'Primary Action' });
      const link = container.querySelector('va-link');

      expect(link).to.have.attribute('active');
      expect(link.getAttribute('text')).to.equal('Primary Action');
    });

    it('renders reverse styling for dark backgrounds', () => {
      const { container } = setup({ reverse: true, text: 'Reverse Action' });
      const link = container.querySelector('va-link');

      expect(link).to.have.attribute('reverse');
      expect(link.getAttribute('text')).to.equal('Reverse Action');
    });
  });

  describe('router navigation', () => {
    it('renders link that will navigate via React Router when clicked', () => {
      const { container } = setup({
        href: '/my-health/secure-messages/compose',
        text: 'Start a new message',
      });

      const link = container.querySelector('va-link');

      // Verify link exists and has correct attributes for router navigation
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal(
        '/my-health/secure-messages/compose',
      );
      expect(link.getAttribute('text')).to.equal('Start a new message');
      expect(link).to.have.attribute('active'); // Uses action link styling
    });

    it('renders with paths containing query parameters', () => {
      const { container } = setup({
        href: '/my-health/secure-messages/inbox?folder=custom',
        text: 'View custom folder',
      });

      const link = container.querySelector('va-link');
      expect(link.getAttribute('href')).to.equal(
        '/my-health/secure-messages/inbox?folder=custom',
      );
    });

    it('renders with paths containing hash fragments', () => {
      const { container } = setup({
        href: '/profile/personal-information#messaging-signature',
        text: 'Edit signature',
      });

      const link = container.querySelector('va-link');
      expect(link.getAttribute('href')).to.equal(
        '/profile/personal-information#messaging-signature',
      );
    });
  });

  describe('VADS compliance', () => {
    it('renders action link styling for primary CTAs (default behavior)', () => {
      const { container } = setup({
        href: '/my-health/secure-messages/compose',
        text: 'Start a new message',
      });

      const link = container.querySelector('va-link');
      expect(link).to.have.attribute('active');
    });

    it('renders standard link styling for utility links with active={false}', () => {
      const { container } = setup({
        href: '/profile/personal-information#messaging-signature',
        text: 'Edit signature for all messages',
        active: false,
      });

      const link = container.querySelector('va-link');
      expect(link).to.not.have.attribute('active');
    });

    it('supports action link in alert context', () => {
      const { container } = setup({
        href: '/my-health/secure-messages/inbox',
        text: 'Go to your inbox',
        'data-dd-action-name': 'Navigate to inbox from alert',
      });

      const link = container.querySelector('va-link');
      expect(link).to.have.attribute('active');
      expect(link.getAttribute('data-dd-action-name')).to.equal(
        'Navigate to inbox from alert',
      );
    });

    it('supports standard link in form context', () => {
      const { container } = setup({
        href: '/profile/personal-information',
        text: 'Edit profile',
        active: false,
        'data-testid': 'edit-profile-link',
      });

      const link = container.querySelector('va-link');
      expect(link).to.not.have.attribute('active');
      expect(link.getAttribute('data-testid')).to.equal('edit-profile-link');
    });
  });
});
