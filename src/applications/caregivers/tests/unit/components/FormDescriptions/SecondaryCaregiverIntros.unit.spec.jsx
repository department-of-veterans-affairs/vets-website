import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { SecondayCaregiverOneIntro } from '../../../../components/FormDescriptions/SecondayCaregiverIntros';

describe('CG <SecondayCaregiverOneIntro>', () => {
  const subject = ({ primary = false, secondary = undefined } = {}) => {
    const props = {
      formData: {
        'view:hasPrimaryCaregiver': primary,
        'view:hasSecondaryCaregiverOne': secondary,
      },
    };
    const { container } = render(<SecondayCaregiverOneIntro {...props} />);
    const selectors = () => ({
      vaAlert: container.querySelector('va-alert'),
    });
    return { selectors };
  };

  it('should not render `va-alert` with prestine form input', () => {
    const { selectors } = subject();
    expect(selectors().vaAlert).to.not.exist;
  });

  it('should not render `va-alert` when form data is valid', () => {
    const { selectors } = subject({ secondary: true });
    expect(selectors().vaAlert).to.not.exist;
  });

  it('should render `va-alert` when form data is invalid', () => {
    const { selectors } = subject({ primary: false, secondary: false });
    expect(selectors().vaAlert).to.exist;
  });
});
