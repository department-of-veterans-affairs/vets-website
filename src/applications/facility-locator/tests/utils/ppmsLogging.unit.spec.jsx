import { expect } from 'chai';
import sinon from 'sinon-v20';
import * as datadogUtilities from 'platform/monitoring/Datadog/utilities';
import {
  isPpmsDebugEnabled,
  sanitizePpmsResponse,
  logPpmsResponse,
} from '../../utils/ppmsLogging';

describe('ppmsLogging utils', () => {
  describe('isPpmsDebugEnabled', () => {
    let originalLocation;

    beforeEach(() => {
      originalLocation = window.location;
    });

    afterEach(() => {
      // Restore the original location
      delete window.location;
      window.location = originalLocation;
    });

    it('should return false when ppmsDebug param is not present', () => {
      delete window.location;
      window.location = {
        search: '',
      };
      expect(isPpmsDebugEnabled()).to.be.false;
    });

    it('should return false when ppmsDebug param is not "true"', () => {
      delete window.location;
      window.location = {
        search: '?ppmsDebug=false',
      };
      expect(isPpmsDebugEnabled()).to.be.false;
    });

    it('should return true when ppmsDebug=true is in URL', () => {
      delete window.location;
      window.location = {
        search: '?ppmsDebug=true',
      };
      expect(isPpmsDebugEnabled()).to.be.true;
    });

    it('should return true when ppmsDebug=true is among multiple params', () => {
      delete window.location;
      window.location = {
        search: '?address=Seattle&ppmsDebug=true&facilityType=provider',
      };
      expect(isPpmsDebugEnabled()).to.be.true;
    });
  });

  describe('sanitizePpmsResponse', () => {
    it('should return null for null input', () => {
      expect(sanitizePpmsResponse(null)).to.be.null;
    });

    it('should return null for undefined input', () => {
      expect(sanitizePpmsResponse(undefined)).to.be.null;
    });

    it('should preserve meta and links data', () => {
      const response = {
        meta: {
          pagination: {
            currentPage: 1,
            totalPages: 2,
            totalEntries: 15,
          },
        },
        links: {
          self: 'https://api.va.gov/facilities_api/v2/ccp/provider?page=1',
        },
        data: [],
      };

      const sanitized = sanitizePpmsResponse(response);
      expect(sanitized.meta).to.deep.equal(response.meta);
      expect(sanitized.links).to.deep.equal(response.links);
    });

    it('should remove email field from provider attributes', () => {
      const response = {
        data: [
          {
            id: 'abc123',
            type: 'provider',
            attributes: {
              name: 'Test Provider',
              email: 'sensitive@email.com',
              lat: 47.620128,
              long: -122.314793,
            },
          },
        ],
      };

      const sanitized = sanitizePpmsResponse(response);
      expect(sanitized.data[0].attributes.email).to.be.undefined;
      expect(sanitized.data[0].attributes.name).to.equal('Test Provider');
    });

    it('should remove prefContact field from provider attributes', () => {
      const response = {
        data: [
          {
            id: 'abc123',
            type: 'provider',
            attributes: {
              name: 'Test Provider',
              prefContact: 'phone',
              lat: 47.620128,
              long: -122.314793,
            },
          },
        ],
      };

      const sanitized = sanitizePpmsResponse(response);
      expect(sanitized.data[0].attributes.prefContact).to.be.undefined;
    });

    it('should preserve safe provider data', () => {
      const response = {
        data: [
          {
            id: 'provider123',
            type: 'provider',
            attributes: {
              accNewPatients: 'true',
              address: {
                street: '401 N 17TH ST STE 311',
                city: 'ALLENTOWN',
                state: 'PA',
                zip: '18104-5051',
              },
              caresitePhone: '610-969-4470',
              gender: 'Male',
              lat: 40.60274,
              long: -75.494775,
              name: 'BRIGIDO, STEPHEN',
              uniqueId: '1407853336',
              trainings: [],
              email: 'remove@this.com',
              prefContact: 'email',
            },
          },
        ],
        meta: {
          pagination: {
            currentPage: 1,
            totalPages: 1,
          },
        },
      };

      const sanitized = sanitizePpmsResponse(response);
      const provider = sanitized.data[0];

      // Check preserved fields
      expect(provider.id).to.equal('provider123');
      expect(provider.type).to.equal('provider');
      expect(provider.attributes.name).to.equal('BRIGIDO, STEPHEN');
      expect(provider.attributes.address.city).to.equal('ALLENTOWN');
      expect(provider.attributes.lat).to.equal(40.60274);
      expect(provider.attributes.uniqueId).to.equal('1407853336');
      expect(provider.attributes.accNewPatients).to.equal('true');

      // Check removed fields
      expect(provider.attributes.email).to.be.undefined;
      expect(provider.attributes.prefContact).to.be.undefined;
    });

    it('should handle providers without attributes gracefully', () => {
      const response = {
        data: [
          {
            id: 'abc123',
            type: 'provider',
          },
          null,
        ],
      };

      const sanitized = sanitizePpmsResponse(response);
      expect(sanitized.data[0].id).to.equal('abc123');
      expect(sanitized.data[1]).to.be.null;
    });
  });

  describe('logPpmsResponse', () => {
    let dataDogLoggerStub;
    let originalLocation;

    beforeEach(() => {
      dataDogLoggerStub = sinon.stub(datadogUtilities, 'dataDogLogger');
      originalLocation = window.location;
    });

    afterEach(() => {
      sinon.restore();
      delete window.location;
      window.location = originalLocation;
    });

    it('should not log when ppmsDebug is not enabled', () => {
      delete window.location;
      window.location = {
        search: '',
      };

      logPpmsResponse({ data: [] });
      expect(dataDogLoggerStub.called).to.be.false;
    });

    it('should log when ppmsDebug=true is enabled', () => {
      delete window.location;
      window.location = {
        search: '?ppmsDebug=true',
      };

      const response = {
        data: [
          {
            id: 'test123',
            type: 'provider',
            attributes: {
              name: 'Test Provider',
              lat: 47.0,
              long: -122.0,
            },
          },
        ],
        meta: {
          pagination: {
            currentPage: 1,
            totalPages: 1,
          },
        },
      };

      logPpmsResponse(response, {
        locationType: 'provider',
        serviceType: '111N00000X',
        bounds: [-122.5, 46.5, -121.5, 47.5],
        page: 1,
      });

      expect(dataDogLoggerStub.calledOnce).to.be.true;
      const logCall = dataDogLoggerStub.firstCall.args[0];
      expect(logCall.message).to.equal('PPMS Community Care Provider Response');
      expect(logCall.status).to.equal('info');
      expect(logCall.attributes.ppmsDebug).to.be.true;
      expect(logCall.attributes.providerCount).to.equal(1);
      expect(logCall.attributes.locationType).to.equal('provider');
      expect(logCall.attributes.serviceType).to.equal('111N00000X');
    });

    it('should exclude address from search params to avoid PII', () => {
      delete window.location;
      window.location = {
        search: '?ppmsDebug=true',
      };

      logPpmsResponse(
        { data: [] },
        {
          address: '123 Main St, Seattle WA',
          locationType: 'provider',
        },
      );

      expect(dataDogLoggerStub.calledOnce).to.be.true;
      const logCall = dataDogLoggerStub.firstCall.args[0];
      expect(logCall.attributes.address).to.be.undefined;
      expect(logCall.attributes.locationType).to.equal('provider');
    });

    it('should sanitize provider data before logging', () => {
      delete window.location;
      window.location = {
        search: '?ppmsDebug=true',
      };

      const response = {
        data: [
          {
            id: 'test123',
            type: 'provider',
            attributes: {
              name: 'Test Provider',
              email: 'sensitive@email.com',
              prefContact: 'phone',
            },
          },
        ],
      };

      logPpmsResponse(response);

      expect(dataDogLoggerStub.calledOnce).to.be.true;
      const logCall = dataDogLoggerStub.firstCall.args[0];
      const loggedProvider = logCall.attributes.providers[0];
      expect(loggedProvider.attributes.email).to.be.undefined;
      expect(loggedProvider.attributes.prefContact).to.be.undefined;
      expect(loggedProvider.attributes.name).to.equal('Test Provider');
    });
  });
});
