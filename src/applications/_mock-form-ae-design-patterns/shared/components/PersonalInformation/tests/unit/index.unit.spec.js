import { expect } from 'chai';
import { personalInformationPage } from '../../index';

describe('personalInformationPage', () => {
  const defaultProps = {
    title: 'Test Title',
    path: '/test-path',
    personalInfoConfig: { ssn: true },
    dataAdapter: { ssn: 'veteran.ssn' },
  };

  it('should return an object with the correct keys', () => {
    // a basic test to make sure the forms-system required keys are present
    const result = personalInformationPage(defaultProps);

    expect(result).to.be.an('object');
    expect(result).to.have.property('personalInfoPage');
    expect(result.personalInfoPage).to.have.all.keys([
      'title',
      'path',
      'uiSchema',
      'schema',
      'CustomPage',
      'CustomPageReview',
      'hideOnReview',
    ]);
  });

  it('should use the default values when called without a config object as an argument', () => {
    const result = personalInformationPage();

    expect(result.personalInfoPage.title).to.equal('Personal Information');
    expect(result.personalInfoPage.path).to.equal('/personal-information');
  });

  it('should pass through title and path correctly', () => {
    const result = personalInformationPage(defaultProps);

    expect(result.personalInfoPage.title).to.equal(defaultProps.title);
    expect(result.personalInfoPage.path).to.equal(defaultProps.path);
  });

  it('should have correct schema and uiSchema structure', () => {
    const result = personalInformationPage(defaultProps);

    expect(result.personalInfoPage.schema).to.deep.equal({
      type: 'object',
      properties: {},
    });
    expect(result.personalInfoPage.uiSchema).to.deep.equal({});
  });

  it('should set correct review page related properties', () => {
    const result = personalInformationPage(defaultProps);

    expect(result.personalInfoPage.CustomPageReview).to.be.null;

    // not sure if we need this, but its in the config so we should test it
    expect(result.personalInfoPage.hideOnReview).to.be.true;
  });
});
