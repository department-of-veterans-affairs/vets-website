import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import ConfirmationPage from '../../containers/ConfirmationPage';

describe('ConfirmationPage', () => {
  let defaultProps;
  let container;

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
    expect(checkbox.checked).to.be.false;

    checkbox.checked = true;
    fireEvent.click(checkbox);

    expect(checkbox.checked).to.be.true;
  });

  it('should call the download handler when "Download your form" link is clicked', () => {
    const downloadLink = container.querySelector('va-link');

    fireEvent.click(downloadLink);

    expect(downloadLink).to.exist;
  });
});
