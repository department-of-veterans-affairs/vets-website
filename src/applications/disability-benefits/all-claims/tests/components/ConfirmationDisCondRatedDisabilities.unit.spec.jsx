import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationDisCondRatedDisabilities from '../../components/confirmationFields/ConfirmationDisCondRatedDisabilities';

describe('ConfirmationRatedDisabilities', () => {
  it('should render correctly with selected rated disabilities', () => {
    const formData = {
      ratedDisabilities: [
        { name: 'Condition 1', 'view:selected': true, ratingPercentage: 30 },
        { name: 'Condition 2', 'view:selected': false, ratingPercentage: 50 },
      ],
    };
    const { container, getByText } = render(
      <ConfirmationDisCondRatedDisabilities formData={formData} />,
    );
    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText('Condition 1')).to.exist;
    expect(getByText(/Claiming an increase from current 30% rating/i)).to.exist;
  });

  it('should render nothing when no rated disabilities are selected', () => {
    const formData = {
      ratedDisabilities: [
        { name: 'Condition 1', 'view:selected': false, ratingPercentage: 30 },
        { name: 'Condition 2', 'view:selected': false, ratingPercentage: 50 },
      ],
    };
    const { container } = render(
      <ConfirmationDisCondRatedDisabilities formData={formData} />,
    );
    expect(container.querySelectorAll('h4')).to.have.length(0);
  });

  it('should render nothing when formData is empty', () => {
    const { container } = render(
      <ConfirmationDisCondRatedDisabilities formData={{}} />,
    );
    expect(container.querySelectorAll('h4')).to.have.length(0);
  });

  it('renders fallback text when ratingPercentage is missing', () => {
    const formData = {
      ratedDisabilities: [{ name: 'Condition 1', 'view:selected': true }],
    };

    const { getByText } = render(
      <ConfirmationDisCondRatedDisabilities formData={formData} />,
    );
    expect(getByText(/claiming an increase$/i)).to.exist;
  });

  it('renders the condition date for rated increases coming from newDisabilities', () => {
    const formData = {
      ratedDisabilities: [
        { name: 'Tinnitus', 'view:selected': false, ratingPercentage: 10 },
      ],
      newDisabilities: [
        {
          conditionDate: '1995-01-01',
          ratedDisability: 'Tinnitus',
          cause: 'WORSENED',
          condition: 'Rated Disability',
        },
      ],
    };

    const { getByText } = render(
      <ConfirmationDisCondRatedDisabilities formData={formData} />,
    );

    expect(getByText('Date')).to.exist;
    expect(getByText(/January 1, 1995/i)).to.exist;
  });

  it('does not render "XX" for partial condition dates', () => {
    const formData = {
      ratedDisabilities: [{ name: 'Sciatica', ratingPercentage: 20 }],
      newDisabilities: [
        {
          conditionDate: '2020-06-XX',
          ratedDisability: 'Sciatica',
          cause: 'WORSENED',
          condition: 'Rated Disability',
        },
      ],
    };

    const { container, queryByText } = render(
      <ConfirmationDisCondRatedDisabilities formData={formData} />,
    );

    expect(container.textContent).to.not.include('XX');
    expect(queryByText(/2020/i)).to.exist;
  });

  it('does not render the Date block when conditionDate is missing', () => {
    const formData = {
      ratedDisabilities: [{ name: 'Hypertension', ratingPercentage: 10 }],
      newDisabilities: [
        {
          ratedDisability: 'Hypertension',
          cause: 'WORSENED',
          condition: 'Rated Disability',
        },
      ],
    };

    const { queryByText } = render(
      <ConfirmationDisCondRatedDisabilities formData={formData} />,
    );

    expect(queryByText('Date')).to.equal(null);
  });
});
