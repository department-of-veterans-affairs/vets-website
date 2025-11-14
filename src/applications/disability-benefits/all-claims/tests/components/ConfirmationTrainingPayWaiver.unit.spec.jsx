import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationTrainingPayWaiver from '../../components/confirmationFields/ConfirmationTrainingPayWaiver';

describe('ConfirmationTrainingPayWaiver', () => {
  it('should render correctly when training pay waiver is false', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'Condition 1',
          cause: 'NEW',
          primaryDescription: 'Primary description 1',
        },
        {
          condition: 'Condition 2',
          cause: 'SECONDARY',
          primaryDescription: 'Primary description 2',
          'view:secondaryFollowUp': {
            causedByDisability: 'Condition A',
            causedByDisabilityDescription: 'Caused by description A',
          },
        },
      ],
      hasTrainingPay: true,
      waiveTrainingPay: false,
    };
    const { container, getByText } = render(
      <ConfirmationTrainingPayWaiver formData={formData} />,
    );

    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText('Training pay waiver')).to.exist;
    expect(getByText('Not selected')).to.exist;
    expect(
      getByText(
        /I don’t want to get VA compensation pay for the days I receive training pay/i,
      ),
    ).to.exist;
  });

  it('should render nothing when no training pay is provided', () => {
    const formData = {
      hasTrainingPay: false,
    };
    const { container } = render(
      <ConfirmationTrainingPayWaiver formData={formData} />,
    );
    expect(container.querySelectorAll('h4')).to.have.length(0);
  });

  it('should render when training pay waiver is true', () => {
    const formData = {
      hasTrainingPay: true,
      waiveTrainingPay: true,
    };
    const { container, getByText } = render(
      <ConfirmationTrainingPayWaiver formData={formData} />,
    );
    expect(container.querySelectorAll('h4')).to.have.length(1);
    expect(getByText('Training pay waiver')).to.exist;
    expect(getByText('Selected')).to.exist;
    expect(
      getByText(/I want to get VA compensation pay instead of training pay/i),
    ).to.exist;
  });

  it('should render nothing when formData is empty', () => {
    const formData = {
      newDisabilities: [
        {
          condition: 'Condition 1',
          cause: 'NEW',
          primaryDescription: 'Primary description 1',
        },
      ],
    };
    const { container } = render(
      <ConfirmationTrainingPayWaiver formData={formData} />,
    );

    expect(container.querySelectorAll('h4')).to.have.length(0);
  });
});
