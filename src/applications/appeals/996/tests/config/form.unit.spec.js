import { expect } from 'chai';
import formConfig from '../../config/form';

describe('formConfig', () => {
  it('check restartFormCallback', () => {
    expect(formConfig.saveInProgress.restartFormCallback()).to.eq('/');
  });

  // increase test coverage
  it('should call depends on additional routes', () => {
    const showStart = formConfig.additionalRoutes[0].depends();
    expect(showStart).to.be.false;
  });
});
