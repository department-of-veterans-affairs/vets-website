import { expect } from 'chai';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

describe('22-0839 Form Config', () => {
  it('should load form config basics', () => {
    expect(formConfig).to.be.an('object');
    expect(formConfig.rootUrl).to.contain(manifest.rootUrl);
    expect(formConfig).to.have.property('chapters');
  });
});
