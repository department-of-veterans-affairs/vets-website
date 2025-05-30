import { expect } from 'chai';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

describe('22-1919 Form Config', () => {
  it('should render', () => {
    expect(formConfig).to.be.an('object');
  });
  it('should have a required properties', () => {
    expect(formConfig.rootUrl).to.contain(manifest.rootUrl);
    expect(formConfig.title).to.contain(
      'Conflicting interests certification for proprietary schools',
    );
    expect(formConfig).to.have.property('chapters');
  });
});
