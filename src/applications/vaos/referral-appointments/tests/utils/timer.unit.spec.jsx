import { expect } from 'chai';

const timerUtil = require('../../utils/timer');

describe('VAOS referral timer util', () => {
  const TEST_ID = '12345';
  const KEY_PREFIX = 'referral_start_time_';
  const TEST_KEY = `${KEY_PREFIX}${TEST_ID}`;

  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  describe('startReferralTimer', () => {
    it('should not set a value if no ID is provided', () => {
      timerUtil.startReferralTimer();
      expect(sessionStorage.length).to.equal(0);
    });

    it('should set the current time in sessionStorage for the given ID', () => {
      timerUtil.startReferralTimer(TEST_ID);

      const storedTime = sessionStorage.getItem(TEST_KEY);
      expect(storedTime).to.be.a('string');
      expect(new Date(storedTime).toISOString()).to.equal(storedTime);
    });

    it('should not overwrite the start time if it already exists', () => {
      const initialTime = new Date(2023, 0, 1).toISOString();
      sessionStorage.setItem(TEST_KEY, initialTime);

      timerUtil.startReferralTimer(TEST_ID);

      const storedTime = sessionStorage.getItem(TEST_KEY);
      expect(storedTime).to.equal(initialTime);
    });
  });

  describe('getReferralElapsedSeconds', () => {
    it('should return 0 if no ID is provided', () => {
      const elapsed = timerUtil.getReferralElapsedSeconds();
      expect(elapsed).to.equal(0);
    });

    it('should return 0 if no start time exists for the given ID', () => {
      const elapsed = timerUtil.getReferralElapsedSeconds(TEST_ID);
      expect(elapsed).to.equal(0);
    });

    it('should return the elapsed seconds since the start time', () => {
      const now = new Date();
      const pastTime = new Date(now.getTime() - 5000).toISOString(); // 5 seconds ago
      sessionStorage.setItem(TEST_KEY, pastTime);

      const elapsed = timerUtil.getReferralElapsedSeconds(TEST_ID);
      expect(elapsed).to.be.closeTo(5, 1); // Allow a small margin of error
    });
  });

  describe('clearReferralTimer', () => {
    it('should not clear anything if no ID is provided', () => {
      const initialTime = new Date(2023, 0, 1).toISOString();
      sessionStorage.setItem(TEST_KEY, initialTime);

      timerUtil.clearReferralTimer();

      const storedTime = sessionStorage.getItem(TEST_KEY);
      expect(storedTime).to.equal(initialTime);
    });

    it('should clear the start time for the given ID', () => {
      const initialTime = new Date(2023, 0, 1).toISOString();
      sessionStorage.setItem(TEST_KEY, initialTime);

      timerUtil.clearReferralTimer(TEST_ID);

      const storedTime = sessionStorage.getItem(TEST_KEY);
      expect(storedTime).to.be.null;
    });

    it('should not affect other keys in sessionStorage', () => {
      const initialTime = new Date(2023, 0, 1).toISOString();
      const otherKey = `${KEY_PREFIX}67890`;
      sessionStorage.setItem(TEST_KEY, initialTime);
      sessionStorage.setItem(otherKey, initialTime);

      timerUtil.clearReferralTimer(TEST_ID);

      const storedOtherTime = sessionStorage.getItem(otherKey);
      expect(storedOtherTime).to.equal(initialTime);
    });
  });
});
