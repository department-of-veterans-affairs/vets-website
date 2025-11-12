import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import DownloadLink from '../../content/DownloadLink';

describe('DownloadLink', () => {
  const content = 'Download VA Form 20-0995';
  const pdfFileName = 'VBA-20-0995-ARE.pdf';

  it('should render a link', () => {
    global.window.dataLayer = [];
    const { container } = render(<DownloadLink />);
    const link = $('va-link', container);
    expect(link).to.exist;
    expect(link.getAttribute('filename')).to.eq(pdfFileName);
    expect(link.getAttribute('text')).to.eq(content);

    fireEvent.click($('va-link', container));
    expect(global.window.dataLayer.length).to.eq(0);
  });
  it('should record click event when inside subTask flow', () => {
    global.window.dataLayer = [];
    const { container } = render(<DownloadLink subTaskEvent />);

    fireEvent.click($('va-link', container));
    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'howToWizard-alert-link-click',
      'howToWizard-alert-link-click-label': content,
    });
  });
});
