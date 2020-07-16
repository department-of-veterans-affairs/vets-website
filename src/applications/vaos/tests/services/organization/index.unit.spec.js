import { expect } from 'chai';
import {
  mockFetch,
  setFetchJSONResponse,
  setFetchJSONFailure,
} from 'platform/testing/unit/helpers';

import {
  getOrganizations,
  getSiteIdFromOrganization,
  getRootOrganization,
  getOrganizationBySiteId,
} from '../../../services/organization';
import facilities from '../../../api/facilities.json';
import mockOrganizations from '../../../services/organization/mock.json';
import { VHA_FHIR_ID } from '../../../utils/constants';

const facilitiesParsed = facilities.data.map(f => ({
  ...f.attributes,
  id: f.id,
}));

describe('VAOS Organization service', () => {
  describe('getOrganizations', () => {
    let data;

    it('should make successful request', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, facilities);
      data = await getOrganizations({ siteIds: ['983', '984'] });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v0/facilities?facility_codes[]=983&facility_codes[]=984',
      );
      expect(data[0].identifier[0].value).to.equal(facilitiesParsed[0].id);
    });

    it('should sort by name', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, facilities);
      data = await getOrganizations({ siteIds: ['983', '984'] });
      expect(data[0].name).to.equal('CHYSHR-Cheyenne VA Medical Center');
      expect(data[1].name).to.equal('DAYTSHR -Dayton VA Medical Center');
      expect(data[2].name).to.equal('Five Digit Station ID Medical Center');
    });

    it('should return OperationOutcome error', async () => {
      mockFetch();
      setFetchJSONFailure(global.fetch, {
        errors: [],
      });

      let error;
      try {
        data = await getOrganizations({ siteIds: ['983', '984'] });
      } catch (e) {
        error = e;
      }

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v0/facilities?facility_codes[]=983&facility_codes[]=984',
      );
      expect(error?.resourceType).to.equal('OperationOutcome');
    });

    it('should make successful request to VSP api', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, mockOrganizations);
      data = await getOrganizations({ siteIds: ['983', '984'], useVSP: true });

      expect(global.fetch.firstCall.args[0]).to.contain(
        '/vaos/v1/Organization?identifier=983,984',
      );
      expect(data.length).to.equal(2);
      expect(data[0].resourceType).to.equal('Organization');
    });

    it('should sort by name', async () => {
      mockFetch();
      setFetchJSONResponse(global.fetch, mockOrganizations);
      data = await getOrganizations({ siteIds: ['983', '984'], useVSP: true });

      expect(data[0].name).to.equal('Cheyenne VA Medical Center');
      expect(data[1].name).to.equal('Dayton VA Medical Center');
    });
  });
  describe('getSiteIdFromOrganization', () => {
    it('should return site id', () => {
      const org = {
        identifier: [
          {
            system: VHA_FHIR_ID,
            value: '983',
          },
        ],
      };
      const siteId = getSiteIdFromOrganization(org, '983');
      expect(siteId).to.equal('983');
    });
  });
  describe('getRootOrganization', () => {
    it('should return root organization if chosen id is not root', () => {
      const orgs = [
        {
          id: 'test',
          partOf: {
            reference: 'Organization/test2',
          },
        },
        {
          id: 'test2',
        },
      ];
      const org = getRootOrganization(orgs, 'test');
      expect(org.id).to.equal('test2');
    });
    it('should return current organization if chosen id is root', () => {
      const orgs = [
        {
          id: 'test',
        },
        {
          id: 'test2',
        },
      ];
      const org = getRootOrganization(orgs, 'test');
      expect(org.id).to.equal('test');
    });
  });
  describe('getOrganizationBySiteId', () => {
    it('should return the organization for a VistA id', () => {
      const orgs = [
        {
          id: 'test',
          identifier: [
            {
              system: VHA_FHIR_ID,
              value: '983',
            },
          ],
        },
      ];
      const org = getOrganizationBySiteId(orgs, '983');
      expect(org.id).to.equal('test');
    });
  });
});
