import { expect } from 'chai';

import { updateUrls } from '../../../config/migrations';

describe('health care questionnaire -- migrations -- update route from demographics to veteran-information', () => {
  it('should update url', () => {
    const { metadata } = updateUrls({
      formData: {},
      metadata: { returnUrl: '/demographics' },
    });
    expect(metadata.returnUrl).to.equal('/veteran-information');
  });
});
