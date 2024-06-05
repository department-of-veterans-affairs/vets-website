import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';

import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import WizardContainer from '../../containers/WizardContainer';
import { WIZARD_STATUS } from '../../constants';

describe('Wizard Container', () => {
  beforeEach(() => {
    sessionStorage.removeItem(WIZARD_STATUS);
  });
  afterEach(() => {
    sessionStorage.removeItem(WIZARD_STATUS);
  });

  it('should render', () => {
    const { container } = render(<WizardContainer />);
    expect($('h1', container)).to.exist;
    expect($('.wizard-container', container)).to.exist;
    expect($('.skip-wizard-link', container)).to.exist;
    expect($('va-need-help', container)).to.exist;
  });
  it('should update wizard status on bypass click', () => {
    const { container } = render(<WizardContainer />);
    fireEvent.click($('.skip-wizard-link', container));
    expect($('.wizard-container', container)).to.exist;
    expect(sessionStorage.getItem(WIZARD_STATUS)).to.equal(
      WIZARD_STATUS_COMPLETE,
    );
  });
});
