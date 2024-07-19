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
    expect(result.primaryEOB[0].documentType).to.equal('EOB');
    expect(result.secondaryEOB[0].documentType).to.equal('EOB');
  });
});
