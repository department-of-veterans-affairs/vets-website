import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import CopyResultsModal from '../../../components/CopyResultsModal';

describe('<CopyResultsModal>', () => {
  it('renders modal', () => {
    const { container } = render(<CopyResultsModal />);

    expect(container.querySelector('va-button')).to.have.attribute(
      'text',
      'Copy link to results',
    );
  });

  it('copies url when copy button is clicked', async () => {
    const writeText = sinon.mock();
    navigator.clipboard = { writeText };
    sinon.stub(window, 'location').returns({ href: 'test' });
    const { container } = render(<CopyResultsModal />);
    const button = container.querySelector('#copy-your-results');

    fireEvent.click(button);

    await waitFor(() => {
      expect(container.querySelector('#url-input')).to.exist;
    });

    const copyButton = container.querySelector('#copy-button');
    fireEvent.click(copyButton);

    await waitFor(() => {
      const alert = container.querySelector('#copy-alert');
      const alertFocus = container.querySelector('#copy-alert:focus');
      expect(alert).to.exist;
      expect(alertFocus).to.exist;
    });
  });

  it('closes modal', async () => {
    const view = render(<CopyResultsModal />);
    const { container } = view;

    const button = container.querySelector('#copy-your-results');

    fireEvent.click(button);

    await waitFor(() => {
      expect(container.querySelector('#url-input')).to.exist;
    });

    const modal = container.querySelector('#copy-results-modal');

    modal.__events.closeEvent();

    await waitFor(() => {
      const buttonFocus = container.querySelector('#copy-your-results:focus');
      expect(buttonFocus).to.exist;
    });
  });
});
