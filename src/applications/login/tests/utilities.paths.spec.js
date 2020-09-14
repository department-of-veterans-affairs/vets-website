import { expect } from 'chai';

import { loginAppUrlRE } from 'applications/login/utilities/paths';

describe('loginAppUrlRE', () => {
  it('should resolve to a login app url', () => {
    expect(loginAppUrlRE.test('/sign-in')).to.be.true;
    expect(loginAppUrlRE.test('/sign-in/')).to.be.true;
    expect(loginAppUrlRE.test('/sign-in/verify')).to.be.true;
    expect(loginAppUrlRE.test('/sign-in/verify/')).to.be.true;
  });
  it('should not resolve to a login app url', () => {
    expect(loginAppUrlRE.test('/sign-in-faq')).to.be.false;
    expect(loginAppUrlRE.test('/sign-in-faq/')).to.be.false;
  });
});
