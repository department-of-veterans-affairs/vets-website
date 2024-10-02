import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { SecondayCaregiverOneIntro } from '../../../../components/FormDescriptions/SecondayCaregiverIntros';

describe('CG <SecondayCaregiverOneIntro>', () => {
  const getData = ({ primary = false, secondary = undefined }) => ({
    props: {
      formData: {
        'view:hasPrimaryCaregiver': primary,
        'view:hasSecondaryCaregiverOne': secondary,
      },
    },
  });
  const subject = ({ props }) => {
    const { container } = render(<SecondayCaregiverOneIntro {...props} />);
    const selectors = () => ({
      vaAlert: container.querySelector('va-alert'),
    });
    return { selectors };
  };

  it('should not render `va-alert` with prestine form input', () => {
    const { props } = getData({});
    const { selectors } = subject({ props });
    expect(selectors().vaAlert).to.not.exist;
  });

  it('should not render `va-alert` when form data is valid', () => {
    const { props } = getData({ secondary: true });
    const { selectors } = subject({ props });
    expect(selectors().vaAlert).to.not.exist;
  });

  it('should render `va-alert` when form data is invalid', () => {
    const { props } = getData({ primary: false, secondary: false });
    const { selectors } = subject({ props });
    expect(selectors().vaAlert).to.exist;
  });
});
