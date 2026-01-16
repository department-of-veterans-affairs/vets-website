import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import {
  parseTTLSeconds,
  shouldShowExpiryAlertAt,
  getAlertTargetTs,
  EXPIRY_ALERT_BUFFER_MS,
} from '../../utils/expiry';

describe('utils/expiry', () => {
  describe('parseTTLSeconds', () => {
    it('returns parsed number when valid positive', () => {
      expect(parseTTLSeconds(3600)).to.equal(3600);
      expect(parseTTLSeconds('1800')).to.equal(1800);
    });

    it('falls back to default when invalid or non-positive', () => {
      expect(parseTTLSeconds(0)).to.equal(3600);
      expect(parseTTLSeconds(-10)).to.equal(3600);
      expect(parseTTLSeconds(undefined)).to.equal(3600);
      expect(parseTTLSeconds('bad')).to.equal(3600);
    });
  });

  describe('shouldShowExpiryAlertAt / getAlertTargetTs', () => {
    it('returns false when expiresAt is nullish', () => {
      expect(shouldShowExpiryAlertAt(null)).to.equal(false);
      expect(shouldShowExpiryAlertAt(undefined)).to.equal(false);
    });

    it('returns false before buffer threshold and true after (using Date.now stub)', () => {
      const realNow = Date.now();
      const nowStub = sinon.stub(Date, 'now').returns(realNow);
      try {
        const expiresAt = realNow + EXPIRY_ALERT_BUFFER_MS + 50; // 50ms past the buffer window
        // Before the alert threshold
        expect(shouldShowExpiryAlertAt(expiresAt)).to.equal(false);

        // Jump to just after the alert threshold
        const afterThreshold = getAlertTargetTs(expiresAt) + 75;
        nowStub.returns(afterThreshold);
        expect(shouldShowExpiryAlertAt(expiresAt)).to.equal(true);
      } finally {
        nowStub.restore();
      }
    });
  });
});
