import { expect } from 'chai';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

describe('22-10297 formConfig', () => {
  it('exports an object', () => {
    expect(formConfig).to.be.an('object');
  });

  it('has the correct rootUrl', () => {
    expect(formConfig.rootUrl).to.equal(manifest.rootUrl);
  });

  // it('submit() resolves with the hard-coded confirmation number', async () => {
  //   const result = await formConfig.submit();

  //   expect(result).to.deep.equal({
  //     attributes: { confirmationNumber: '123123123' },
  //   });
  // });
});
