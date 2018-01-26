import { expect } from 'chai';

import { prefillTransform } from '../../../src/js/vic-v2/helpers';

describe('VIC v2 helpers', () => {
  describe('prefillTransform', () => {
    it('should do nothing if there is no branch list', () => {
      const formData = {};
      const pages = {};
      const metadata = {};

      const result = prefillTransform(pages, formData, metadata);

      expect(result.formData).to.equal(formData);
      expect(result.pages).to.equal(pages);
      expect(result.metadata).to.equal(metadata);
    });
    it('should set serviceBranch to first branch and enum to list', () => {
      const formData = {
        serviceBranches: ['A', 'B']
      };
      const pages = {};
      const metadata = {};

      const result = prefillTransform(pages, formData, metadata);
      expect(result.pages.veteranInformation.schema.properties.serviceBranch.enum)
        .to.equal(formData.serviceBranches);
      expect(result.formData.serviceBranch).to.equal(formData.serviceBranches[0]);
    });
  });
});
