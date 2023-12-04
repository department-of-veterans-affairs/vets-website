import { expect } from 'chai';

import prefillTransformer from '../../../config/prefill-transformer';
import { PREPARER_TYPES } from '../../../config/constants';

describe('prefillTransformer', () => {
  it('should return the correct transformed data for CITIZEN type', () => {
    const pages = [];
    const formData = { preparerType: PREPARER_TYPES.CITIZEN };
    const metadata = {};

    const result = prefillTransformer(pages, formData, metadata);

    expect(result.formData).to.have.property('citizenId');
    expect(result.formData.citizenId).to.have.property('ssn', '333221111');
  });

  it('should not add citizenId for non-CITIZEN type', () => {
    const pages = [];
    const formData = { preparerType: 'NON_CITIZEN' };
    const metadata = {};

    const result = prefillTransformer(pages, formData, metadata);

    expect(result.formData).to.not.have.property('citizenId');
  });

  it('should correctly copy all properties from formData', () => {
    const pages = [];
    const formData = {
      preparerType: PREPARER_TYPES.CITIZEN,
      extraProp: 'extraValue',
    };
    const metadata = {};

    const result = prefillTransformer(pages, formData, metadata);

    expect(result.formData).to.have.property('extraProp', 'extraValue');
  });

  it('should correctly copy all properties from metadata', () => {
    const pages = [];
    const formData = { preparerType: PREPARER_TYPES.CITIZEN };
    const metadata = { extraMeta: 'extraValue' };

    const result = prefillTransformer(pages, formData, metadata);

    expect(result.metadata).to.have.property('extraMeta', 'extraValue');
  });
});
