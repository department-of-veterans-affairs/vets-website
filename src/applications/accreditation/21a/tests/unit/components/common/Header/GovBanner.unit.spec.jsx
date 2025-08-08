import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as monitoring from '~/platform/monitoring/record-event';

import GovBanner from '../../../../../components/common/Header/GovBanner';

describe('GovBanner', () => {
  it('renders and displays the toggle text', () => {
    const { getByTestId } = render(<GovBanner />);
    const bannerText = getByTestId('official-govt-site-text');
    expect(bannerText).to.exist;
    expect(bannerText.textContent).to.equal(
      'An official website of the United States government.',
    );

    const toggleButton = getByTestId('official-govt-site-toggle');
    expect(toggleButton).to.exist;
  });

  it('expands and collapses content when toggle is clicked', () => {
    const recordEventSpy = sinon.spy(monitoring, 'default'); // spy on recordEvent

    const { getByTestId, queryByTestId } = render(<GovBanner />);

    const toggleButton = getByTestId('official-govt-site-toggle');

    fireEvent.click(toggleButton);
    const expandedContent = getByTestId('official-govt-site-content');
    expect(expandedContent).to.exist;
    expect(toggleButton.getAttribute('aria-expanded')).to.equal('true');
    expect(recordEventSpy.calledWith({ event: 'int-accordion-expand' })).to.be
      .true;

    fireEvent.click(toggleButton);
    expect(queryByTestId('official-govt-site-content')).to.not.exist;
    expect(toggleButton.getAttribute('aria-expanded')).to.equal('false');
    expect(recordEventSpy.calledWith({ event: 'int-accordion-collapse' })).to.be
      .true;

    recordEventSpy.restore();
  });
});
