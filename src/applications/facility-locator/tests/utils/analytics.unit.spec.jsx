import { expect } from 'chai';
import sinon from 'sinon-v20';
import * as recordEvent from 'platform/monitoring/record-event';
import {
  recordMarkerEvents,
  recordPanEvent,
  recordResultClickEvents,
  recordSearchResultsEvents,
  recordZoomEvent,
} from '../../utils/analytics';
import { LocationType } from '../../constants';

describe('analytics utils', () => {
  let recordStub;

  beforeEach(() => {
    recordStub = sinon.stub(recordEvent, 'default');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('recordMarkerEvents', () => {
    it('should not log an event if conditions are not met', () => {
      recordMarkerEvents({
        attributes: {},
      });

      expect(recordStub.called).to.be.false;
    });

    it('should log the correct event', () => {
      const facilityType = 'va_health_facility';
      const classification = 'Other Outpatient Services';
      const name = 'Walzem VA Clinic';
      const distance = 1234;
      const id = '1234';

      recordMarkerEvents({
        attributes: {
          classification,
          name,
          facilityType,
          id,
        },
        distance,
      });

      sinon.assert.calledWith(recordStub, {
        event: 'fl-map-pin-click',
        'fl-facility-type': facilityType,
        'fl-facility-classification': classification,
        'fl-facility-name': name,
        'fl-facility-distance-from-search': distance,
        'fl-facility-id': id,
      });
    });
  });

  describe('recordResultClickEvents', () => {
    it('should not log an event if conditions are not met', () => {
      recordResultClickEvents({
        attributes: {},
      });

      expect(recordStub.called).to.be.false;
    });

    it('should log the correct event', () => {
      const facilityType = 'va_health_facility';
      const classification = 'Other Outpatient Services';
      const name = 'Walzem VA Clinic';
      const currentPage = 1;
      const id = '1234';

      recordResultClickEvents(
        {
          attributes: {
            classification,
            name,
            facilityType,
            id,
          },
          currentPage,
        },
        0,
      );

      sinon.assert.calledWith(recordStub, {
        event: 'fl-results-click',
        'fl-result-page-number': currentPage,
        'fl-result-position': 1,
        'fl-facility-type': facilityType,
        'fl-facility-classification': classification,
        'fl-facility-name': name,
        'fl-facility-id': id,
      });
    });
  });

  describe('recordSearchResultsEvents', () => {
    it('should log the correct event', () => {
      recordSearchResultsEvents(
        {
          currentQuery: null,
          resultTime: null,
          pagination: null,
        },
        null,
      );

      sinon.assert.calledWith(recordStub, {
        event: 'fl-search-results',
      });
    });

    it('should log the correct event', () => {
      recordSearchResultsEvents(
        {
          currentQuery: {
            facilityType: LocationType.HEALTH,
            serviceType: 'health',
            searchString: 'San Antonio, TX',
            mapBoxQuery: {
              placeType: 'address',
              placeName: 'San Antonio, TX',
            },
          },
          resultTime: 3,
          pagination: {
            totalPages: 2,
          },
        },
        [{ distance: 4 }, { distance: 10 }],
      );

      sinon.assert.calledWith(recordStub, {
        event: 'fl-search-results',
        'fl-facility-type-filter': LocationType.HEALTH,
        'fl-service-type-filter': 'health',
        'fl-searched-query': 'San Antonio, TX',
        'fl-mapbox-returned-place-type': 'address',
        'fl-mapbox-returned-place-name': 'San Antonio, TX',
        'fl-results-returned': true,
        'fl-total-number-of-results': 2,
        'fl-closest-result-distance-miles': 4,
        'fl-total-number-of-result-pages': 2,
        'fl-time-to-return-results': 3,
      });
    });
  });

  describe('recordZoomEvent', () => {
    it('should not log an event if conditions are not met', () => {
      recordZoomEvent(90, 90);

      expect(recordStub.called).to.be.false;
    });

    it('should log the correct event', () => {
      recordZoomEvent(90, 100);

      sinon.assert.calledWith(recordStub, {
        event: 'fl-map-zoom-in',
      });
    });

    it('should log the correct event', () => {
      recordZoomEvent(100, 90);

      sinon.assert.calledWith(recordStub, {
        event: 'fl-map-zoom-out',
      });
    });
  });

  describe('recordPanEvent', () => {
    it('should not log an event if conditions are not met', () => {
      const longitude = -98.498222;
      const latitude = 29.6180888;

      recordPanEvent(
        {
          lat: latitude,
          lng: longitude,
        },
        {
          searchArea: {
            locationCoords: {
              lat: latitude,
              lng: longitude,
            },
          },
        },
      );

      expect(recordStub.called).to.be.false;
    });

    it('should log the correct event', () => {
      const longitude = -98.498222;
      const latitude = 29.6180888;
      const newLongitude = -98.273743;
      const newLatitude = 29.9038;

      recordPanEvent(
        {
          lat: latitude,
          lng: longitude,
        },
        {
          searchArea: {
            locationCoords: {
              lat: newLatitude,
              lng: newLongitude,
            },
          },
          searchCoords: {
            lat: newLatitude,
            lng: newLongitude,
          },
        },
      );

      sinon.assert.calledWith(recordStub, {
        event: 'fl-search',
        'fl-map-miles-moved': 23.89672581860898,
      });

      sinon.assert.calledWith(recordStub, {
        'fl-map-miles-moved': undefined,
      });
    });
  });
});
