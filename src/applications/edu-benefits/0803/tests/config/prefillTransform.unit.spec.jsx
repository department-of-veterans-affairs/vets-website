import { expect } from 'chai';
import transform from '../../config/prefillTransform';

describe('transform function', () => {
  it('should transform form data correctly', () => {
    const pages = {};
    const metadata = {};
    const formData = {
      applicantName: { first: 'John', last: 'Doe' },
      ssn: '1234567890',
      vaFileNumber: '0987654321',
    };

    const { formData: transformedData } = transform(pages, formData, metadata);
    expect(transformedData).to.deep.equal({
      applicantName: { first: 'John', last: 'Doe' },
      ssn: '1234567890',
      vaFileNumber: '0987654321',
    });
  });
});
