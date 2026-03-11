import { expect } from 'chai';
import { render } from '@testing-library/react';
import { additionalInfo } from '../../../components/fileInputComponent/AdditionalUploadInfo';

describe('AdditionalUploadInfo', () => {
  it('renders additional info with expected trigger text', () => {
    const { container } = render(additionalInfo);
    const info = container.querySelector('va-additional-info');

    expect(info).to.exist;
    expect(info).to.have.attribute('trigger', 'How to prepare your files');
  });

  it('renders file preparation guidance content', () => {
    const { getByText, container } = render(additionalInfo);

    expect(
      getByText(
        'If your document is digital, make sure it’s one of the accepted file types.',
      ),
    ).to.exist;

    expect(
      getByText(
        'Before you upload your files, make sure they’re saved on the device you’re using to submit this claim. You can do this in 1 of 2 ways:',
      ),
    ).to.exist;

    expect(
      getByText(
        'On a computer connected to a scanner, scan each document and save the file as a PDF.',
      ),
    ).to.exist;

    expect(
      getByText(
        'On a smartphone, take a photo of the document or use a scanning app to save it as a PDF.',
      ),
    ).to.exist;

    expect(container.querySelectorAll('li')).to.have.lengthOf(2);
  });
});
