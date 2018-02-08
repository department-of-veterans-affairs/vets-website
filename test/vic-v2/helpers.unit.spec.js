import { expect } from 'chai';

import { mockFetch, resetFetch } from '../util/unit-helpers.js';

import fullSchemaVIC from 'vets-json-schema/dist/VIC-schema.json';
import { submit, prefillTransformer } from '../../src/js/vic-v2/helpers';

function setFetchResponse(stub, data) {
  const response = new Response();
  response.ok = true;
  response.json = () => Promise.resolve(data);
  stub.resolves(response);
}

describe('VIC helpers:', () => {
  describe('submit', () => {
    beforeEach(() => {
      window.VetsGov = { pollTimeout: 1 };
      window.sessionStorage = { userToken: 'testing' };
    });
    it('should reject if initial request fails', () => {
      mockFetch(new Error('fake error'), false);
      const formConfig = {
        chapters: {}
      };
      const form = {
        data: {}
      };

      return submit(form, formConfig).then(() => {
        expect.fail();
      },
      err => {
        expect(err.message).to.equal('fake error');
      });
    });
    it('should resolve if polling state is success', () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            guid: 'test'
          }
        }
      });
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            state: 'pending'
          }
        }
      });
      const response = {};
      setFetchResponse(global.fetch.onThirdCall(), {
        data: {
          attributes: {
            state: 'success',
            response
          }
        }
      });
      const formConfig = {
        chapters: {}
      };
      const form = {
        data: {}
      };

      return submit(form, formConfig).then((res) => {
        expect(res).to.equal(response);
      });
    });
    it('should reject if polling state is failed', () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            guid: 'test'
          }
        }
      });
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            state: 'pending'
          }
        }
      });
      setFetchResponse(global.fetch.onThirdCall(), {
        data: {
          attributes: {
            state: 'failed'
          }
        }
      });
      const formConfig = {
        chapters: {}
      };
      const form = {
        data: {}
      };

      return submit(form, formConfig).then(() => {
        expect.fail();
      },
      err => {
        expect(err.message).to.equal('vets_server_error_vic: status failed');
      });
    });

    afterEach(() => {
      resetFetch();
    });
  });
  describe('prefillTransformer', () => {
    it('should do nothing if there is no branch list', () => {
      const formData = {};
      const pages = {};
      const metadata = {};

      const result = prefillTransformer(pages, formData, metadata);

      expect(result.formData).to.equal(formData);
      expect(result.pages).to.equal(pages);
      expect(result.metadata).to.equal(metadata);
    });
    it('should set serviceBranch to first branch and enum to list', () => {
      const formData = {
        serviceBranches: ['A', 'F']
      };
      const pages = {
        veteranInformation: {
          schema: {
            properties: {
              serviceBranch: fullSchemaVIC.properties.serviceBranch
            }
          }
        }
      };
      const metadata = {};

      const result = prefillTransformer(pages, formData, metadata);
      expect(result.pages.veteranInformation.schema.properties.serviceBranch.enum)
        .to.deep.equal(formData.serviceBranches);
      expect(result.formData.serviceBranch).to.equal(formData.serviceBranches[0]);
      expect(result.formData.serviceBranches).to.be.undefined;
    });
    it('should filter out invalid branches', () => {
      const formData = {
        serviceBranches: ['A', 'B']
      };
      const pages = {
        veteranInformation: {
          schema: {
            properties: {
              serviceBranch: fullSchemaVIC.properties.serviceBranch
            }
          }
        }
      };
      const metadata = {};

      const result = prefillTransformer(pages, formData, metadata);
      expect(result.pages.veteranInformation.schema.properties.serviceBranch.enum)
        .to.deep.equal(['A']);
      expect(result.formData.serviceBranch).to.equal(formData.serviceBranches[0]);
      expect(result.formData.serviceBranches).to.be.undefined;
    });
    it('should leave full list when no valid branches', () => {
      const formData = {
        serviceBranches: ['B']
      };
      const pages = {
        veteranInformation: {
          schema: {
            properties: {
              serviceBranch: fullSchemaVIC.properties.serviceBranch
            }
          }
        }
      };
      const metadata = {};

      const result = prefillTransformer(pages, formData, metadata);
      expect(result.pages.veteranInformation.schema.properties.serviceBranch.enum)
        .to.deep.equal(fullSchemaVIC.properties.serviceBranch.enum);
      expect(result.formData.serviceBranch).to.be.undefined;
      expect(result.formData.serviceBranches).to.be.undefined;
    });
  });
});
