import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import MobileAppCallout from '@department-of-veterans-affairs/platform-site-wide/MobileAppCallout';

describe('MobileAppCallout', () => {
  describe('when it exists', () => {
    it('should render mobile app callout correctly with App Store and Google Play buttons', () => {
      const view = render(<MobileAppCallout />);
      expect(view.queryByText(/your mobile device/i)).to.exist;
      expect(view.queryByText(/App Store/i)).to.exist;
      expect(view.queryByText(/Google Play/i)).to.exist;
    });
  });
});
