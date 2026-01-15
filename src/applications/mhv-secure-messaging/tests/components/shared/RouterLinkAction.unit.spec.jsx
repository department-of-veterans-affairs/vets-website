import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RouterLinkAction from '../../../components/shared/RouterLinkAction';
import reducer from '../../../reducers';

describe('RouterLinkAction', () => {
  const initialState = {
    sm: {},
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

  it('renders a va-link-action element', () => {
    const { container } = setup();
    const link = container.querySelector('va-link-action');
    expect(link).to.exist;
  });

  it('renders with correct href attribute', () => {
    const { container } = setup({ href: '/test-path' });
    const link = container.querySelector('va-link-action');
    expect(link.getAttribute('href')).to.equal(
      '/my-health/secure-messages/test-path',
    );
  });

  it('renders with correct text attribute', () => {
    const { container } = setup({ text: 'Test Link Text' });
    const link = container.querySelector('va-link-action');
    expect(link.getAttribute('text')).to.equal('Test Link Text');
  });

  it('renders with label attribute when provided', () => {
    const { container } = setup({ label: 'Custom aria label' });
    const link = container.querySelector('va-link-action');
    expect(link.getAttribute('label')).to.equal('Custom aria label');
  });

  it('does not render label attribute when not provided', () => {
    const { container } = setup();
    const link = container.querySelector('va-link-action');
    expect(link).to.not.have.attribute('label');
  });

  it('renders with reverse attribute when reverse=true', () => {
    const { container } = setup({ reverse: true });
    const link = container.querySelector('va-link-action');
    expect(link).to.have.attribute('reverse');
  });

  it('does not render reverse attribute when reverse=false', () => {
    const { container } = setup({ reverse: false });
    const link = container.querySelector('va-link-action');
    expect(link).to.not.have.attribute('reverse');
  });

  it('passes through data attributes', () => {
    const { container } = setup({
      'data-testid': 'custom-test-id',
      'data-dd-action-name': 'Test Action',
    });
    const link = container.querySelector('va-link-action');
    expect(link.getAttribute('data-testid')).to.equal('custom-test-id');
    expect(link.getAttribute('data-dd-action-name')).to.equal('Test Action');
  });

  describe('click navigation (history.push)', () => {
    it('should navigate to correct path on click', () => {
      const { container, history } = renderWithStoreAndRouter(
        <RouterLinkAction
          href="/my-health/secure-messages/compose"
          text="Start a new message"
          data-testid="click-test-link"
        />,
        {
          initialState,
          reducers: reducer,
          path: '/my-health/secure-messages',
        },
      );

      const link = container.querySelector('va-link-action');

      // Simulate click
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      link.dispatchEvent(clickEvent);

      // Verify navigation occurred by checking history location
      expect(history.location.pathname).to.equal(
        '/my-health/secure-messages/compose',
      );
    });

    it('should prevent default browser navigation on click', () => {
      const { container } = renderWithStoreAndRouter(
        <RouterLinkAction
          href="/my-health/secure-messages/inbox"
          text="Go to inbox"
        />,
        {
          initialState,
          reducers: reducer,
        },
      );

      const link = container.querySelector('va-link-action');
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = sinon.spy(clickEvent, 'preventDefault');

      link.dispatchEvent(clickEvent);

      expect(preventDefaultSpy.calledOnce).to.be.true;
    });

    it('should navigate to paths with query parameters', () => {
      const { container, history } = renderWithStoreAndRouter(
        <RouterLinkAction
          href="/my-health/secure-messages/inbox?folder=custom"
          text="View folder"
        />,
        {
          initialState,
          reducers: reducer,
          path: '/my-health/secure-messages',
        },
      );

      const link = container.querySelector('va-link-action');

      link.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );

      expect(history.location.pathname).to.equal(
        '/my-health/secure-messages/inbox',
      );
      expect(history.location.search).to.equal('?folder=custom');
    });

    it('should navigate to paths with hash fragments', () => {
      const { container, history } = renderWithStoreAndRouter(
        <RouterLinkAction
          href="/profile/personal-information#messaging-signature"
          text="Edit signature"
        />,
        {
          initialState,
          reducers: reducer,
          path: '/profile',
        },
      );

      const link = container.querySelector('va-link-action');

      link.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );

      expect(history.location.pathname).to.equal(
        '/profile/personal-information',
      );
      expect(history.location.hash).to.equal('#messaging-signature');
    });
  });

  describe('accessibility', () => {
    it('announces link purpose with aria-label', () => {
      const { container } = setup({
        text: 'Go',
        label: 'Go to your inbox to read messages',
      });
      const link = container.querySelector('va-link-action');

      expect(link.getAttribute('text')).to.equal('Go');
      expect(link.getAttribute('label')).to.equal(
        'Go to your inbox to read messages',
      );
    });
  });

  describe('VADS compliance', () => {
    it('uses action link styling for primary CTAs', () => {
      const { container } = setup({
        href: '/my-health/secure-messages/compose',
        text: 'Start a new message',
      });

      const link = container.querySelector('va-link-action');
      expect(link).to.exist;
      expect(link.tagName).to.equal('VA-LINK-ACTION');
    });

    it('renders reverse styling for dark backgrounds', () => {
      const { container } = setup({ reverse: true, text: 'Reverse Action' });
      const link = container.querySelector('va-link-action');

      expect(link).to.have.attribute('reverse');
      expect(link.getAttribute('text')).to.equal('Reverse Action');
    });
  });
});
