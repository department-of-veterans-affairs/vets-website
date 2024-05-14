import { expect } from 'chai';
import formConfig from '../../config/form';

describe('formConfig', () => {
  it('check restartFormCallback', () => {
    expect(formConfig.saveInProgress.restartFormCallback()).to.eq('/');
  });
});
