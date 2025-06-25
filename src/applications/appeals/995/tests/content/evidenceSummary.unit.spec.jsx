import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { content } from '../../content/evidenceSummary';

describe('evidenceSummary', () => {
  it('should render an h5 on the review page', () => {
    global.window.location.href = '/review-and-submit';
    const { getByRole } = render(<div>{content.addMoreLink()}</div>);
    expect(getByRole('heading').tagName).to.eq('H5');
  });
});
