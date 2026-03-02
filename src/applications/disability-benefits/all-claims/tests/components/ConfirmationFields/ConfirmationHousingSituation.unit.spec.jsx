import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ConfirmationHousingSituation from '../../../components/confirmationFields/ConfirmationHousingSituation';

const formData = {
  homelessOrAtRisk: 'homeless',
  homelessnessContact: {
    name: 'John Doe',
    phoneNumber: '555-123-4567',
  },
  'view:isHomeless': {
    homelessHousingSituation: 'anotherPerson',
    needToLeaveHousing: true,
    otherHomelessHousing: undefined,
  },
  'view:isAtRisk': {
    homelessHousingSituation: 'other',
    needToLeaveHousing: true,
    otherHomelessHousing: 'something else',
  },
};

describe('all-claims <ConfirmationHousingSituation>', () => {
  it('should render without errors', () => {
    const result = render(<ConfirmationHousingSituation formData={formData} />);
    expect(result.getByTestId('housing-situation-responses')).to.exist;
  });

  it('should display homeless housing situation', () => {
    const result = render(<ConfirmationHousingSituation formData={formData} />);
    expect(
      result.getByText(/Are you homeless or at risk of becoming homeless/i),
    ).to.exist;
    expect(result.getByText(/I’m living with another person\./i)).to.exist;
  });

  it('should display need to leave housing response', () => {
    const result = render(<ConfirmationHousingSituation formData={formData} />);
    expect(
      result.getByText(
        /Do you need to quickly leave your current living situation/i,
      ),
    ).to.exist;
    expect(result.getByText(/Yes/i)).to.exist;
  });

  it('should display homelessness contact information', () => {
    const result = render(<ConfirmationHousingSituation formData={formData} />);
    expect(result.getByText(/Name of alternate contact or place: John Doe/i)).to
      .exist;
    expect(
      result.getByText(
        /Phone number of alternate contact or place: 555-123-4567/i,
      ),
    ).to.exist;
  });

  it('should handle missing data gracefully', () => {
    const result = render(<ConfirmationHousingSituation formData={{}} />);
    expect(result.getByTestId('housing-situation-responses')).to.exist;
  });
});
