import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom-v5-compat';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ComplexClaimSubmitFlowWrapper from '../../containers/ComplexClaimSubmitFlowWrapper';

describe('ComplexClaimSubmitFlowWrapper', () => {
  const renderWithRouter = (appointmentId = '12345') => {
    return render(
      <MemoryRouter initialEntries={[`/confirmation/${appointmentId}`]}>
        <Routes>
          <Route
            path="/confirmation/:apptId"
            element={<ComplexClaimSubmitFlowWrapper />}
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('renders the component with correct structure', () => {
    renderWithRouter();

    expect($('article.usa-grid-full')).to.exist;
    expect($('.vads-l-col--12.medium-screen\\:vads-l-col--8')).to.exist;
  });

  it('renders the back link with correct href and text', () => {
    renderWithRouter('12345');

    const backLink = $('va-link[back][data-testid="complex-claim-back-link"]');
    expect(backLink).to.exist;
    expect(backLink.getAttribute('href')).to.equal(
      '/my-health/appointments/past/12345',
    );
    expect(backLink.getAttribute('text')).to.equal('Back to your appointment');
    expect(backLink.hasAttribute('disable-analytics')).to.be.true;
  });

  it('renders the ConfirmationPage component', () => {
    const screen = renderWithRouter();

    expect(screen.getByRole('heading', { level: 1 })).to.exist;
  });

  it('handles different appointment IDs in the URL', () => {
    renderWithRouter('67890');

    const backLink = $('va-link[data-testid="complex-claim-back-link"]');
    expect(backLink.getAttribute('href')).to.equal(
      '/my-health/appointments/past/67890',
    );
  });

  it('renders with proper scroll element name', () => {
    renderWithRouter();

    expect($('[name="topScrollElement"]')).to.exist;
  });

  it('applies correct CSS classes for layout', () => {
    renderWithRouter();

    const article = $('article');
    expect(article.classList.contains('usa-grid-full')).to.be.true;
    expect(article.classList.contains('vads-u-margin-bottom--0')).to.be.true;

    const paddingContainer = $(
      '.vads-u-padding-top--2p5.vads-u-padding-bottom--4',
    );
    expect(paddingContainer).to.exist;

    const contentColumn = $('.vads-l-col--12.medium-screen\\:vads-l-col--8');
    expect(contentColumn).to.exist;
  });

  describe('URL parameter extraction', () => {
    it('extracts apptId from URL params correctly', () => {
      // Test that the component can handle various appointment ID formats
      const testCases = ['abc123', '12345-67890', 'uuid-format-12345'];

      testCases.forEach(expectedId => {
        // Create a fresh render for each test case
        const { container } = renderWithRouter(expectedId);

        const backLink = container.querySelector(
          'va-link[data-testid="complex-claim-back-link"]',
        );
        expect(backLink.getAttribute('href')).to.equal(
          `/my-health/appointments/past/${expectedId}`,
        );
      });
    });
  });
});
