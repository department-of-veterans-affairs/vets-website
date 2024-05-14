import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { mockApiRequest } from 'platform/testing/unit/helpers';

import ConfirmationPdfMessages from '../../components/ConfirmationPdfMessages';

describe('ConfirmationPdfMessages', () => {
  it('should show loading indicator while fetching', () => {
    mockApiRequest({});
    const { container } = render(
      <div>
        <ConfirmationPdfMessages pdfApi="/" />
      </div>,
    );

    const loading = $('va-loading-indicator', container);
    expect(loading).to.exist;
    expect(loading.outerHTML).to.contain('Generating your PDF');
  });

  it('should show loading indicator and warning alert if fetching takes too long', async () => {
    mockApiRequest({});
    const { container } = render(
      <div>
        <ConfirmationPdfMessages pdfApi="/" delayTimer={0} />
      </div>,
    );

    const loading = $('va-loading-indicator', container);
    expect(loading).to.exist;
    expect(loading.outerHTML).to.contain('Generating your PDF');

    await waitFor(() => {
      const alert = $('va-alert[status="warning"]', container);
      expect(alert).to.exist;
      expect(alert.outerHTML).to.contain('taking longer than usual');
    });
  });

  it('should show error message on failed fetch', async () => {
    mockApiRequest({}, false);
    const { container } = render(
      <div>
        <ConfirmationPdfMessages pdfApi="/" delayTimer={0} />
      </div>,
    );

    await waitFor(() => {
      const alert = $('va-alert[status="error"]', container);
      expect(alert).to.exist;
      expect(alert.outerHTML).to.contain(
        'unable to generate a PDF at this time',
      );
    });
  });

  it('should show download link on success', async () => {
    mockApiRequest({ ok: true, data: '' });
    const { container } = render(
      <div>
        <ConfirmationPdfMessages pdfApi="/" />
      </div>,
    );

    await waitFor(() => {
      const link = $('va-link', container);
      expect(link).to.exist;
      expect(link.getAttribute('download')).to.eq('true');
      expect(link.getAttribute('href')).to.contain('/VA10182.pdf');
      expect(link.getAttribute('text')).to.contain(
        'Download a copy of your Board Appeal',
      );
    });
  });
});
