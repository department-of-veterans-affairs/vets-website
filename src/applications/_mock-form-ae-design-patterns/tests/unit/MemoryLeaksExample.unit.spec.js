/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { render, cleanup } from '@testing-library/react';
import sinon from 'sinon';

describe('Memory Leak Test Examples', () => {
  let sandbox;
  let clock;
  let performanceNow;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    // Store original performance.now
    performanceNow = global.performance?.now;
    // Create our fake timer but preserve performance.now
    clock = sandbox.useFakeTimers({
      shouldAdvanceTime: true,
      now: Date.now(),
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'Date',
      ],
    });
  });

  afterEach(() => {
    cleanup();
    sandbox.restore();
    // Restore original performance.now
    if (performanceNow) {
      global.performance.now = performanceNow;
    }
  });

  // Test 1: Event Listener Leak
  describe('EventListenerComponent', () => {
    const EventListenerComponent = () => {
      const [data] = useState(() => new Array(10000).fill('🧟‍♂️'));

      useEffect(() => {
        const handler = () => {
          // Create closure over component data
          console.log(data.length);
        };

        window.addEventListener('resize', handler);
        // Intentionally omit cleanup to create leak
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-display--none">{data.length}</span>
        </div>
      );
    };

    it('should leak memory when mounting/unmounting', () => {
      const { unmount } = render(<EventListenerComponent />);

      // Trigger resize events
      window.dispatchEvent(new Event('resize'));
      clock.tick(1000);

      unmount();
      // Event listener remains, holding reference to data
    });
  });

  // Test 2: Timer Leak
  describe('TimerComponent', () => {
    const TimerComponent = () => {
      const [count, setCount] = useState(0);
      const [leakyData] = useState(() => new Array(10000).fill('👻'));

      useEffect(() => {
        const interval = setInterval(() => {
          setCount(c => c + 1);
          // Create closure over leakyData
          console.log(leakyData.length);
        }, 100);

        console.log('interval', interval);

        // Intentionally omit clearInterval
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-font-size--lg">Count: {count}</span>
          <span className="vads-u-display--none">{leakyData.length}</span>
        </div>
      );
    };

    it('should leak memory with unclosed interval', () => {
      const { unmount } = render(<TimerComponent />);

      // Let interval run a few times
      clock.tick(500);

      unmount();
      // Interval continues running after unmount
      clock.tick(1000);
    });
  });

  // Test 3: Closure Leak
  describe('ClosureComponent', () => {
    const createLargeData = () => new Array(10000).fill('🎃');

    const ClosureComponent = () => {
      const [items] = useState(createLargeData);

      useEffect(
        () => {
          const leakyClosure = () => {
            // Create closure that captures items array
            return items.map(item => item.length);
          };

          // Store reference globally
          window.leakyClosure = leakyClosure;
        },
        [items],
      );

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-visibility--screen-reader">
            Items: {items.length}
          </span>
        </div>
      );
    };

    it('should leak memory through closure', () => {
      const { unmount } = render(<ClosureComponent />);

      // Access closure to ensure it's retained
      window.leakyClosure();

      unmount();
      // Closure still holds reference to items array
    });

    afterEach(() => {
      delete window.leakyClosure;
    });
  });

  // Test 4: Ref Leak
  describe('RefLeakComponent', () => {
    const RefLeakComponent = () => {
      const [leakyData] = useState(() => new Array(10000).fill('💀'));

      useEffect(
        () => {
          // Store ref directly on component instance
          RefLeakComponent.leakyRef = { data: leakyData };
        },
        [leakyData],
      );

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-display--none">{leakyData.length}</span>
        </div>
      );
    };

    it('should leak memory through static reference', () => {
      const { unmount } = render(<RefLeakComponent />);
      unmount();
      // Static reference prevents garbage collection
    });

    afterEach(() => {
      delete RefLeakComponent.leakyRef;
    });
  });

  // Test 5: Custom Event Leak
  describe('CustomEventComponent', () => {
    const CustomEventComponent = () => {
      const [leakyData] = useState(() => new Array(10000).fill('👿'));

      useEffect(() => {
        const handler = () => {
          // Create closure over leakyData
          console.log(leakyData.length);
        };

        document.addEventListener('customEvent', handler);
        // Intentionally omit removeEventListener
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-display--none">{leakyData.length}</span>
        </div>
      );
    };

    it('should leak memory through custom event listener', () => {
      const { unmount } = render(<CustomEventComponent />);

      // Trigger custom event
      document.dispatchEvent(new Event('customEvent'));

      unmount();
      // Event listener remains attached
    });
  });
});
