import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CheckUploadWarning from '../../../../components/FormAlerts/CheckUploadWarning';

describe('CG <CheckUploadWarning>', () => {
  it('should render', () => {
    const view = render(<CheckUploadWarning />);
    const selectors = {
      wrapper: view.container.querySelector('.caregivers-upload-warning'),
      title: view.container.querySelector('h3'),
      paragraphs: view.container.querySelectorAll('p'),
    };
    expect(selectors.wrapper).to.not.be.empty;
    expect(selectors.title).to.contain.text(
      'Check your upload before you continue',
    );
    expect(selectors.paragraphs).to.have.lengthOf(2);
  });
});
