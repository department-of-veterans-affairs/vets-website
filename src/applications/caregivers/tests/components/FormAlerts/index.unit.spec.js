import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  GeneralErrorAlert,
  SecondaryRequiredAlert,
} from '../../../components/FormAlerts';

describe('CG <GeneralErrorAlert>', () => {
  it('should render', () => {
    const view = render(<GeneralErrorAlert />);
    const selectors = {
      wrapper: view.container.querySelector('.caregivers-error-message'),
      title: view.container.querySelector('h3'),
      paragraphs: view.container.querySelectorAll('p'),
    };
    expect(selectors.wrapper).to.not.be.empty;
    expect(selectors.title).to.contain.text('Something went wrong');
    expect(selectors.paragraphs).to.have.lengthOf(1);
  });
});

describe('CG <SecondaryRequiredAlert>', () => {
  it('should render', () => {
    const view = render(<SecondaryRequiredAlert />);
    const selectors = {
      title: view.container.querySelector('h3'),
      paragraphs: view.container.querySelectorAll('p'),
    };
    expect(selectors.title).to.contain.text(
      'We need you to add a Family Caregiver',
    );
    expect(selectors.paragraphs).to.have.lengthOf(1);
  });
});
