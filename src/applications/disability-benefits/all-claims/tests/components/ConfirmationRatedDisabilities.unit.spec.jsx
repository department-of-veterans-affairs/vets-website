import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationRatedDisabilities from '../../components/confirmationFields/ConfirmationRatedDisabilities';

describe('ConfirmationRatedDisabilities', () => {
  it('should render correctly with selected rated disabilities', () => {
    const formData = {
      ratedDisabilities: [
        { name: 'Condition 1', 'view:selected': true, ratingPercentage: 30 },
        { name: 'Condition 2', 'view:selected': false, ratingPercentage: 50 },
      ],
    };
    const { container, getByText } = render(
      <ConfirmationRatedDisabilities formData={formData} />,
    );
    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText('Condition 1')).to.exist;
    expect(getByText(/claiming an increase from current 30% rating/i)).to.exist;
  });

  it('should render nothing when no rated disabilities are selected', () => {
    const formData = {
      ratedDisabilities: [
        { name: 'Condition 1', 'view:selected': false, ratingPercentage: 30 },
        { name: 'Condition 2', 'view:selected': false, ratingPercentage: 50 },
      ],
    };
    const { container } = render(
      <ConfirmationRatedDisabilities formData={formData} />,
    );
    expect(container.querySelectorAll('h4')).to.have.length(0);
  });

  it('should render nothing when formData is empty', () => {
    const { container } = render(
      <ConfirmationRatedDisabilities formData={{}} />,
    );
    expect(container.querySelectorAll('h4')).to.have.length(0);
  });
});
