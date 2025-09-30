import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import HowToAttachFiles from '../../components/HowToAttachFiles';

describe('HowToAttachFiles component', () => {
  it('renders with large attachments enabled', () => {
    const screen = render(<HowToAttachFiles useLargeAttachments />);

    // The content is rendered inside va-additional-info
    // Check that the content is present
    expect(screen.getByText('You can attach up to 10 files to each message')).to
      .exist;
    expect(
      screen.getByText(
        /You can attach only these file types: doc, docx, gif, jpg, pdf, png, rtf, txt, xls, xlxs, jpeg, jfif, pjpeg, pjp, bmp, tiff, ppt, pptx, pps, ppsx, odt, mp4, m4v, mov, wmv, mpg/,
      ),
    ).to.exist;
    expect(screen.getByText('The maximum size for each file is 25 MB')).to
      .exist;
    expect(
      screen.getByText(
        'The maximum total size for all files attached to 1 message is 25 MB',
      ),
    ).to.exist;
  });

  it('renders with large attachments disabled', () => {
    const screen = render(<HowToAttachFiles useLargeAttachments={false} />);

    // The content is rendered inside va-additional-info
    // Check that the content is present
    expect(screen.getByText('You may attach up to 4 files to each message')).to
      .exist;
    expect(
      screen.getByText(
        /You can attach only these file types: doc, docx, gif, jpg, pdf, png, rtf, txt, xls, xlsx, jpeg, jfif, pjpeg, pjp/,
      ),
    ).to.exist;
    expect(screen.getByText('The maximum size for each file is 6 MB')).to.exist;
    expect(
      screen.getByText(
        'The maximum total size for all files attached to 1 message is 10 MB',
      ),
    ).to.exist;
  });

  it('renders with default prop (large attachments disabled)', () => {
    const screen = render(<HowToAttachFiles />);

    // The content is rendered inside va-additional-info
    // Check that the content is present
    expect(screen.getByText('You may attach up to 4 files to each message')).to
      .exist;
  });
});
