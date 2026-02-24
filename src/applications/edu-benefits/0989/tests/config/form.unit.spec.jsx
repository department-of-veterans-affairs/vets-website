import { expect } from 'chai';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

describe('22-0989 Form Config', () => {
  it('should load form config basics', () => {
    expect(formConfig).to.be.an('object');
    expect(formConfig.rootUrl).to.contain(manifest.rootUrl);
    expect(formConfig).to.have.property('chapters');
  });

  it('has the right submit method', async () => {
    const value = await formConfig.submit();
    expect(value.attributes.confirmationNumber).to.eq('123123123');
  });
});
