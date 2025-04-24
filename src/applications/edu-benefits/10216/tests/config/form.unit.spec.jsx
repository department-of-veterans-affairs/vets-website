import { expect } from 'chai';
import formConfig, { subTitle, submitFormLogic } from '../../config/form';
import manifest from '../../manifest.json';

describe('22-10216 Form Config', () => {
  it('should render', () => {
    expect(formConfig).to.be.an('object');
  });
  it('should test subTitle function', () => {
    const mySubTitle = subTitle();
    expect(mySubTitle).to.not.be.undefined;
  });
  it('should test submitFormLogic function', () => {
    const form = {};
    const submitForm = submitFormLogic(form, formConfig);
    expect(submitForm).to.not.be.undefined;
  });
  it('should have a required properties', () => {
    expect(formConfig.rootUrl).to.contain(manifest.rootUrl);
    expect(formConfig.title).to.contain(
      'Request exemption from the 85/15 Rule reporting requirements',
    );
    expect(formConfig).to.have.property('chapters');
  });
});
