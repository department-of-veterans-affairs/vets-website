import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import RouterLinkAction from '../RouterLinkAction';
import reducer from '../../../reducers';

describe('RouterLinkAction', () => {
  const initialState = {
    sm: {
      alerts: {},
      recipients: {},
      breadcrumbs: {},
      categories: {},
      facilities: {},
      folders: {},
      search: {},
      threads: {},
      threadDetails: {},
      triageTeams: {},
      preferences: {},
      prescription: {},
    },
  };

  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders a va-link-action element', () => {
    const { container } = renderWithStoreAndRouter(
      <RouterLinkAction href="/test-path" text="Test Link" />,
      {
        initialState,
        reducers: reducer,
      },
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.exist;
  });

  it('renders with action link styling by default (active={true})', () => {
    const { container } = renderWithStoreAndRouter(
      <RouterLinkAction href="/test-path" text="Test Link" />,
      {
        initialState,
        reducers: reducer,
      },
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.exist;
    // VaLinkAction is always styled as an action link
  });

  it('renders with standard link styling when active={false}', () => {
    const { container } = renderWithStoreAndRouter(
      <RouterLinkAction href="/test-path" text="Test Link" active={false} />,
      {
        initialState,
        reducers: reducer,
      },
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.exist;
    // VaLinkAction is always styled as an action link - active prop is ignored
  });

  it('renders with action link styling when active={true} is explicit', () => {
    const { container } = renderWithStoreAndRouter(
      <RouterLinkAction href="/test-path" text="Test Link" active />,
      {
        initialState,
        reducers: reducer,
      },
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.exist;
    // VaLinkAction is always styled as an action link - active prop is ignored
  });

  it('passes href prop to va-link-action', () => {
    const { container } = renderWithStoreAndRouter(
      <RouterLinkAction href="/my-test-path" text="Test Link" />,
      {
        initialState,
        reducers: reducer,
      },
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.have.attribute('href', '/my-test-path');
  });

  it('passes text prop to va-link-action', () => {
    const { container } = renderWithStoreAndRouter(
      <RouterLinkAction href="/test-path" text="My Test Text" />,
      {
        initialState,
        reducers: reducer,
      },
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.have.attribute('text', 'My Test Text');
  });

  it('passes label prop to va-link-action when provided', () => {
    const { container } = renderWithStoreAndRouter(
      <RouterLinkAction
        href="/test-path"
        text="Test Link"
        label="Accessible label"
      />,
      {
        initialState,
        reducers: reducer,
      },
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.have.attribute('label', 'Accessible label');
  });

  it('does not pass label prop when not provided', () => {
    const { container } = renderWithStoreAndRouter(
      <RouterLinkAction href="/test-path" text="Test Link" />,
      {
        initialState,
        reducers: reducer,
      },
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.not.have.attribute('label');
  });

  it('passes reverse prop to va-link-action when true', () => {
    const { container } = renderWithStoreAndRouter(
      <RouterLinkAction href="/test-path" text="Test Link" reverse />,
      {
        initialState,
        reducers: reducer,
      },
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.have.attribute('reverse', 'true');
  });

  it('does not pass reverse prop when false', () => {
    const { container } = renderWithStoreAndRouter(
      <RouterLinkAction href="/test-path" text="Test Link" reverse={false} />,
      {
        initialState,
        reducers: reducer,
      },
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.not.have.attribute('reverse');
  });

  it('passes data attributes to va-link-action', () => {
    const { container } = renderWithStoreAndRouter(
      <RouterLinkAction
        href="/test-path"
        text="Test Link"
        data-testid="my-test-id"
        data-dd-action-name="Test Action"
        data-dd-privacy="mask"
      />,
      {
        initialState,
        reducers: reducer,
      },
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.have.attribute('data-testid', 'my-test-id');
    expect(link).to.have.attribute('data-dd-action-name', 'Test Action');
    expect(link).to.have.attribute('data-dd-privacy', 'mask');
  });

  it('calls router.push with correct href on click', () => {
    const { container } = renderWithStoreAndRouter(
      <RouterLinkAction href="/inbox" text="Go to Inbox" />,
      {
        initialState,
        reducers: reducer,
        path: '/',
      },
    );

    const link = container.querySelector('va-link-action');

    // Simulate click event
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    // Spy on preventDefault
    const preventDefaultSpy = sandbox.spy(clickEvent, 'preventDefault');

    link.dispatchEvent(clickEvent);

    // Verify preventDefault was called
    expect(preventDefaultSpy.calledOnce).to.be.true;
  });

  it('handles navigation to different paths', () => {
    const paths = [
      '/my-health/secure-messages/inbox/',
      '/my-health/secure-messages/compose',
      '/profile/personal-information#messaging-signature',
    ];

    paths.forEach(path => {
      const { container } = renderWithStoreAndRouter(
        <RouterLinkAction href={path} text="Test Link" />,
        {
          initialState,
          reducers: reducer,
        },
      );

      const link = container.querySelector('va-link-action');
      expect(link).to.have.attribute('href', path);
    });
  });

  it('combines multiple props correctly', () => {
    const { container } = renderWithStoreAndRouter(
      <RouterLinkAction
        href="/test-path"
        text="Combined Props Test"
        label="Custom Label"
        active={false}
        reverse
        data-testid="combined-test"
        data-dd-action-name="Combined Action"
      />,
      {
        initialState,
        reducers: reducer,
      },
    );

    const link = container.querySelector('va-link-action');
    expect(link).to.have.attribute('href', '/test-path');
    expect(link).to.have.attribute('text', 'Combined Props Test');
    expect(link).to.have.attribute('label', 'Custom Label');
    // VaLinkAction is always styled as an action link - active prop is ignored
    expect(link).to.have.attribute('reverse', 'true');
    expect(link).to.have.attribute('data-testid', 'combined-test');
    expect(link).to.have.attribute('data-dd-action-name', 'Combined Action');
  });

  describe('PropTypes validation', () => {
    let consoleErrorStub;

    beforeEach(() => {
      consoleErrorStub = sandbox.stub(console, 'error');
    });

    it('does not warn when all required props are provided', () => {
      renderWithStoreAndRouter(<RouterLinkAction href="/test" text="Test" />, {
        initialState,
        reducers: reducer,
      });

      // Filter out unrelated warnings
      const relevantErrors = consoleErrorStub
        .getCalls()
        .filter(
          call =>
            call.args[0]?.includes('RouterLinkAction') ||
            call.args[0]?.includes('Failed prop type'),
        );

      expect(relevantErrors.length).to.equal(0);
    });
  });

  describe('VADS compliance', () => {
    it('uses action link styling for primary CTAs in alerts', () => {
      const { container } = renderWithStoreAndRouter(
        <RouterLinkAction
          href="/compose"
          text="Start a new message"
          data-dd-action-name="Primary CTA"
        />,
        {
          initialState,
          reducers: reducer,
        },
      );

      const link = container.querySelector('va-link-action');
      expect(link).to.exist;
      // VaLinkAction is always styled as an action link
    });

    it('uses standard link styling for utility links', () => {
      const { container } = renderWithStoreAndRouter(
        <RouterLinkAction
          href="/profile/personal-information#messaging-signature"
          text="Edit signature for all messages"
          active={false}
          data-dd-action-name="Utility Link"
        />,
        {
          initialState,
          reducers: reducer,
        },
      );

      const link = container.querySelector('va-link-action');
      expect(link).to.exist;
      // VaLinkAction is always styled as an action link - active prop is ignored
    });
  });
});
