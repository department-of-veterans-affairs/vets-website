import { expect } from 'chai';
import sinon from 'sinon-v20';
import { EVENT_REGISTRY } from '../../unique_user_metrics/eventRegistry';

describe('unique_user_metrics eventRegistry', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('EVENT_REGISTRY', () => {
    it('should have all event values as strings', () => {
      Object.values(EVENT_REGISTRY).forEach(eventValue => {
        expect(eventValue).to.be.a('string');
        expect(eventValue).to.have.length.greaterThan(0);
      });
    });

    it('should have event names within character limit', () => {
      Object.values(EVENT_REGISTRY).forEach(eventName => {
        expect(eventName.length).to.be.at.most(50);
        expect(eventName.length).to.be.at.least(1);
      });
    });
  });
});
