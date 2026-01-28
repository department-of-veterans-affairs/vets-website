import { expect } from 'chai';
import prefillTransformer from '../../../config/prefillTransformer';

describe('10-7959C Prefill Transformer', () => {
  const runTransformer = (metadata, formData = {}, pages = []) =>
    prefillTransformer(pages, formData, metadata);

  it('should remove returnUrl for fresh prefill data', () => {
    const metadata = {
      version: 0,
      prefill: true,
      returnUrl: '/applicant-info',
    };
    const result = runTransformer(metadata);
    expect(result.metadata.returnUrl).to.be.undefined;
    expect(result.metadata.prefill).to.be.true;
    expect(result.metadata.version).to.equal(0);
  });

  it('should preserve returnUrl for saved in-progress data', () => {
    const metadata = {
      version: 0,
      prefill: false,
      returnUrl: '/applicant-info',
    };
    const result = runTransformer(metadata);
    expect(result.metadata.returnUrl).to.equal('/applicant-info');
    expect(result.metadata.prefill).to.be.false;
  });

  it('should preserve returnUrl when prefill is not set', () => {
    const metadata = {
      version: 0,
      returnUrl: '/applicant-info',
    };
    const result = runTransformer(metadata);
    expect(result.metadata.returnUrl).to.equal('/applicant-info');
  });

  it('should return pages and formData unchanged', () => {
    const pages = ['page1', 'page2'];
    const formData = { field1: 'value1', field2: 'value2' };
    const metadata = { version: 0, prefill: true };
    const result = runTransformer(metadata, formData, pages);
    expect(result.pages).to.deep.equal(pages);
    expect(result.formData).to.deep.equal(formData);
  });
});
