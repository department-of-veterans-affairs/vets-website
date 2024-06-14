import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import GuestVerifiedInformation from '../../../../components/VeteranInformation/GuestVerifiedInformation';

describe('hca GuestVerifiedInformation', () => {
  const getData = () => ({
    props: {
      user: {
        veteranFullName: {
          first: 'John',
          last: 'Smith',
        },
        veteranDateOfBirth: '1986-01-01',
        veteranSocialSecurityNumber: '211554444',
      },
    },
  });

  context('when the component renders', () => {
    const { props } = getData();

    it('should render full name from props data', () => {
      const { container } = render(<GuestVerifiedInformation {...props} />);
      const selector = container.querySelector(
        '[data-testid="hca-veteran-fullname"]',
      );
      expect(selector).to.exist;
      expect(selector).to.contain.text('John Smith');
    });

    it('should render properly-masked social security number from props data', () => {
      const { container } = render(<GuestVerifiedInformation {...props} />);
      const selector = container.querySelector(
        '[data-testid="hca-veteran-ssn"]',
      );
      expect(selector).to.exist;
      expect(selector).to.contain.text('xxx-xx-4444');
    });

    it('should render properly-formatted date of birth from props data', () => {
      const { container } = render(<GuestVerifiedInformation {...props} />);
      const selector = container.querySelector(
        '[data-testid="hca-veteran-dob"]',
      );
      expect(selector).to.exist;
      expect(selector).to.contain.text('January 01, 1986');
    });
  });
});
