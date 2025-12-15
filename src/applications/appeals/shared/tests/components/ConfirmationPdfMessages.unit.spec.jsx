import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import ConfirmationPdfMessages from '../../components/ConfirmationPdfMessages';

describe('ConfirmationPdfMessages', () => {
  const defaultProps = {
    pdfApi: '/test-api',
    successLinkText: 'Download PDF',
  };

  describe('initial loading state', () => {
    it('should display loading indicator while fetching PDF', () => {
      mockApiRequest({});
      const { container } = render(
        <ConfirmationPdfMessages {...defaultProps} />,
      );

      const loading = $('va-loading-indicator', container);
      const alert = $('va-alert[status="warning"]', container);

      expect(alert).to.not.exist;
      expect(loading).to.exist;
      expect(loading.getAttribute('message')).to.contain('Generating your PDF');
    });
  });

  describe('delayed loading state', () => {
    it('should show warning alert when PDF generation takes too long', async () => {
      mockApiRequest({});
      const { container } = render(
        <ConfirmationPdfMessages {...defaultProps} delayTimer={0} />,
      );

      await waitFor(() => {
        const alert = $('va-alert[status="warning"]', container);
        const loading = $('va-loading-indicator', container);

        expect(loading).to.exist;
        expect(alert).to.exist;
        expect(alert.textContent).to.contain('taking longer than usual');
      });
    });
  });

  describe('error state', () => {
    it('should display error alert when API request fails', async () => {
      mockApiRequest({}, false);
      const { container } = render(
        <ConfirmationPdfMessages {...defaultProps} delayTimer={0} />,
      );

      await waitFor(() => {
        const alert = $('va-alert[status="error"]', container);
        const loading = $('va-loading-indicator', container);

        expect(loading).to.not.exist;
        expect(alert).to.exist;
        expect(alert.textContent).to.contain('unable to generate a PDF');
      });
    });
  });

  describe('success state', () => {
    it('should display download link when PDF is successfully generated', async () => {
      mockApiRequest({ ok: true, data: '/download/test.pdf' });
      const { container } = render(
        <ConfirmationPdfMessages {...defaultProps} />,
      );

      await waitFor(() => {
        const link = $('va-link', container);
        const loading = $('va-loading-indicator', container);

        expect(link).to.exist;
        expect(link.getAttribute('href')).to.eq('/download/test.pdf');
        expect(link.getAttribute('text')).to.eq('Download PDF');
        expect(link.getAttribute('download')).to.exist;
        expect(link.getAttribute('filetype')).to.eq('PDF');
        expect(loading).to.not.exist;
      });
    });

    it('should use default success link text when not provided', async () => {
      mockApiRequest({ ok: true, data: '/download/test.pdf' });
      const { container } = render(
        <ConfirmationPdfMessages pdfApi="/test-api" />,
      );

      await waitFor(() => {
        const link = $('va-link', container);
        expect(link).to.exist;
        expect(link.getAttribute('text')).to.eq(
          'Download a copy of your Board Appeal',
        );
      });
    });

    it('should use custom success link text when provided', async () => {
      const customText = 'Download your appeal form';
      mockApiRequest({ ok: true, data: '/download/test.pdf' });

      const { container } = render(
        <ConfirmationPdfMessages
          {...defaultProps}
          successLinkText={customText}
        />,
      );

      await waitFor(() => {
        const link = $('va-link', container);
        expect(link).to.exist;
        expect(link.getAttribute('text')).to.eq(customText);
      });
    });
  });
});
