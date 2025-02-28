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

    // TODO: Uncomment and refactor test below once PR #27092 is merged
    // it('should have a depends function that returns the opposite of view:userIdVerified', () => {
    //   const route = formConfig.additionalRoutes[0];
    //   expect(route.depends).to.be.a('function');

    //   const formData = { 'view:userIdVerified': true };
    //   expect(route.depends(formData)).to.equal(false);

    //   formData['view:userIdVerified'] = false;
    //   expect(route.depends(formData)).to.equal(true);
    // });
  });
});
