import { expect } from 'chai';

describe('analytics', () => {
  it('can import recordDatalayerEvent function', () => {
    const { recordDatalayerEvent } = require('../../../utilities/analytics');
    expect(recordDatalayerEvent).to.be.a('function');
  });

  it('can call recordDatalayerEvent without crashing', () => {
    const { recordDatalayerEvent } = require('../../../utilities/analytics');

    const mockEvent = {
      target: {
        dataset: { eventname: 'nav-tab-click' },
        innerText: 'Test Tab',
      },
    };

    // Just test that it doesn't crash when called
    expect(() => {
      recordDatalayerEvent(mockEvent);
    }).to.not.throw();
  });

  it('handles different event types without crashing', () => {
    const { recordDatalayerEvent } = require('../../../utilities/analytics');

    const events = [
      {
        target: {
          dataset: { eventname: 'nav-tab-click' },
          innerText: 'Test Tab',
        },
      },
      {
        target: {
          dataset: { eventname: 'cta-button-click' },
          innerText: 'Click Me',
        },
      },
      {
        target: {
          dataset: { eventname: 'nav-header-sign-in' },
        },
      },
      {
        target: {
          dataset: { eventname: 'custom-event' },
          innerText: 'Custom Text',
          href: 'https://example.com',
        },
      },
    ];

    events.forEach(event => {
      expect(() => {
        recordDatalayerEvent(event);
      }).to.not.throw();
    });
  });

  it('handles switch statement logic paths', () => {
    const { recordDatalayerEvent } = require('../../../utilities/analytics');

    // Test each switch case
    const switchCases = [
      'nav-tab-click',
      'cta-button-click',
      'nav-header-sign-in',
      'nav-header-sign-out',
      'arp-card',
      'int-radio-button-option-click',
      'default-case',
    ];

    switchCases.forEach(eventname => {
      const mockEvent = {
        target: {
          dataset: { eventname },
          innerText: 'Test Text',
          alt: 'Alt Text',
          href: 'https://example.com',
          baseURI: 'https://base.com',
        },
      };

      expect(() => {
        recordDatalayerEvent(mockEvent);
      }).to.not.throw();
    });
  });

  it('handles edge cases', () => {
    const { recordDatalayerEvent } = require('../../../utilities/analytics');

    // Test with missing properties
    const edgeCases = [
      {
        target: {
          dataset: {},
        },
      },
      {
        target: {
          dataset: { eventname: 'test' },
        },
      },
      {
        target: {
          dataset: { eventname: 'test' },
          innerText: null,
        },
      },
    ];

    edgeCases.forEach(event => {
      expect(() => {
        recordDatalayerEvent(event);
      }).to.not.throw();
    });
  });
});
