import { expect } from 'chai';
import sinon from 'sinon-v20';
import { renderHook } from '@testing-library/react-hooks';
import * as recordEvent from 'platform/monitoring/record-event';
import useGeolocationAnalytics, {
  GEOCODE_ERROR_CODES,
} from '../../hooks/useGeolocationAnalytics';

describe('useGeolocationAnalytics hook', () => {
  let recordStub;

  beforeEach(() => {
    recordStub = sinon.stub(recordEvent, 'default');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GEOCODE_ERROR_CODES', () => {
    it('should export error code constants', () => {
      expect(GEOCODE_ERROR_CODES.NONE).to.equal(0);
      expect(GEOCODE_ERROR_CODES.PERMISSION_DENIED).to.equal(1);
      expect(GEOCODE_ERROR_CODES.POSITION_UNAVAILABLE).to.equal(2);
      expect(GEOCODE_ERROR_CODES.TIMEOUT).to.equal(3);
    });
  });

  describe('when geocodeError is 0 (no error)', () => {
    it('should not record any event', () => {
      renderHook(() => useGeolocationAnalytics(0));

      expect(recordStub.called).to.be.false;
    });
  });

  describe('when geocodeError is 1 (permission denied)', () => {
    it('should record permission error event', () => {
      renderHook(() => useGeolocationAnalytics(1));

      expect(recordStub.calledOnce).to.be.true;
      expect(
        recordStub.calledWith({
          event: 'fl-get-geolocation-permission-error',
          'error-key': '1_PERMISSION_DENIED',
        }),
      ).to.be.true;
    });
  });

  describe('when geocodeError is 2 (position unavailable)', () => {
    it('should record other error event with position unavailable key', () => {
      renderHook(() => useGeolocationAnalytics(2));

      expect(recordStub.calledOnce).to.be.true;
      expect(
        recordStub.calledWith({
          event: 'fl-get-geolocation-other-error',
          'error-key': '2_POSITION_UNAVAILABLE',
        }),
      ).to.be.true;
    });
  });

  describe('when geocodeError is 3 or higher (timeout)', () => {
    it('should record other error event with timeout key for code 3', () => {
      renderHook(() => useGeolocationAnalytics(3));

      expect(recordStub.calledOnce).to.be.true;
      expect(
        recordStub.calledWith({
          event: 'fl-get-geolocation-other-error',
          'error-key': '3_TIMEOUT',
        }),
      ).to.be.true;
    });

    it('should record timeout event for any code above 3', () => {
      renderHook(() => useGeolocationAnalytics(99));

      expect(recordStub.calledOnce).to.be.true;
      expect(
        recordStub.calledWith({
          event: 'fl-get-geolocation-other-error',
          'error-key': '3_TIMEOUT',
        }),
      ).to.be.true;
    });
  });

  describe('when geocodeError changes', () => {
    it('should record new event when error code changes', () => {
      const { rerender } = renderHook(
        ({ error }) => useGeolocationAnalytics(error),
        { initialProps: { error: 0 } },
      );

      expect(recordStub.called).to.be.false;

      rerender({ error: 1 });

      expect(recordStub.calledOnce).to.be.true;
      expect(
        recordStub.calledWith({
          event: 'fl-get-geolocation-permission-error',
          'error-key': '1_PERMISSION_DENIED',
        }),
      ).to.be.true;
    });

    it('should not re-record if error code stays the same', () => {
      const { rerender } = renderHook(
        ({ error }) => useGeolocationAnalytics(error),
        { initialProps: { error: 1 } },
      );

      expect(recordStub.calledOnce).to.be.true;

      rerender({ error: 1 });

      // Should still be called only once (no new call)
      expect(recordStub.calledOnce).to.be.true;
    });
  });

  describe('when geocodeError is falsy but not zero', () => {
    it('should not record event for null', () => {
      renderHook(() => useGeolocationAnalytics(null));

      expect(recordStub.called).to.be.false;
    });

    it('should not record event for undefined', () => {
      renderHook(() => useGeolocationAnalytics(undefined));

      expect(recordStub.called).to.be.false;
    });
  });
});
