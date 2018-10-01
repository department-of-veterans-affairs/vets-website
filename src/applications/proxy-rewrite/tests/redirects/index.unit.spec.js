import { expect } from 'chai';

import redirectIfNecessary from '../../redirects';

describe('Redirect replaced pages', () => {
  it('should redirect when page matches', () => {

    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/homeloans/'
      }
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href.endsWith('.gov/housing-assistance/')).to.be.true;
  });

  it('should not redirect when there are no matches', () => {
    const fakeWindow = {
      location: {
        host: 'www.benefits.va.gov',
        pathname: '/nothing/'
      }
    };

    redirectIfNecessary(fakeWindow);

    expect(fakeWindow.location.href).to.be.undefined;
  });
});
