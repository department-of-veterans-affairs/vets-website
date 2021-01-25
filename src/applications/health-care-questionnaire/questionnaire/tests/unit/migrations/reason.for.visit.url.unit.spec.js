import { expect } from 'chai';

import { updateUrls } from '../../../config/migrations';

describe('health care questionnaire -- migrations -- update route from /reason-for-visit to prepare-for-your-appointment', () => {
  it('should update url', () => {
    const { metadata } = updateUrls({
      formData: {},
      metadata: { returnUrl: '/reason-for-visit' },
    });
    expect(metadata.returnUrl).to.equal('/prepare-for-your-appointment');
  });
});
