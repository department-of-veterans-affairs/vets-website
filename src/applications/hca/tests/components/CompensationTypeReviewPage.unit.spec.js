import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import CompensationTypeReviewPage from '../../components/FormReview/CompensationTypeReviewPage';

describe('hca <CompensationTypeReviewPage>', () => {
  it('should render compensation type as no disability', () => {
    const data = { vaCompensationType: 'none' };

    const { getByText } = render(<CompensationTypeReviewPage data={data} />);

    expect(getByText('No')).to.exist;
  });

  it('should render compensation type as low disability', () => {
    const data = { vaCompensationType: 'lowDisability' };

    const { getByText } = render(<CompensationTypeReviewPage data={data} />);

    expect(getByText('Yes (40% or lower rating)')).to.exist;
  });

  it('should render compensation type as high disability', () => {
    const data = { vaCompensationType: 'highDisability' };

    const { getByText } = render(<CompensationTypeReviewPage data={data} />);

    expect(getByText('Yes (50% or higher rating)')).to.exist;
  });
});
