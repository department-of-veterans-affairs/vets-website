import { expect } from 'chai';
import formConfig from '../../../config/form';
import mockData from '../../e2e/fixtures/data/test-data.json';

import transformForSubmit from '../../../config/submitTransformer';

describe('Submit transformer', () => {
  it('should add the file type to submitted files', () => {
    const result = JSON.parse(transformForSubmit(formConfig, mockData));
    expect(result.medicalUpload[0].documentType).to.equal(
      'itemized billing statement',
    );
    expect(result.primaryEob[0].documentType).to.equal('Eob');
    expect(result.secondaryEob[0].documentType).to.equal('Eob');
  });

  it('should set primary contact name to false if not present', () => {
    const result = JSON.parse(
      transformForSubmit(formConfig, {
        ...mockData,
        certifierName: undefined,
        applicantName: undefined,
      }),
    );
    expect(result.medicalUpload[0].documentType).to.equal(
      'itemized billing statement',
    );
    expect(result.primaryEob[0].documentType).to.equal('Eob');
    expect(result.secondaryEob[0].documentType).to.equal('Eob');
  });

  it('should set primaryContact name to false if none present', () => {
    const result = JSON.parse(
      transformForSubmit(formConfig, {
        data: {
          applicantAddress: { street: '' },
          certifierAddress: { street: '' },
        },
      }),
    );
    expect(result.primaryContactInfo.name).to.be.false;
  });
});
