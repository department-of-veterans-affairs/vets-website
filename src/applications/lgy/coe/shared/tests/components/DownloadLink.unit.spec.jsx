import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import DownloadLink from '../../components/DownloadLink';

describe('DownloadLink', () => {
  it('should render', () => {
    const href = 'va.gov/test';
    const label = 'Test link';
    const { container } = render(<DownloadLink href={href} label={label} />);

    const link = $('a', container);
    expect(link.href).to.contain(href);
    expect(link.textContent).to.equal(label);
  });
});
