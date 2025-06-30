import { render } from '@testing-library/react';
import { expect } from 'chai';

const {
  MUST_MATCH_ALERT,
  FORM_UPLOAD_OCR_ALERT,
  FORM_UPLOAD_FILE_UPLOADING_ALERT,
} = require('../../../config/constants');

describe('MUST_MATCH_ALERT', () => {
  const textToFind =
    'Since you’re signed in to your account, we prefilled part of your application based on your account details.';

  it('displays prefill text if LOA is 3', () => {
    const formData = { loa: 3 };

    const { queryByText } = render(
      MUST_MATCH_ALERT('fake-variant', () => {}, formData),
    );

    expect(queryByText(textToFind)).to.be.visible;
  });

  it('does not display prefill text if LOA is 3', () => {
    const formData = { loa: 0 };

    const { queryByText } = render(
      MUST_MATCH_ALERT('fake-variant', () => {}, formData),
    );

    expect(queryByText(textToFind)).to.be.null;
  });
});

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
        'Check to make sure the file you uploaded is the official VA Form form-number.',
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
