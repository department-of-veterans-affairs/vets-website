import { expect } from 'chai';
import prefillTransformer from '../../config/prefill-transformer';

describe('prefillTransformer', () => {
  it('is a function', () => {
    expect(prefillTransformer).to.be.a('function');
  });

  it('transforms veteran information correctly', () => {
    const pages = { page1: {}, page2: {} };
    const formData = {
      veteranInformation: {
        fileNumber: '123456789',
        ssn: '987654321',
      },
    };
    const metadata = { test: 'metadata' };

    const result = prefillTransformer(pages, formData, metadata);

    expect(result).to.be.an('object');
    expect(result.pages).to.equal(pages);
    expect(result.metadata).to.equal(metadata);
    expect(result.formData).to.be.an('object');
    expect(result.formData.veteranInformation).to.exist;
    expect(result.formData.veteranInformation.ssnLastFour).to.equal(
      '987654321',
    );
    expect(result.formData.veteranInformation.vaFileLastFour).to.equal(
      '123456789',
    );
  });

  it('handles missing veteran information gracefully', () => {
    const pages = { page1: {} };
    const formData = {};
    const metadata = {};

    const result = prefillTransformer(pages, formData, metadata);

    expect(result.formData.veteranInformation.ssnLastFour).to.equal('');
    expect(result.formData.veteranInformation.vaFileLastFour).to.equal('');
  });

  it('handles null formData gracefully', () => {
    const pages = { page1: {} };
    const formData = null;
    const metadata = {};

    const result = prefillTransformer(pages, formData, metadata);

    expect(result.formData.veteranInformation.ssnLastFour).to.equal('');
    expect(result.formData.veteranInformation.vaFileLastFour).to.equal('');
  });

  it('handles undefined veteranInformation gracefully', () => {
    const pages = { page1: {} };
    const formData = { otherData: 'test' };
    const metadata = {};

    const result = prefillTransformer(pages, formData, metadata);

    expect(result.formData.veteranInformation.ssnLastFour).to.equal('');
    expect(result.formData.veteranInformation.vaFileLastFour).to.equal('');
  });

  it('handles partial veteran information', () => {
    const pages = { page1: {} };
    const formData = {
      veteranInformation: {
        fileNumber: '123456789',
        // ssn missing
      },
    };
    const metadata = {};

    const result = prefillTransformer(pages, formData, metadata);

    expect(result.formData.veteranInformation.ssnLastFour).to.equal('');
    expect(result.formData.veteranInformation.vaFileLastFour).to.equal(
      '123456789',
    );
  });

  it('preserves pages and metadata unchanged', () => {
    const pages = {
      page1: { title: 'Page 1' },
      page2: { title: 'Page 2' },
    };
    const formData = {
      veteranInformation: {
        fileNumber: '123',
        ssn: '456',
      },
    };
    const metadata = {
      version: 1,
      timestamp: '2023-01-01',
    };

    const result = prefillTransformer(pages, formData, metadata);

    expect(result.pages).to.deep.equal(pages);
    expect(result.metadata).to.deep.equal(metadata);
  });

  it('only extracts ssn and fileNumber from veteranInformation', () => {
    const pages = {};
    const formData = {
      veteranInformation: {
        fileNumber: '123456789',
        ssn: '987654321',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
    };
    const metadata = {};

    const result = prefillTransformer(pages, formData, metadata);

    expect(result.formData.veteranInformation).to.have.keys([
      'ssnLastFour',
      'vaFileLastFour',
    ]);
    expect(result.formData.veteranInformation.ssnLastFour).to.equal(
      '987654321',
    );
    expect(result.formData.veteranInformation.vaFileLastFour).to.equal(
      '123456789',
    );
  });
});
