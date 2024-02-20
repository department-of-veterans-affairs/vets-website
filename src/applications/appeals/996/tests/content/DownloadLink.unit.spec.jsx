import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import DownloadLink from '../../content/DownloadLink';

describe('DownloadLink', () => {
  const content = 'download and fill out VA Form 20-0996';
  it('should render a link', () => {
    global.window.dataLayer = [];
    const { container } = render(<DownloadLink />);
    const link = $('va-link', container);
    expect(link).to.exist;
    expect(link.getAttribute('filename')).to.eq('VBA-20-0996-ARE.pdf');
    expect(link.getAttribute('text')).to.eq(content);

    fireEvent.click($('va-link', container));
    expect(global.window.dataLayer.length).to.eq(0);
  });
  it('should record click event when inside wizard flow', () => {
    global.window.dataLayer = [];
    const { container } = render(<DownloadLink wizardEvent />);

    fireEvent.click($('va-link', container));
    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'howToWizard-alert-link-click',
      'howToWizard-alert-link-click-label': content,
    });
  });
});
