import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import CustomReviewTopContent from '../../components/CustomReviewTopContent';

describe('22-10272 <CustomReviewTopContent />', () => {
  it('renders custom review top content/header', () => {
    const { container } = render(<CustomReviewTopContent />);
    const topContent = container.querySelector('h3');

    expect(topContent).to.exist;
    expect(topContent.innerHTML).to.contain('Review your request');
  });
});
