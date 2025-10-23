import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { List } from '../../../components/RatingLists';

const ratings = [
  {
    decision: 'Service Connected',
    diagnosticText: 'Hearing Loss',
    diagnosticTypeName: '6100-Hearing loss',
    effectiveDate: '2005-01-01',
    ratingPercentage: 20,
  },
  {
    decision: 'Service Connected',
    diagnosticText: 'Allergies due to Hearing Loss',
    diagnosticTypeName: 'Limitation of flexion, knee',
    effectiveDate: '2012-05-01',
    ratingPercentage: 100,
  },
  {
    decision: 'Service Connected',
    diagnosticText: 'Sarcoma Soft-Tissue',
    diagnosticTypeName: 'Soft tissue sarcoma (neurogenic origin)',
    effectiveDate: '2018-08-01',
    ratingPercentage: 80,
  },
];

describe('<List>', () => {
  it('should display a list of ratings', () => {
    const screen = render(<List ratings={ratings} />);

    expect(screen.getAllByRole('heading', { level: 4 }).length).to.equal(3);
  });
});
