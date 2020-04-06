import sinon from 'sinon';

import {
  mockFetch,
  resetFetch,
  setFetchBlobFailure,
  setFetchBlobResponse,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers';

import fullSchemaVIC from 'vets-json-schema/dist/VIC-schema.json';
import fullFormConfig from '../config/form';
import { submit, prefillTransformer, transform } from '../helpers';

describe('VIC helpers:', () => {
  describe('submit', () => {
    beforeEach(() => {
      window.VetsGov = { pollTimeout: 1 };
      window.URL = {
        createObjectURL: sinon.stub().returns('test'),
      };
    });
    it('should reject if initial request fails', () => {
      mockFetch(new Error('fake error'), false);
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {
          photo: {
            file: new Blob(),
          },
        },
      };

      return submit(form, formConfig).then(
        () => {
          expect.fail();
        },
        err => {
          expect(err.message).toBe('fake error');
        },
      );
    });
    it('should resolve if polling state is success', () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            guid: 'test',
          },
        },
      });
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            state: 'pending',
          },
        },
      });
      const response = {};
      setFetchResponse(global.fetch.onThirdCall(), {
        data: {
          attributes: {
            state: 'success',
            response,
          },
        },
      });
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {
          photo: {
            file: new Blob(),
          },
        },
      };

      return submit(form, formConfig).then(res => {
        expect(res).toEqual({
          photo: 'test',
        });
      });
    });
    it('should reject if polling state is failed', () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            guid: 'test',
          },
        },
      });
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            state: 'pending',
          },
        },
      });
      setFetchResponse(global.fetch.onThirdCall(), {
        data: {
          attributes: {
            state: 'failed',
          },
        },
      });
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {
          photo: {
            file: new Blob(),
          },
        },
      };

      return submit(form, formConfig).then(
        () => {
          expect.fail();
        },
        err => {
          expect(err.message).toBe('vets_server_error_vic: status failed');
        },
      );
    });
    it('should resolve with image request', () => {
      mockFetch();
      setFetchBlobResponse(global.fetch.onFirstCall(), {});
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            guid: 'test',
          },
        },
      });
      setFetchResponse(global.fetch.onThirdCall(), {
        data: {
          attributes: {
            state: 'pending',
          },
        },
      });
      const response = {};
      setFetchResponse(global.fetch.onCall(3), {
        data: {
          attributes: {
            state: 'success',
            response,
          },
        },
      });
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {
          photo: {},
        },
      };

      return submit(form, formConfig).then(res => {
        expect(res).toEqual({
          photo: 'test',
        });
      });
    });
    it('should resolve with failed image request', () => {
      mockFetch();
      setFetchBlobFailure(global.fetch.onFirstCall(), 'Error');
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            guid: 'test',
          },
        },
      });
      const response = {};
      setFetchResponse(global.fetch.onCall(2), {
        data: {
          attributes: {
            state: 'success',
            response,
          },
        },
      });
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {
          photo: {},
        },
      };

      return submit(form, formConfig).then(res => {
        expect(res).toEqual({
          photo: null,
        });
      });
    });

    afterEach(() => {
      resetFetch();
      delete window.URL;
    });
  });
  describe('prefillTransformer', () => {
    it('should do nothing if there is no branch list', () => {
      const formData = {};
      const pages = {};
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);

      expect(result.formData).toBe(formData);
      expect(result.pages).toBe(pages);
      expect(result.metadata).toBe(metadata);
    });
    it('should set serviceBranch to first branch and enum to list', () => {
      const formData = {
        serviceBranches: ['A', 'F'],
      };
      const pages = {
        veteranInformation: {
          schema: {
            properties: {
              serviceBranch: fullSchemaVIC.properties.serviceBranch,
            },
          },
        },
      };
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(
        result.pages.veteranInformation.schema.properties.serviceBranch.enum,
      ).toEqual(formData.serviceBranches);
      expect(result.formData.serviceBranch).toBe(formData.serviceBranches[0]);
      expect(result.formData.serviceBranches).toBeUndefined();
    });
    it('should filter out invalid branches', () => {
      const formData = {
        serviceBranches: ['A', 'B'],
      };
      const pages = {
        veteranInformation: {
          schema: {
            properties: {
              serviceBranch: fullSchemaVIC.properties.serviceBranch,
            },
          },
        },
      };
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(
        result.pages.veteranInformation.schema.properties.serviceBranch.enum,
      ).toEqual(['A']);
      expect(result.formData.serviceBranch).toBe(formData.serviceBranches[0]);
      expect(result.formData.serviceBranches).toBeUndefined();
    });
    it('should leave full list when no valid branches', () => {
      const formData = {
        serviceBranches: ['B'],
      };
      const pages = {
        veteranInformation: {
          schema: {
            properties: {
              serviceBranch: fullSchemaVIC.properties.serviceBranch,
            },
          },
        },
      };
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: [],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(
        result.pages.veteranInformation.schema.properties.serviceBranch.enum,
      ).toEqual(fullSchemaVIC.properties.serviceBranch.enum);
      expect(result.formData.serviceBranch).toBeUndefined();
      expect(result.formData.serviceBranches).toBeUndefined();
    });
    it('should set id proofed flag and original user data', () => {
      const formData = {
        veteranFullName: {
          first: 'Test',
        },
        veteranSocialSecurityNumber: '123456789',
      };
      const pages = {
        veteranInformation: {
          schema: {
            properties: {},
          },
        },
      };
      const metadata = {};
      const state = {
        user: {
          profile: {
            services: ['identity-proofed'],
          },
        },
      };

      const result = prefillTransformer(pages, formData, metadata, state);
      expect(result.formData.processAsIdProofed).toBe(true);
      expect(result.formData.originalUser.veteranFullName).toBe(
        formData.veteranFullName,
      );
      expect(result.formData.originalUser.veteranSocialSecurityNumber).toBe(
        formData.veteranSocialSecurityNumber,
      );
    });
  });
  describe('transform', () => {
    it('should remove identity fields', () => {
      const form = {
        data: {
          processAsIdProofed: true,
          veteranFullName: {
            first: 'Test',
          },
          veteranSocialSecurityNumber: '234',
          originalUser: {
            veteranSocialSecurityNumber: '234',
            veteranFullName: {
              first: 'Test',
            },
          },
        },
      };
      const result = JSON.parse(transform(form, fullFormConfig));

      expect(result.processAsAnonymous).toBe(false);
      expect(result.veteranSocialSecurityNumber).toBeUndefined();
      expect(result.veteranFullName).toBeUndefined();
    });
    it('should process as anonymous if fields are different', () => {
      const form = {
        data: {
          processAsIdProofed: true,
          veteranFullName: {
            first: 'Test1',
          },
          veteranSocialSecurityNumber: '234',
          originalUser: {
            veteranSocialSecurityNumber: '234',
            veteranFullName: {
              first: 'Test',
            },
          },
        },
      };
      const result = JSON.parse(transform(form, fullFormConfig));

      expect(result.processAsAnonymous).toBe(true);
      expect(result.veteranSocialSecurityNumber).not.toBeUndefined();
      expect(result.veteranFullName).not.toBeUndefined();
    });
  });
});
