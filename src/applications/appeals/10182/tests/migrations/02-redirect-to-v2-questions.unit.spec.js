import { expect } from 'chai';
import redirectToV2Questions from '../../migrations/02-redirect-to-v2-questions';
import { REDIRECTED_PART3 } from '../../constants';

describe('NOD redirect to v2 questions migration', () => {
  const formData = { foo: 'test' };
  const getSipData = returnUrl => ({
    formData,
    metadata: {
      version: 2,
      returnUrl,
    },
  });

  const redirectedSiP = {
    formData,
    metadata: {
      version: 2,
      [REDIRECTED_PART3]: true,
      returnUrl: '/extension-request',
    },
  };

  it('should not redirect', () => {
    [
      '/veteran-details',
      '/homeless',
      '/contact-information', // don't need to include edit pages
      '/filing-deadlines',
    ].forEach(url => {
      const data = getSipData(url);
      expect(redirectToV2Questions(data)).to.deep.equal(data);
    });
  });

  it('should redirect', () => {
    const issuesPage = getSipData('/contestable-issues');
    expect(redirectToV2Questions(issuesPage)).to.deep.equal(redirectedSiP);
    const reviewPage = getSipData('/review-and-submit');
    expect(redirectToV2Questions(reviewPage)).to.deep.equal(redirectedSiP);
  });
});
