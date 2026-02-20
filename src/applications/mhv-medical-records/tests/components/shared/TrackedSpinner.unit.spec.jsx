import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor } from '@testing-library/react';
import * as datadogBrowserRum from '@datadog/browser-rum';
import TrackedSpinner from '../../../components/shared/TrackedSpinner';

describe('TrackedSpinner', () => {
  let clock;
  let addActionStub;

  beforeEach(() => {
    clock = sinon.useFakeTimers({ now: Date.now() });
    addActionStub = sinon.stub(datadogBrowserRum.datadogRum, 'addAction');
  });

  afterEach(() => {
    clock.restore();
    addActionStub.restore();
  });

  it('renders a va-loading-indicator by default', () => {
    const screen = render(
      <TrackedSpinner id="test-spinner" message="Loading..." />,
    );
    expect(screen.container.querySelector('va-loading-indicator')).to.exist;
  });

  it('does not show an error alert before timeout', () => {
    const screen = render(
      <TrackedSpinner
        id="test-spinner"
        enableTimeout
        timeout={5000}
        message="Loading..."
      />,
    );
    clock.tick(4999);
    expect(screen.container.querySelector('va-alert')).to.not.exist;
    expect(screen.container.querySelector('va-loading-indicator')).to.exist;
  });

  it('shows an error alert after timeout elapses', async () => {
    const screen = render(
      <TrackedSpinner
        id="test-spinner"
        enableTimeout
        timeout={5000}
        message="Loading..."
      />,
    );

    clock.tick(5000);

    await waitFor(() => {
      const alert = screen.container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('error');
    });

    // Spinner should be gone
    expect(screen.container.querySelector('va-loading-indicator')).to.not.exist;
  });

  it('includes the correct test ID on the timeout alert', async () => {
    const screen = render(
      <TrackedSpinner
        id="my-special-spinner"
        enableTimeout
        timeout={1000}
        message="Loading..."
      />,
    );

    clock.tick(1000);

    await waitFor(() => {
      expect(screen.getByTestId('my-special-spinner-timeout-alert')).to.exist;
    });
  });

  it('reports a "timeout" reason to Datadog RUM when timeout fires', async () => {
    render(
      <TrackedSpinner
        id="test-spinner"
        enableTimeout
        timeout={5000}
        message="Loading..."
      />,
    );

    clock.tick(5000);

    await waitFor(() => {
      const timeoutCall = addActionStub
        .getCalls()
        .find(
          call =>
            call.args[0] === 'spinner_duration' &&
            call.args[1]?.reason === 'timeout',
        );
      expect(timeoutCall).to.exist;
      expect(timeoutCall.args[1].id).to.equal('test-spinner');
      expect(timeoutCall.args[1].duration).to.be.at.least(5);
    });
  });

  it('does not time out when timeout is 0 (disabled)', () => {
    const screen = render(
      <TrackedSpinner
        id="test-spinner"
        enableTimeout
        timeout={0}
        message="Loading..."
      />,
    );

    clock.tick(300000); // 5 minutes — should never time out

    expect(screen.container.querySelector('va-alert')).to.not.exist;
    expect(screen.container.querySelector('va-loading-indicator')).to.exist;
  });

  it('reports "unmount" reason to Datadog RUM on unmount', () => {
    const { unmount } = render(
      <TrackedSpinner id="test-spinner" message="Loading..." />,
    );

    clock.tick(3000);
    unmount();

    const unmountCall = addActionStub
      .getCalls()
      .find(
        call =>
          call.args[0] === 'spinner_duration' &&
          call.args[1]?.reason === 'unmount',
      );
    expect(unmountCall).to.exist;
    expect(unmountCall.args[1].id).to.equal('test-spinner');
    expect(unmountCall.args[1].duration).to.be.at.least(3);
  });

  it('uses the default timeout when enableTimeout is true and no timeout prop is provided', () => {
    const screen = render(
      <TrackedSpinner id="test-spinner" enableTimeout message="Loading..." />,
    );

    // Should still be loading at 179 seconds
    clock.tick(179000);
    expect(screen.container.querySelector('va-loading-indicator')).to.exist;

    // Should time out at 180 seconds (TRACKED_SPINNER_DURATION)
    clock.tick(1000);

    expect(screen.container.querySelector('va-alert')).to.exist;
  });

  it('displays the correct error message content', () => {
    const screen = render(
      <TrackedSpinner
        id="test-spinner"
        enableTimeout
        timeout={1000}
        message="Loading..."
      />,
    );

    clock.tick(1000);

    const alert = screen.container.querySelector('va-alert');
    expect(alert).to.exist;
    expect(alert.textContent).to.include('load this page right now');
    expect(alert.textContent).to.include(
      'Please refresh this page or try again later',
    );
  });

  it('does not time out when enableTimeout is false (default)', () => {
    const screen = render(
      <TrackedSpinner id="test-spinner" message="Loading..." />,
    );

    clock.tick(300000); // 5 minutes — should never time out

    expect(screen.container.querySelector('va-alert')).to.not.exist;
    expect(screen.container.querySelector('va-loading-indicator')).to.exist;
  });
});
