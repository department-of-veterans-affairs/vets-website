import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor, cleanup } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { datadogRum } from '@datadog/browser-rum';
import TrackedSpinner from '../../../components/shared/TrackedSpinner';

// Only mock the functions we care about; omit 'performance' due to known bug
// caused by lolex attempting to redefine read-only properties.
const FAKE_TIMER_OPTS = {
  toFake: [
    'Date',
    'setTimeout',
    'clearTimeout',
    'setInterval',
    'clearInterval',
  ],
};

describe('TrackedSpinner', () => {
  let addActionStub;
  let clock;

  beforeEach(() => {
    addActionStub = sinon.stub(datadogRum, 'addAction');
  });

  afterEach(() => {
    // Clean up RTL-rendered components FIRST, while the stub is still active.
    // This ensures that any unmount-triggered datadogRum.addAction calls from
    // the previous test's component go through the stub, not the real function.
    cleanup();

    // Always restore fake timers even if a test assertion throws, so that
    // leaked fakes never pollute downstream tests.
    if (clock) {
      clock.restore();
      clock = null;
    }
    addActionStub.restore();
  });

  it('renders a va-loading-indicator by default', () => {
    const screen = render(
      <TrackedSpinner id="test-spinner" message="Loading..." />,
    );
    expect(screen.container.querySelector('va-loading-indicator')).to.exist;
  });

  it('does not show an error alert before timeout', () => {
    clock = sinon.useFakeTimers(FAKE_TIMER_OPTS);
    const screen = render(
      <TrackedSpinner
        id="test-spinner"
        enableTimeout
        timeout={5000}
        message="Loading..."
      />,
    );
    act(() => {
      clock.tick(4999);
    });
    expect(screen.container.querySelector('va-alert')).to.not.exist;
    expect(screen.container.querySelector('va-loading-indicator')).to.exist;
  });

  it('shows an error alert after timeout elapses', async () => {
    const screen = render(
      <TrackedSpinner
        id="test-spinner"
        enableTimeout
        timeout={100}
        message="Loading..."
      />,
    );

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
        timeout={100}
        message="Loading..."
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('my-special-spinner-timeout-alert')).to.exist;
    });
  });

  it('reports a "timeout" reason to Datadog RUM when timeout fires', async () => {
    render(
      <TrackedSpinner
        id="test-spinner"
        enableTimeout
        timeout={100}
        message="Loading..."
      />,
    );

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
      expect(timeoutCall.args[1].duration).to.be.at.least(0.05);
    });
  });

  it('does not time out when timeout is 0 (disabled)', () => {
    clock = sinon.useFakeTimers(FAKE_TIMER_OPTS);
    const screen = render(
      <TrackedSpinner
        id="test-spinner"
        enableTimeout
        timeout={0}
        message="Loading..."
      />,
    );

    act(() => {
      clock.tick(300000); // 5 minutes — should never time out
    });

    expect(screen.container.querySelector('va-alert')).to.not.exist;
    expect(screen.container.querySelector('va-loading-indicator')).to.exist;
  });

  it('displays the correct error message content', async () => {
    const screen = render(
      <TrackedSpinner
        id="test-spinner"
        enableTimeout
        timeout={100}
        message="Loading..."
      />,
    );

    await waitFor(() => {
      const alert = screen.container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.textContent).to.include('load this page right now');
      expect(alert.textContent).to.include(
        'Please refresh this page or try again later',
      );
    });
  });

  it('does not time out when enableTimeout is false (default)', () => {
    clock = sinon.useFakeTimers(FAKE_TIMER_OPTS);
    const screen = render(
      <TrackedSpinner id="test-spinner" message="Loading..." />,
    );

    act(() => {
      clock.tick(300000); // 5 minutes — should never time out
    });

    expect(screen.container.querySelector('va-alert')).to.not.exist;
    expect(screen.container.querySelector('va-loading-indicator')).to.exist;
  });
});
