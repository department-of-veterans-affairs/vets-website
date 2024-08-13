import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import AuthProfileInformation from '../../../../components/VeteranInformation/AuthProfileInformation';

describe('hca <AuthProfileInformation>', () => {
  const getData = ({ dob = undefined }) => ({
    props: {
      user: {
        veteranFullName: { first: 'John', middle: null, last: 'Smith' },
        veteranDateOfBirth: dob,
        totalDisabilityRating: 30,
      },
    },
  });
  const subject = ({ props }) => {
    const { container } = render(<AuthProfileInformation {...props} />);
    const selectors = {
      vetName: container.querySelector('[data-dd-action-name="Veteran name"]'),
      vetDOB: container.querySelector('[data-dd-action-name="Date of birth"]'),
      disabilityRating: container.querySelector(
        '[data-dd-action-name="Disability rating"]',
      ),
    };
    return { selectors };
  };

  it('should render full name from profile', () => {
    const { props } = getData({});
    const { selectors } = subject({ props });
    expect(selectors.vetName).to.exist;
    expect(selectors.vetName).to.contain.text('John Smith');
  });

  it('should render total disability rating from form data', () => {
    const { props } = getData({});
    const { selectors } = subject({ props });
    expect(selectors.disabilityRating).to.exist;
    expect(selectors.disabilityRating).to.contain.text('30%');
  });

  it('should not render birthdate container when profile data omits date of birth value', () => {
    const { props } = getData({});
    const { selectors } = subject({ props });
    expect(selectors.vetDOB).to.not.exist;
  });

  it('should render birthdate container when profile data contains date of birth value', () => {
    const { props } = getData({ dob: '1990-01-01' });
    const { selectors } = subject({ props });
    expect(selectors.vetDOB).to.exist;
    expect(selectors.vetDOB).to.contain.text('January 01, 1990');
  });
});
