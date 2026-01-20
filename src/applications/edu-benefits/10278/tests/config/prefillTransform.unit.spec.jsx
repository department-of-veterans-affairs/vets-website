import { expect } from 'chai';
import transform from '../../config/prefillTransform';

describe('prefillTransform function', () => {
  it('should transform form data correctly', () => {
    const pages = {};
    const metadata = {};
    const formData = {
      fullName: { first: 'John', last: 'Doe' },
      ssn: '123456789',
      dateOfBirth: '1990-01-01',
      otherField: 'should be preserved',
    };

    const result = transform(pages, formData, metadata);

    expect(result.formData).to.deep.equal({
      fullName: { first: 'John', last: 'Doe' },
      ssn: '123456789',
      dateOfBirth: '1990-01-01',
      otherField: 'should be preserved',
    });
    expect(result.metadata).to.equal(metadata);
    expect(result.pages).to.equal(pages);
  });

  it('should preserve all form data fields', () => {
    const pages = {};
    const metadata = { test: 'metadata' };
    const formData = {
      fullName: { first: 'Jane', middle: 'A', last: 'Smith' },
      ssn: '987654321',
      dateOfBirth: '1985-05-15',
    };

    const result = transform(pages, formData, metadata);

    expect(result.formData.fullName).to.deep.equal({
      first: 'Jane',
      middle: 'A',
      last: 'Smith',
    });
    expect(result.formData.ssn).to.equal('987654321');
    expect(result.formData.dateOfBirth).to.equal('1985-05-15');
  });

  it('should handle empty form data', () => {
    const pages = {};
    const metadata = {};
    const formData = {};

    const result = transform(pages, formData, metadata);

    expect(result.formData).to.deep.equal({});
    expect(result.metadata).to.equal(metadata);
    expect(result.pages).to.equal(pages);
  });
});
