import { render } from '@testing-library/react';
import { expect } from 'chai';

const {
  FORM_UPLOAD_OCR_ALERT,
  FORM_UPLOAD_FILE_UPLOADING_ALERT,
  FORM_UPLOAD_INSTRUCTION_ALERT,
} = require('../../../config/constants');

describe('FORM_UPLOAD_OCR_ALERT', () => {
  it('displays too_many_pages text if too_many_pages is in warnings', () => {
    const { queryByText } = render(
      FORM_UPLOAD_OCR_ALERT('form-number', () => {}, ['too_many_pages']),
    );

    expect(
      queryByText(
        'The file you uploaded has more pages than the form usually has.',
      ),
    ).to.be.visible;
  });

  it('displays too_few_pages text if too_few_pages is in warnings', () => {
    const { queryByText } = render(
      FORM_UPLOAD_OCR_ALERT('form-number', () => {}, ['too_few_pages']),
    );

    expect(
      queryByText(
        'The file you uploaded has fewer pages than the original form.',
      ),
    ).to.be.visible;
  });

  it('displays wrong_form text if wrong_form is in warnings', () => {
    const { queryByText } = render(
      FORM_UPLOAD_OCR_ALERT('form-number', () => {}, ['wrong_form']),
    );

    expect(
      queryByText(
        'The file you uploaded doesn’t look like VA Form form-number. Check to make sure the file uploaded is the official VA form',
      ),
    ).to.be.visible;
  });

  it('displays no warning text if warnings is empty', () => {
    const { queryByText } = render(
      FORM_UPLOAD_OCR_ALERT('form-number', () => {}, []),
    );

    expect(
      queryByText(
        'The file you uploaded has more pages than the form usually has.',
      ),
    ).to.be.null;
    expect(
      queryByText(
        'The file you uploaded has fewer pages than the original form.',
      ),
    ).to.be.null;
    expect(
      queryByText(
        'The file you uploaded doesn’t look like VA Form form-number. Check to make sure the file uploaded is the official VA form',
      ),
    ).to.be.null;
  });
});

describe('FORM_UPLOAD_FILE_UPLOADING_ALERT', () => {
  const textToFind = 'File upload must be complete to continue.';

  it('displays', () => {
    const { queryByText } = render(FORM_UPLOAD_FILE_UPLOADING_ALERT(() => {}));

    expect(queryByText(textToFind)).to.be.visible;
  });
});

describe('FORM_UPLOAD_INSTRUCTION_ALERT', () => {
  it('displays the instruction alert correctly', () => {
    const { queryByText } = render(FORM_UPLOAD_INSTRUCTION_ALERT(() => {}));

    expect(queryByText('Complete and sign your form before you upload')).to.be
      .visible;

    expect(
      queryByText(
        'If you upload a form that’s missing a signature or any other required information, we won’t be able to process it.',
      ),
    ).to.be.visible;
  });
});
