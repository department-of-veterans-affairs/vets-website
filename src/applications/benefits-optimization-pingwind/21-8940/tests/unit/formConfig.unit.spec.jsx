import formConfig from '../../config/form';
import { expect } from 'chai';

describe('21-8940 form config', () => {
  it('should have correct formId and title', () => {
    expect(formConfig.formId).to.equal('21-8940');
    expect(formConfig.title).to.match(
      /Veteran's application for increased compensation/i,
    );
  });

  it('should define chapters', () => {
    expect(formConfig.chapters).to.be.an('object');
    expect(Object.keys(formConfig.chapters).length).to.be.greaterThan(5);
  });

  it('should include a transformForSubmit function', () => {
    expect(formConfig.transformForSubmit).to.be.a('function');
  });

  it('should have saveInProgress messages', () => {
    expect(formConfig.saveInProgress?.messages?.inProgress).to.be.a('string');
  });

  it('should have introduction and confirmation containers', () => {
    expect(formConfig.introduction).to.exist;
    expect(formConfig.confirmation).to.exist;
  });
});
