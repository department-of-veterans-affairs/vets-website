import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import ReviewAndDownload from '../../components/ReviewAndDownload';

describe('ReviewAndDownload', () => {
  it('should render', () => {
    const { container } = render(<ReviewAndDownload />);

    expect($('h2', container).textContent).to.equal(
      'Review and download your COE',
    );
    const links = $$('a', container);
    expect(links[0].href).to.contain('/resources/how-to-download-and-open-');
    expect(links[0].textContent).to.contain('instructions for downloading');
    expect(links[1].href).to.contain('v0/coe/download_coe');
    expect(links[1].textContent).to.contain('Download your COE');
  });
});
