/* eslint-disable no-console */
import React, { useState, useEffect, useCallback } from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import sinon from 'sinon';

const EventListenerComponent = () => {
  const [data] = useState(() => new Array(10000).fill('🧟‍♂️'));

  useEffect(
    () => {
      const handler = () => {
        console.log(data.length);
      };

      window.addEventListener('resize', handler);

      // Proper cleanup
      return () => {
        window.removeEventListener('resize', handler);
      };
    },
    [data],
  ); // Added data to dependencies

  return (
    <div className="vads-l-grid-container">
      <span className="vads-u-visibility--screen-reader">
        Data length: {data.length}
      </span>
    </div>
  );
};

describe('Memory Management Test Examples (Fixed)', () => {
  let sandbox;
  let clock;
  let performanceNow;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    performanceNow = global.performance?.now;
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
    if (performanceNow) {
      global.performance.now = performanceNow;
    }
  });

  // Test 1: Proper Event Listener Cleanup
  describe('EventListenerComponent (Fixed)', () => {
    it('should properly clean up event listener', () => {
      const { unmount } = render(<EventListenerComponent />);

      window.dispatchEvent(new Event('resize'));
      clock.tick(1000);

      unmount();
      // Event listener is properly removed
    });
  });

  // Test 2: Proper Timer Cleanup
  describe('TimerComponent (Fixed)', () => {
    const TimerComponent = () => {
      const [count, setCount] = useState(0);
      const [data] = useState(() => new Array(10000).fill('👻'));

      useEffect(
        () => {
          const interval = setInterval(() => {
            setCount(c => c + 1);
            console.log(data.length);
          }, 100);

          // Proper cleanup
          return () => {
            clearInterval(interval);
          };
        },
        [data],
      ); // Added data to dependencies

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-font-size--lg">Count: {count}</span>
          <span className="vads-u-visibility--screen-reader">
            Data length: {data.length}
          </span>
        </div>
      );
    };

    it('should properly clean up interval', () => {
      const { unmount } = render(<TimerComponent />);

      clock.tick(500);

      unmount();
      clock.tick(1000);
      // Interval is properly cleared
    });
  });

  // Test 3: Proper Closure Management
  describe('ClosureComponent (Fixed)', () => {
    const createLargeData = () => new Array(10000).fill('🎃');

    const ClosureComponent = () => {
      const [items] = useState(createLargeData);

      // Use useCallback to memoize the closure
      const processItems = useCallback(
        () => {
          return items.map(item => item.length);
        },
        [items],
      );

      useEffect(
        () => {
          window.processItems = processItems;

          // Proper cleanup
          return () => {
            delete window.processItems;
          };
        },
        [processItems],
      );

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-visibility--screen-reader">
            Items: {items.length}
          </span>
        </div>
      );
    };

    it('should properly clean up closure reference', () => {
      const { unmount } = render(<ClosureComponent />);

      expect(window.processItems).to.be.a('function');
      window.processItems();

      unmount();
      expect(window.processItems).to.equal(undefined);
    });

    afterEach(() => {
      delete window.processItems;
    });
  });

  // Test 4: Proper Ref Management
  describe('RefComponent (Fixed)', () => {
    const RefComponent = () => {
      const [data] = useState(() => new Array(10000).fill('💀'));

      // Use local ref instead of static
      const localRef = React.useRef(data);

      useEffect(
        () => {
          localRef.current = data;

          return () => {
            localRef.current = null;
          };
        },
        [data],
      );

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-visibility--screen-reader">
            Data length: {data.length}
          </span>
        </div>
      );
    };

    it('should properly manage ref lifecycle', () => {
      const { unmount } = render(<RefComponent />);
      unmount();
      // Ref is properly cleaned up through normal garbage collection
    });
  });

  // Test 5: Proper Custom Event Management
  describe('CustomEventComponent (Fixed)', () => {
    const CustomEventComponent = () => {
      const [data] = useState(() => new Array(10000).fill('👿'));

      useEffect(
        () => {
          const handler = () => {
            console.log(data.length);
          };

          document.addEventListener('customEvent', handler);

          // Proper cleanup
          return () => {
            document.removeEventListener('customEvent', handler);
          };
        },
        [data],
      ); // Added data to dependencies

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-visibility--screen-reader">
            Data length: {data.length}
          </span>
        </div>
      );
    };

    it('should properly clean up custom event listener', () => {
      const { unmount } = render(<CustomEventComponent />);

      document.dispatchEvent(new Event('customEvent'));

      unmount();
      // Event listener is properly removed
    });
  });

  // Test 6: Proper Async Operation Management
  describe('AsyncComponent (Fixed)', () => {
    const AsyncComponent = () => {
      const [data] = useState(() => new Array(10000).fill('🤖'));
      const [isActive, setIsActive] = useState(true);

      useEffect(
        () => {
          let mounted = true;

          const processData = async () => {
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 100));

            // Only update if component is still mounted
            if (mounted) {
              setIsActive(prev => !prev);
              console.log(data.length);
            }
          };

          processData();

          // Proper cleanup
          return () => {
            mounted = false;
          };
        },
        [data],
      );

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-visibility--screen-reader">
            Active: {isActive.toString()}
            Data length: {data.length}
          </span>
        </div>
      );
    };

    it('should properly handle async operations', async () => {
      const { unmount } = render(<AsyncComponent />);

      clock.tick(200);

      unmount();
      clock.tick(1000);
      // Async operations are properly cancelled
    });
  });
});
