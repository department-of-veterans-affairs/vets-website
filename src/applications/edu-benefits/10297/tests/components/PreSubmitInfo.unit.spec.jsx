import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import PreSubmitInfo from '../../components/PreSubmitInfo';

describe('<PreSubmitInfo />', () => {
  it('should render privacy policy link/button', () => {
    const { container } = render(<PreSubmitInfo />);
    const selector = container.querySelector('va-link');

    expect(selector)
      .to.have.attr('text')
      .to.contain('privacy policy.');
  });

  it('should render modal', () => {
    const { container } = render(<PreSubmitInfo />);
    const selector = container.querySelector('va-modal');

    expect(selector)
      .to.have.attr('large')
      .to.equal('true');
    expect(selector)
      .to.have.attr('modal-title')
      .to.contain('Privacy Act Statement');
  });

  it('should handle onClick event to open modal', () => {
    const { container } = render(<PreSubmitInfo />);
    const button = container.querySelector('va-link');
    const modal = container.querySelector('va-modal');

    expect(modal)
      .to.have.attr('visible')
      .to.equal('false');

    button.click();

    expect(modal)
      .to.have.attr('visible')
      .to.equal('true');
  });
});
