/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { render, cleanup } from '@testing-library/react';
import sinon from 'sinon';

describe('Severe Memory Leak Test Examples', () => {
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

  // Test 1: Massive Event Listener Leak
  describe('MassiveEventListenerComponent', () => {
    const MassiveEventListenerComponent = () => {
      // Create multiple large arrays
      const [data1] = useState(() => new Array(1000000).fill('🧟‍♂️'));
      const [data2] = useState(() => new Array(1000000).fill('🎃'));
      const [data3] = useState(() => new Array(1000000).fill('👻'));

      useEffect(
        () => {
          // Add multiple event listeners, each capturing large data
          const handlers = ['resize', 'scroll', 'mousemove', 'keyup'].map(
            eventType => {
              const handler = () => {
                // Create new large objects in closure
                const tempData = {
                  array1: [...data1],
                  array2: [...data2],
                  array3: [...data3],
                  timestamp: Date.now(),
                  metadata: new Array(50000).fill('📦'),
                };
                console.log(tempData.array1.length);
              };

              window.addEventListener(eventType, handler);
              return handler;
            },
          );

          // Store handlers globally to prevent GC
          window.leakyHandlers = handlers;
        },
        [data1, data2, data3],
      );

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-visibility--screen-reader">
            Total items: {data1.length + data2.length + data3.length}
          </span>
        </div>
      );
    };

    it('should create massive event listener leaks', () => {
      const { unmount } = render(<MassiveEventListenerComponent />);

      // Trigger multiple events
      ['resize', 'scroll', 'mousemove', 'keyup'].forEach(eventType => {
        window.dispatchEvent(new Event(eventType));
      });

      clock.tick(1000);
      unmount();
    });
  });

  // Test 2: Severe Timer Leak
  // Warning: avg memory usage can be 200+ MB for this test
  describe('SevereTimerComponent', () => {
    const SevereTimerComponent = () => {
      const [data] = useState(() => ({
        array1: new Array(10000).fill('🎭'),
        array2: new Array(10000).fill('🎪'),
        array3: new Array(10000).fill('🎢'),
      }));

      useEffect(
        () => {
          // Create multiple intervals that create and store data
          const intervals = [];

          for (let i = 0; i < 5; i++) {
            const interval = setInterval(() => {
              // Create new large object every interval
              const newData = {
                timestamp: Date.now(),
                arrays: Object.values(data).map(arr => [...arr]),
                metadata: new Array(100000).fill(`🕒${i}`),
              };

              // Store in global array
              if (!window.leakyData) window.leakyData = [];
              window.leakyData.push(newData);
            }, 100 + i * 10);

            intervals.push(interval);
          }

          console.log('intervals', intervals);
        },
        [data],
      );

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-visibility--screen-reader">
            Data size:{' '}
            {Object.values(data).reduce((sum, arr) => sum + arr.length, 0)}
          </span>
        </div>
      );
    };

    it('should create severe timer-based memory leaks', () => {
      const { unmount } = render(<SevereTimerComponent />);

      // Let intervals run multiple times
      for (let i = 0; i < 5; i++) {
        clock.tick(1000);
      }

      unmount();
    });

    afterEach(() => {
      delete window.leakyData;
    });
  });

  // Test 3: Recursive Closure Leak
  // Warning: avg memory usage can be 150+ MB for this test
  describe('RecursiveClosureComponent', () => {
    const RecursiveClosureComponent = () => {
      const [data] = useState(() => new Array(100000).fill('🌀'));

      const createLeakyStructure = (depth = 0) => {
        if (depth > 100) return data;

        return {
          data: [...data],
          child: createLeakyStructure(depth + 1),
          metadata: new Array(100000).fill('🔄'),
        };
      };

      useEffect(
        () => {
          // Create deeply nested structure that references data
          window.leakyStructure = createLeakyStructure();

          // Create recursive timeout that modifies structure
          const createTimeout = () => {
            setTimeout(() => {
              window.leakyStructure.timestamp = Date.now();
              window.leakyStructure.newData = [...data];
              createTimeout(); // Recurse
            }, 100);
          };

          createTimeout();
        },
        [data],
      );

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-visibility--screen-reader">
            Data size: {data.length}
          </span>
        </div>
      );
    };

    it('should create recursive closure leaks', () => {
      const { unmount } = render(<RecursiveClosureComponent />);

      clock.tick(5000);

      unmount();
    });

    afterEach(() => {
      delete window.leakyStructure;
    });
  });

  // Test 4: DOM Reference Chain Leak
  // Warning: avg memory usage can be 50+ MB for this test
  describe('DOMReferenceChainComponent', () => {
    const DOMReferenceChainComponent = () => {
      const [data] = useState(() => ({
        primary: new Array(1000000).fill('🎨'),
        secondary: new Array(1000000).fill('🖼'),
        tertiary: new Array(1000000).fill('🎭'),
      }));

      useEffect(
        () => {
          // Create chain of DOM elements, each with large data
          const createElementChain = count => {
            if (count <= 0) return;

            const element = document.createElement('div');
            element.dataset.leakId = count;

            // Attach large data to DOM element
            element.leakyData = {
              timestamp: Date.now(),
              elementData: { ...data },
              children: new Array(50000).fill('🔗'),
              next: createElementChain(count - 1),
            };

            document.body.appendChild(element);
            // eslint-disable-next-line consistent-return
            return element;
          };

          // Create multiple chains
          for (let i = 0; i < 5; i++) {
            createElementChain(20);
          }
        },
        [data],
      );

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-visibility--screen-reader">
            Total data size:{' '}
            {Object.values(data).reduce((sum, arr) => sum + arr.length, 0)}
          </span>
        </div>
      );
    };

    it('should create DOM reference chain leaks', () => {
      const { unmount } = render(<DOMReferenceChainComponent />);
      clock.tick(1000);
      unmount();
    });
  });

  // Test 5: Event Emitter Cascade Leak
  // Warning: avg memory usage can be 500+ MB for this test
  describe('EventEmitterCascadeComponent', () => {
    const EventEmitterCascadeComponent = () => {
      const [data] = useState(() => ({
        level1: new Array(1000000).fill('🌍'),
        level2: new Array(1000000).fill('🎢'),
        level3: new Array(1000000).fill('🔗'),
      }));

      useEffect(
        () => {
          const eventTypes = [
            'custom1',
            'custom2',
            'custom3',
            'custom4',
            'custom5',
          ];

          // Create cascading event listeners
          eventTypes.forEach((type, index) => {
            const handler = () => {
              // Each handler creates and stores large data
              const leakyData = {
                source: type,
                timestamp: Date.now(),
                data: Object.values(data).map(arr => [...arr]),
                metadata: new Array(100000).fill(`🔊${index}`),
              };

              // Store in global object
              if (!window.leakyEventData) window.leakyEventData = {};
              if (!window.leakyEventData[type])
                window.leakyEventData[type] = [];
              window.leakyEventData[type].push(leakyData);

              // Trigger next event in cascade
              if (index < eventTypes.length - 1) {
                document.dispatchEvent(new Event(eventTypes[index + 1]));
              }
            };

            document.addEventListener(type, handler);
          });

          // Start cascade every second
          setInterval(() => {
            document.dispatchEvent(new Event(eventTypes[0]));
          }, 1000);
        },
        [data],
      );

      return (
        <div className="vads-l-grid-container">
          <span className="vads-u-visibility--screen-reader">
            Total data size:{' '}
            {Object.values(data).reduce((sum, arr) => sum + arr.length, 0)}
          </span>
        </div>
      );
    };

    it('should create cascading event emitter leaks', () => {
      const { unmount } = render(<EventEmitterCascadeComponent />);

      clock.tick(5000);

      unmount();
    });

    afterEach(() => {
      delete window.leakyEventData;
    });
  });
});
