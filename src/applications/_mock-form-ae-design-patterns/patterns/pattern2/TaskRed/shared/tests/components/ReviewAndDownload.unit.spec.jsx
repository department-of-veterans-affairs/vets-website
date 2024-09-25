import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ReviewAndDownload from '../../components/ReviewAndDownload';

describe('ReviewAndDownload', () => {
  it('should render', () => {
    const { container } = render(<ReviewAndDownload />);

    expect($('h2', container).textContent).to.equal(
      'Review and download your COE',
    );
    const link = $('a', container);
    expect(link.href).to.contain('/resources/how-to-download-and-open-');
    expect(link.textContent).to.contain('instructions for downloading');

    const valink = $('va-link', container);
    expect(valink.getAttribute('href')).to.contain('v0/coe/download_coe');
    expect(valink.getAttribute('filename')).to.contain('v0/coe/download_coe');
    expect(valink.getAttribute('text')).to.contain('Download your COE');
  });
});
