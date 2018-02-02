import { expect } from 'chai';

import fullSchemaVIC from 'vets-json-schema/dist/VIC-schema.json';
import { prefillTransformer } from '../../../src/js/vic-v2/helpers';

describe('VIC v2 helpers', () => {
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
