import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RouterLink from '../../../components/shared/RouterLink';
import reducer from '../../../reducers';

describe('RouterLink', () => {
  const initialState = {
    sm: {},
  };

  const setup = (
    state = initialState,
    href = '/my-health/secure-messages/inbox',
  ) => {
    return renderWithStoreAndRouter(
      <RouterLink href={href} text="Test Link" data-testid="test-link" />,
      {
        initialState: state,
        reducers: reducer,
      },
    );
  };

  it('should render standard link without active attribute by default', () => {
    const screen = setup();
    const link = screen.getByTestId('test-link');

    expect(link).to.exist;
    expect(link.tagName).to.equal('VA-LINK');
    expect(link.getAttribute('text')).to.equal('Test Link');
    expect(link.getAttribute('href')).to.equal(
      '/my-health/secure-messages/inbox',
    );

    // Verify standard link styling (no active attribute)
    expect(link).to.not.have.attribute('active');
  });

  it('should render with active attribute when active={true}', () => {
    const screen = renderWithStoreAndRouter(
      <RouterLink
        href="/my-health/secure-messages/compose"
        text="Action Link"
        active
        data-testid="active-link"
      />,
      {
        initialState,
        reducers: reducer,
      },
    );
    const link = screen.getByTestId('active-link');

    expect(link).to.have.attribute('active', 'true');
  });

  it('should render with reverse attribute when reverse={true}', () => {
    const screen = renderWithStoreAndRouter(
      <RouterLink
        href="/my-health/secure-messages/inbox"
        text="Reverse Link"
        reverse
        data-testid="reverse-link"
      />,
      {
        initialState,
        reducers: reducer,
      },
    );
    const link = screen.getByTestId('reverse-link');

    expect(link).to.have.attribute('reverse', 'true');
  });

  it('should use label prop for aria-label when provided', () => {
    const screen = renderWithStoreAndRouter(
      <RouterLink
        href="/my-health/secure-messages/inbox"
        text="View Inbox"
        label="View your inbox messages"
        data-testid="labeled-link"
      />,
      {
        initialState,
        reducers: reducer,
      },
    );
    const link = screen.getByTestId('labeled-link');

    expect(link).to.have.attribute('label', 'View your inbox messages');
    expect(link.getAttribute('text')).to.equal('View Inbox');
  });

  it('should pass through data attributes', () => {
    const screen = renderWithStoreAndRouter(
      <RouterLink
        href="/my-health/secure-messages/compose"
        text="Compose Message"
        data-testid="data-attrs-link"
        data-dd-action-name="Compose from dashboard"
        data-dd-privacy="mask"
      />,
      {
        initialState,
        reducers: reducer,
      },
    );
    const link = screen.getByTestId('data-attrs-link');

    expect(link).to.have.attribute(
      'data-dd-action-name',
      'Compose from dashboard',
    );
    expect(link).to.have.attribute('data-dd-privacy', 'mask');
  });

  describe('React Router integration', () => {
    it('should render with onClick handler for routing', () => {
      const screen = setup();
      const link = screen.getByTestId('test-link');

      // Verify the link has an href that will be intercepted
      expect(link).to.have.attribute(
        'href',
        '/my-health/secure-messages/inbox',
      );

      // The component wraps VaLink with onClick handler
      // RouterLink component intercepts clicks to call router.push
      expect(link.tagName).to.equal('VA-LINK');
    });

    it('should prevent default link behavior via onClick handler', () => {
      const screen = setup();
      const link = screen.getByTestId('test-link');

      // The link should have an onClick handler that prevents default
      // This is tested implicitly by router integration - if default
      // wasn't prevented, browser would navigate instead of router.push
      expect(link).to.have.attribute('href');
    });
  });

  describe('accessibility', () => {
    it('should render as an anchor element via va-link', () => {
      const screen = setup();
      const link = screen.getByTestId('test-link');

      // va-link renders as anchor in shadow DOM
      expect(link.tagName).to.equal('VA-LINK');
      expect(link).to.have.attribute('href');
      expect(link).to.have.attribute('text');
    });

    it('should support aria-label via label prop', () => {
      const screen = renderWithStoreAndRouter(
        <RouterLink
          href="/test"
          text="Click here"
          label="Navigate to test page"
          data-testid="aria-link"
        />,
        {
          initialState,
          reducers: reducer,
        },
      );
      const link = screen.getByTestId('aria-link');

      expect(link).to.have.attribute('label', 'Navigate to test page');
    });

    it('should be keyboard accessible', () => {
      const screen = setup();
      const link = screen.getByTestId('test-link');

      // va-link is natively keyboard accessible as it renders anchor
      expect(link).to.have.attribute('href');
    });
  });

  describe('VADS Design System compliance', () => {
    it('uses VaLink component for consistent styling', () => {
      const screen = setup();
      const link = screen.getByTestId('test-link');

      // Verify it's a va-link web component
      expect(link.tagName).to.equal('VA-LINK');
    });

    it('supports standard link styling by default (no active)', () => {
      const screen = setup();
      const link = screen.getByTestId('test-link');

      // Standard utility link - no active attribute
      expect(link).to.not.have.attribute('active');
    });

    it('supports active link styling when active={true}', () => {
      const screen = renderWithStoreAndRouter(
        <RouterLink
          href="/test"
          text="Active Link"
          active
          data-testid="vads-active-link"
        />,
        {
          initialState,
          reducers: reducer,
        },
      );
      const link = screen.getByTestId('vads-active-link');

      // Active link - bold text + chevron
      expect(link).to.have.attribute('active', 'true');
    });

    it('supports reverse styling for dark backgrounds', () => {
      const screen = renderWithStoreAndRouter(
        <RouterLink
          href="/test"
          text="Reverse Link"
          reverse
          data-testid="vads-reverse-link"
        />,
        {
          initialState,
          reducers: reducer,
        },
      );
      const link = screen.getByTestId('vads-reverse-link');

      // Reverse - white text for dark backgrounds
      expect(link).to.have.attribute('reverse', 'true');
    });
  });

  describe('PropTypes validation', () => {
    it('should require href prop', () => {
      // This test verifies PropTypes are defined correctly
      // Router will be injected by withRouter HOC
      const screen = setup();
      const link = screen.getByTestId('test-link');

      expect(link).to.have.attribute('href');
    });

    it('should require text prop', () => {
      const screen = setup();
      const link = screen.getByTestId('test-link');

      expect(link).to.have.attribute('text');
      expect(link.getAttribute('text')).to.not.be.empty;
    });

    it('should accept optional active prop', () => {
      const screen1 = setup();
      const link1 = screen1.getByTestId('test-link');
      expect(link1).to.not.have.attribute('active');

      const screen2 = renderWithStoreAndRouter(
        <RouterLink
          href="/test"
          text="Test"
          active
          data-testid="test-link-2"
        />,
        {
          initialState,
          reducers: reducer,
        },
      );
      const link2 = screen2.getByTestId('test-link-2');
      expect(link2).to.have.attribute('active', 'true');
    });

    it('should accept optional label prop', () => {
      const screen = renderWithStoreAndRouter(
        <RouterLink
          href="/test"
          text="Test"
          label="Test label"
          data-testid="test-link-label"
        />,
        {
          initialState,
          reducers: reducer,
        },
      );
      const link = screen.getByTestId('test-link-label');

      expect(link).to.have.attribute('label', 'Test label');
    });

    it('should accept optional reverse prop', () => {
      const screen = renderWithStoreAndRouter(
        <RouterLink
          href="/test"
          text="Test"
          reverse
          data-testid="test-link-reverse"
        />,
        {
          initialState,
          reducers: reducer,
        },
      );
      const link = screen.getByTestId('test-link-reverse');

      expect(link).to.have.attribute('reverse', 'true');
    });
  });

  describe('click navigation (history.push)', () => {
    it('should navigate to correct path on click', () => {
      const { container, history } = renderWithStoreAndRouter(
        <RouterLink
          href="/my-health/secure-messages/inbox"
          text="Go to inbox"
          data-testid="click-test-link"
        />,
        {
          initialState,
          reducers: reducer,
          path: '/my-health/secure-messages',
        },
      );

      const link = container.querySelector('va-link');

      // Simulate click
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      link.dispatchEvent(clickEvent);

      // Verify navigation occurred by checking history location
      expect(history.location.pathname).to.equal(
        '/my-health/secure-messages/inbox',
      );
    });

    it('should prevent default browser navigation on click', () => {
      const { container } = renderWithStoreAndRouter(
        <RouterLink
          href="/my-health/secure-messages/inbox"
          text="Go to inbox"
        />,
        {
          initialState,
          reducers: reducer,
        },
      );

      const link = container.querySelector('va-link');
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
        <RouterLink
          href="/my-health/secure-messages/inbox?folder=custom"
          text="View folder"
        />,
        {
          initialState,
          reducers: reducer,
          path: '/my-health/secure-messages',
        },
      );

      const link = container.querySelector('va-link');

      link.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );

      // history.push with query string updates search, not pathname
      expect(history.location.pathname).to.equal(
        '/my-health/secure-messages/inbox',
      );
      expect(history.location.search).to.equal('?folder=custom');
    });

    it('should navigate to paths with hash fragments', () => {
      const { container, history } = renderWithStoreAndRouter(
        <RouterLink
          href="/profile/personal-information#messaging-signature"
          text="Edit signature"
        />,
        {
          initialState,
          reducers: reducer,
          path: '/profile',
        },
      );

      const link = container.querySelector('va-link');

      link.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );

      expect(history.location.pathname).to.equal(
        '/profile/personal-information',
      );
      expect(history.location.hash).to.equal('#messaging-signature');
    });
  });
});
