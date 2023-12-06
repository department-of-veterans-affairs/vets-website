import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { homelessReviewField as HomelessRF } from '../../content/homeless';

describe('homelessReviewField', () => {
  it('should return a review row element with a label & value', () => {
    const { container } = render(<HomelessRF>No</HomelessRF>);
    const row = $('.review-row', container);
    expect(row.innerHTML).to.contain('experiencing homelessness?');
    expect(row.innerHTML).to.contain('No');
  });
});
