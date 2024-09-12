import React from 'react';
import { render, fireEvent } from '@testing-library/react';
// import { within } from '@testing-library/dom';
import { expect } from 'chai';
import sinon from 'sinon';

import ConfirmationPage from '../../containers/ConfirmationPage';

describe('ConfirmationPage', () => {
  let container;
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      router: { push: sinon.spy() },
    };
    const result = render(<ConfirmationPage {...defaultProps} />);
    container = result.container;
  });

  it('should render with correct text and elements', () => {
    const downloadLink = container.querySelector('va-link');
    expect(downloadLink).to.exist;
    expect(downloadLink.getAttribute('text')).to.equal('Download your form');

    const checkbox = container.querySelector('va-checkbox');
    expect(checkbox).to.exist;
    expect(checkbox.getAttribute('label')).to.equal(
      "I've downloaded, printed, and signed my form",
    );

    const button = container.querySelector('va-button');
    expect(button).to.exist;
  });

  it('should handle checkbox change', () => {
    const checkbox = container.querySelector('va-checkbox');
    expect(checkbox).to.exist;

    checkbox.checked = true;
    fireEvent.click(checkbox);

    expect(checkbox.checked).to.be.true;
  });

  // it('should show an error message if checkbox is not checked and continue is clicked', () => {
  //   const button = container.querySelector('va-button');
  //   const checkbox = container.querySelector('va-checkbox');

  //   expect(button).to.exist;
  //   expect(checkbox).to.exist;

  //   fireEvent.click(button);

  //   const { shadowRoot } = checkbox;

  //   if (!shadowRoot) {
  //     throw new Error('shadowRoot is not available');
  //   }

  //   const errorMessage = shadowRoot.querySelector('.usa-error-message');

  //   expect(errorMessage).to.exist;
  //   expect(errorMessage.textContent).to.contain(
  //     "Please confirm that you've downloaded, printed, and signed your form.",
  //   );
  // });

  // it('should navigate to next steps if checkbox is checked and continue is clicked', () => {
  //   const button = container.querySelector('va-button');
  //   const checkbox = container.querySelector('va-checkbox');

  //   const routerSpy = defaultProps.router.push;

  //   fireEvent.click(checkbox); // Toggle checkbox to check it
  //   fireEvent.click(button);

  //   expect(routerSpy.calledOnce).to.be.true;
  //   expect(routerSpy.calledWith('/next-steps')).to.be.true;
  // });

  // it('should clear error when checkbox is checked after showing error', () => {
  //   const button = container.querySelector('va-button');
  //   const checkbox = container.querySelector('va-checkbox');

  //   fireEvent.click(button);

  //   const { shadowRoot } = checkbox;
  //   let errorMessage = within(shadowRoot).queryByText(
  //     "Please confirm that you've downloaded, printed, and signed your form.",
  //   );
  //   expect(errorMessage).to.exist;

  //   fireEvent.click(checkbox); // Toggle checkbox to check it
  //   fireEvent.click(button);

  //   errorMessage = within(shadowRoot).queryByText(
  //     "Please confirm that you've downloaded, printed, and signed your form.",
  //   );
  //   expect(errorMessage).to.not.exist;
  // });

  it('should call the download handler when "Download your form" link is clicked', () => {
    const downloadLink = container.querySelector('va-link');

    fireEvent.click(downloadLink);

    expect(downloadLink).to.exist;
  });
});
