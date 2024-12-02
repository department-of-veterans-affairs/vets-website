import { expect } from 'chai';
import {
  getLoginAttempted,
  setLoginAttempted,
  removeLoginAttempted,
} from '../../sso/loginAttempted';

describe('LoginAttempted', () => {
  it('should set/get/remove loginAttempted from localStorage', () => {
    setLoginAttempted();
    expect(getLoginAttempted()).to.eql('true');
    removeLoginAttempted();
    expect(getLoginAttempted()).to.be.null;
  });
});
