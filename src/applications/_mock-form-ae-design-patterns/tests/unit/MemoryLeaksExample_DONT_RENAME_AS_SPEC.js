/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import sinon from 'sinon';

describe('Memory Management Test Examples (Unfixed)', () => {
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

  // Test 1: Event Listener Leak
  describe('EventListenerComponent (Unfixed)', () => {
    const EventListenerComponent = () => {
      const [data] = useState(() => new Array(10000).fill('🧟‍♂️'));

      useEffect(
        () => {
          const handler = () => {
            console.log(data.length);
          };

          window.addEventListener('resize', handler);
          // No cleanup
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

    it('should properly clean up event listener', () => {
      const { unmount } = render(<EventListenerComponent />);

      window.dispatchEvent(new Event('resize'));
      clock.tick(1000);

      unmount();
      // Event listener remains
    });
  });

  // Test 2: Timer Leak
  describe('TimerComponent (Unfixed)', () => {
    const TimerComponent = () => {
      const [count, setCount] = useState(0);
      const [data] = useState(() => new Array(10000).fill('👻'));

      useEffect(
        () => {
          setInterval(() => {
            setCount(c => c + 1);
            console.log(data.length);
          }, 100);
          // No cleanup
        },
        [data],
      );

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
      // Interval continues running
    });
  });

  // Test 3: Closure Leak
  describe('ClosureComponent (Unfixed)', () => {
    const createLargeData = () => new Array(10000).fill('🎃');

    const ClosureComponent = () => {
      const [items] = useState(createLargeData);

      useEffect(
        () => {
          const processItems = () => {
            return items.map(item => item.length);
          };

          window.processItems = processItems;
          // No cleanup
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

    it('should properly clean up closure reference', () => {
      const { unmount } = render(<ClosureComponent />);

      expect(window.processItems).to.be.a('function');
      window.processItems();

      unmount();
      // Global reference remains
    });

    afterEach(() => {
      delete window.processItems;
    });
  });

  // Test 4: Ref Leak
  describe('RefComponent (Unfixed)', () => {
    const RefComponent = () => {
      const [data] = useState(() => new Array(10000).fill('💀'));

      useEffect(
        () => {
          // Store ref statically on component
          RefComponent.staticRef = data;
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
      // Static ref remains
    });
  });

  // Test 5: Custom Event Leak
  describe('CustomEventComponent (Unfixed)', () => {
    const CustomEventComponent = () => {
      const [data] = useState(() => new Array(10000).fill('👿'));

      useEffect(
        () => {
          const handler = () => {
            console.log(data.length);
          };

          document.addEventListener('customEvent', handler);
          // No cleanup
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

    it('should properly clean up custom event listener', () => {
      const { unmount } = render(<CustomEventComponent />);

      document.dispatchEvent(new Event('customEvent'));

      unmount();
      // Event listener remains
    });
  });

  // Test 6: Async Operation Leak
  describe('AsyncComponent (Unfixed)', () => {
    const AsyncComponent = () => {
      const [data] = useState(() => new Array(10000).fill('🤖'));
      const [isActive, setIsActive] = useState(true);

      useEffect(
        () => {
          const processData = async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            // No mounted check
            setIsActive(prev => !prev);
            console.log(data.length);
          };

          processData();
          // No cleanup flag
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
      // Async operation continues after unmount
    });
  });
});
