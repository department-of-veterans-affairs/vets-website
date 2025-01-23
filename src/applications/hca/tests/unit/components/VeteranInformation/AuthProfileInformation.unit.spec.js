import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import AuthProfileInformation from '../../../../components/VeteranInformation/AuthProfileInformation';

describe('hca <AuthProfileInformation>', () => {
  const getData = ({ disabilityRating = 30, dob = undefined }) => ({
    props: {
      user: {
        veteranFullName: { first: 'John', middle: null, last: 'Smith' },
        veteranDateOfBirth: dob,
        totalDisabilityRating: disabilityRating,
      },
    },
  });
  const subject = ({ props }) => {
    const { container } = render(<AuthProfileInformation {...props} />);
    const selectors = () => ({
      alert: container.querySelector('va-alert-expandable'),
      vetName: container.querySelector('[data-dd-action-name="Veteran name"]'),
      vetDOB: container.querySelector('[data-dd-action-name="Date of birth"]'),
      disabilityRating: container.querySelector(
        '[data-dd-action-name="Disability rating"]',
      ),
    });
    return { selectors };
  };

  it('should render full name from profile', () => {
    const { props } = getData({});
    const { selectors } = subject({ props });
    const { vetName } = selectors();
    expect(vetName).to.exist;
    expect(vetName).to.contain.text('John Smith');
  });

  it('should render total disability rating from form data', () => {
    const { props } = getData({});
    const { selectors } = subject({ props });
    const { alert, disabilityRating } = selectors();
    expect(alert).to.not.exist;
    expect(disabilityRating).to.exist;
    expect(disabilityRating).to.contain.text('30%');
  });

  it('should render short form alert when disability rating meets the requirement', () => {
    const { props } = getData({ disabilityRating: 80 });
    const { selectors } = subject({ props });
    expect(selectors().alert).to.exist;
  });

  it('should not render birthdate container when profile data omits date of birth value', () => {
    const { props } = getData({});
    const { selectors } = subject({ props });
    expect(selectors().vetDOB).to.not.exist;
  });

  it('should render birthdate container when profile data contains date of birth value', () => {
    const { props } = getData({ dob: '1990-01-01' });
    const { selectors } = subject({ props });
    const { vetDOB } = selectors();
    expect(vetDOB).to.exist;
    expect(vetDOB).to.contain.text('January 01, 1990');
  });
});
