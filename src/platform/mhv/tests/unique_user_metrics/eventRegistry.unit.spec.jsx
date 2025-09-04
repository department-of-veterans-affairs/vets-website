import { expect } from 'chai';
import sinon from 'sinon-v20';
import {
  EVENT_REGISTRY,
  isValidEventKey,
  getEventNames,
} from '../../unique_user_metrics/eventRegistry';

describe('unique_user_metrics eventRegistry', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('EVENT_REGISTRY', () => {
    it('should have all event values as arrays', () => {
      Object.values(EVENT_REGISTRY).forEach(eventValue => {
        expect(eventValue).to.be.an('array');
        expect(eventValue).to.have.length.greaterThan(0);
      });
    });
  });

  it('should have event names within character limit', () => {
    Object.values(EVENT_REGISTRY).forEach(eventArray => {
      eventArray.forEach(eventName => {
        expect(eventName.length).to.be.at.most(50);
        expect(eventName.length).to.be.at.least(1);
      });
    });
  });

  it('should have unique event names across all registry entries', () => {
    const allEventNames = Object.values(EVENT_REGISTRY).flat();
    const uniqueEventNames = [...new Set(allEventNames)];
    expect(allEventNames).to.have.length(uniqueEventNames.length);
  });

  it('should use lowercase with underscores naming convention', () => {
    Object.values(EVENT_REGISTRY).forEach(eventArray => {
      eventArray.forEach(eventName => {
        expect(eventName).to.match(/^[a-z_]+$/);
      });
    });
  });
});

describe('isValidEventKey', () => {
  it('should return true for valid event keys', () => {
    expect(isValidEventKey(Object.keys(EVENT_REGISTRY)[0])).to.be.true;
  });

  it('should return false for invalid event keys', () => {
    expect(isValidEventKey('INVALID_EVENT')).to.be.false;
    expect(isValidEventKey('NOT_IN_REGISTRY')).to.be.false;
    expect(isValidEventKey('')).to.be.false;
    expect(isValidEventKey(null)).to.be.false;
    expect(isValidEventKey(undefined)).to.be.false;
  });

  it('should be case sensitive', () => {
    const firstKey = Object.keys(EVENT_REGISTRY)[0];
    expect(isValidEventKey(firstKey.toLowerCase())).to.be.false;
    expect(
      isValidEventKey(
        firstKey.charAt(0).toUpperCase() + firstKey.slice(1).toLowerCase(),
      ),
    ).to.be.false;
  });

  it('should handle non-string inputs gracefully', () => {
    expect(isValidEventKey(123)).to.be.false;
    expect(isValidEventKey({})).to.be.false;
    expect(isValidEventKey([])).to.be.false;
  });
});

describe('getEventNames', () => {
  it('should return event names array for valid event keys', () => {
    const firstKey = Object.keys(EVENT_REGISTRY)[0];
    const result = getEventNames(firstKey);
    expect(result).to.be.an('array');
    expect(result).to.have.length.greaterThan(0);
    expect(result[0]).to.be.a('string');
  });

  it('should return null for invalid event keys', () => {
    expect(getEventNames('INVALID_EVENT')).to.be.null;
    expect(getEventNames('NOT_IN_REGISTRY')).to.be.null;
    expect(getEventNames('')).to.be.null;
  });

  it('should handle non-string inputs gracefully', () => {
    expect(getEventNames(null)).to.be.null;
    expect(getEventNames(undefined)).to.be.null;
    expect(getEventNames(123)).to.be.null;
    expect(getEventNames({})).to.be.null;
    expect(getEventNames([])).to.be.null;
  });
});
