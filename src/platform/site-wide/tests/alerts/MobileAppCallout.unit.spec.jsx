import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import MobileAppCallout from '@department-of-veterans-affairs/platform-site-wide/MobileAppCallout';

describe('MobileAppCallout', () => {
  describe('when it exists', () => {
    it('should render mobile app callout correctly with with defaults', () => {
      const view = render(<MobileAppCallout />);
      expect(
        view.queryByText(/Download the VA: Health and Benefits mobile app/i),
      ).to.exist;
      expect(view.queryByText(/App Store/i)).to.exist;
      expect(view.queryByText(/Google Play/i)).to.exist;
    });
    it('should render mobile app callout with with props', () => {
      const view = render(
        <MobileAppCallout
          bodyText="Hello. Here is a body"
          appleAppStoreLinkText="this is an apple link"
          googlePlayStoreLinkText="this is a google link"
          headingText="this is the heading text"
        />,
      );
      expect(view.queryByText(/Hello. Here is a body/)).to.exist;
      expect(view.queryByText(/this is an apple link/)).to.exist;
      expect(view.queryByText(/this is a google link/)).to.exist;
      expect(view.queryByText(/this is the heading text/i)).to.exist;
    });
  });
});
