import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import GuestVerifiedInformation from '../../../../components/VeteranInformation/GuestVerifiedInformation';

describe('hca <GuestVerifiedInformation>', () => {
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
  const subject = ({ props }) => {
    const { container } = render(<GuestVerifiedInformation {...props} />);
    const selectors = () => ({
      vetName: container.querySelector('[data-dd-action-name="Veteran name"]'),
      vetDOB: container.querySelector('[data-dd-action-name="Date of birth"]'),
      vetSSN: container.querySelector(
        '[data-dd-action-name="Social Security number"]',
      ),
    });
    return { selectors };
  };

  it('should render full name from form data', () => {
    const { props } = getData();
    const { selectors } = subject({ props });
    const { vetName } = selectors();
    expect(vetName).to.exist;
    expect(vetName).to.contain.text('John Smith');
  });

  it('should render properly-formatted date of birth from form data', () => {
    const { props } = getData();
    const { selectors } = subject({ props });
    const { vetDOB } = selectors();
    expect(vetDOB).to.exist;
    expect(vetDOB).to.contain.text('January 01, 1986');
  });

  it('should render properly-masked social security number from form data', () => {
    const { props } = getData();
    const { selectors } = subject({ props });
    const { vetSSN } = selectors();
    expect(vetSSN).to.exist;
    expect(vetSSN).to.contain.text('●●●–●●–4444');
  });
});
