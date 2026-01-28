import { expect } from 'chai';
import transform from '../../config/prefillTransform';

describe('prefillTransform', () => {
  it('should transform form data correctly', () => {
    const pages = {};
    const metadata = {};
    const formData = {
      applicantName: { first: 'Rita', middle: 'Ann', last: 'Jackson' },
      ssn: '513096784',
      vaFileNumber: '0987654321',
    };

    const { formData: transformedData } = transform(pages, formData, metadata);
    expect(transformedData).to.deep.equal({
      applicantName: { first: 'Rita', middle: 'Ann', last: 'Jackson' },
      vaFileNumber: '513096784',
    });
  });
});
