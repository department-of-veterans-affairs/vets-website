import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
  mockMultipleApiRequests,
} from 'platform/testing/unit/helpers';

import { getLocation } from '../../../services/location';
import { getAvailableHealthCareSystems } from '../../../services/clinics';
import facilities983 from '../../../api/facilities_983.json';
import clinicList983 from '../../../api/clinicList983.json';

describe('VAOS Healthcare service', () => {
  before(() => {
    mockFetch();
    setFetchJSONResponse(global.fetch, clinicList983);
  });

  describe('getAvailableHealthCareSystems', () => {
    it('should make successful request', async () => {
      const data = await getAvailableHealthCareSystems('var983', '123', '456');

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/v0/facilities/983/clinics?type_of_care_id=123&system_id=456',
      );
    });

    it('should set identifier', async () => {
      const data = await getAvailableHealthCareSystems('var983', '123', '456');

      expect(data[0].identifier[0].value).to.equal(
        'urn:va:healthcareservice:983:983:308',
      );
    });

    it('should set primary stop code', async () => {
      const data = await getAvailableHealthCareSystems('var983', '123', '456');

      expect(data[2].serviceType[0].type[0].coding.code).to.equal('323');
    });

    it('should set secondary stop code', async () => {
      const data = await getAvailableHealthCareSystems('var983', '123', '456');

      expect(data[2].serviceType[0].specialty[0].coding.code).to.equal('117');
    });

    it('should set service name to clinic name', async () => {
      const data = await getAvailableHealthCareSystems('var983', '123', '456');

      expect(data[1].serviceName).to.equal('CHY PC CASSIDY');
    });

    it('should set service name to friendly name when present', async () => {
      const data = await getAvailableHealthCareSystems('var983', '123', '456');

      expect(data[0].serviceName).to.equal('Green Team Clinic1');
    });
  });
});
