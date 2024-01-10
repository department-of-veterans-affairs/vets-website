import { expect } from 'chai';
import formConfig from '../../../config/form';

describe('formConfig', () => {
  let isLocalhostStub;

  beforeEach(() => {
    delete require.cache[require.resolve('../../../config/form')];
  });

  afterEach(() => {
    if (isLocalhostStub) {
      isLocalhostStub.restore();
    }
  });
  it('should be an object', () => {
    expect(formConfig).to.be.an('object');
  });

  it('should have a rootUrl property', () => {
    expect(formConfig).to.have.property('rootUrl');
    expect(formConfig.rootUrl).to.be.a('string');
  });

  // Add more tests for other properties...

  describe('chapters', () => {
    it('should be an object', () => {
      expect(formConfig.chapters).to.be.an('object');
    });
  });
});
