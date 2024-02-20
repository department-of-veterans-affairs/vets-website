import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import AuthProfileInformation from '../../../../components/VeteranInformation/AuthProfileInformation';

describe('hca AuthProfileInformation', () => {
  const getData = ({ dob = undefined }) => ({
    props: {
      user: {
        userFullName: { first: 'John', middle: null, last: 'Smith' },
        dob,
      },
    },
  });

  context('when the component renders', () => {
    it('should render full name from the user profile', () => {
      const { props } = getData({});
      const { container } = render(<AuthProfileInformation {...props} />);
      const selector = container.querySelector(
        '[data-testid="hca-veteran-fullname"]',
      );
      expect(selector).to.exist;
      expect(selector).to.contain.text('John Smith');
    });
  });

  context('when date of birth is not in the profile data', () => {
    const { props } = getData({});

    it('should only reference `name` in the opening paragraph', () => {
      const { container } = render(<AuthProfileInformation {...props} />);
      const selector = container.querySelector(
        '[data-testid="hca-veteran-profile-intro"]',
      );
      expect(selector).to.contain.text(
        'Here’s the name we have on file for you.',
      );
    });

    it('should not render date of birth container', () => {
      const { container } = render(<AuthProfileInformation {...props} />);
      const selector = container.querySelector(
        '[data-testid="hca-veteran-dob"]',
      );
      expect(selector).to.not.exist;
    });
  });

  context('when date of birth is in the profile data', () => {
    const { props } = getData({ dob: '1990-01-01' });

    it('should reference `personal information` in the opening paragraph', () => {
      const { container } = render(<AuthProfileInformation {...props} />);
      const selector = container.querySelector(
        '[data-testid="hca-veteran-profile-intro"]',
      );
      expect(selector).to.contain.text(
        'This is the personal information we have on file for you.',
      );
    });

    it('should render date of birth container', () => {
      const { container } = render(<AuthProfileInformation {...props} />);
      const selector = container.querySelector(
        '[data-testid="hca-veteran-dob"]',
      );
      expect(selector).to.exist;
      expect(selector).to.contain.text('January 01, 1990');
    });
  });
});
