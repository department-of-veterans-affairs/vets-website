import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import DownloadLink from '../../components/DownloadLink';

describe('DownloadLink', () => {
  it('should render with fileName', () => {
    const { container } = render(
      <DownloadLink
        content="Download VA Form 21-2680"
        size="1.5"
        url="https://test.com/forms/ABC-123.pdf"
      />,
    );

    const link = $('a', container);
    expect(link.getAttribute('download')).to.eq('ABC-123.pdf');
  });

  it('should render with empty fileName', () => {
    const { container } = render(
      <DownloadLink content="Download VA Form 21-2680" size="1.5" />,
    );

    const link = $('a', container);
    expect(link.getAttribute('download')).to.be.empty;
  });
});
