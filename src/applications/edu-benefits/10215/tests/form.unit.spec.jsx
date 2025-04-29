import { expect } from 'chai';
import formConfig from '../config/form';
import manifest from '../manifest.json';

describe('22-10215 - Form Config', () => {
  it('should render', () => {
    expect(formConfig).to.be.an('object');
  });

  it('should have a required property', () => {
    expect(formConfig.rootUrl).contains(manifest.rootUrl);
    expect(formConfig.urlPrefix).contains('/');
    expect(formConfig.title).contains('Report 85/15 Rule enrollment ratios');
    expect(formConfig).to.have.property('chapters');
    expect(formConfig.formId).contains('22-10215');
    expect(formConfig).to.have.property('submit');
    expect(formConfig).to.have.property('saveInProgress');
  });
});
