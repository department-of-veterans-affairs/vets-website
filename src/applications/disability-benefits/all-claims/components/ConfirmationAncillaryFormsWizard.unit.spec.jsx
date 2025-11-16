import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import ConfirmationAncillaryFormsWizard from './confirmationFields/ConfirmationAncillaryFormsWizard';

describe('ConfirmationAncillaryFormsWizard', () => {
  it('should not render when view:ancillaryFormsWizard is null', () => {
    const formData = {
      'view:ancillaryFormsWizard': null,
    };

    const { container } = render(
      <ConfirmationAncillaryFormsWizard formData={formData} />,
    );
    expect(container).to.be.empty;
  });

  it('should not render when view:ancillaryFormsWizard is undefined', () => {
    const formData = {};

    const { container } = render(
      <ConfirmationAncillaryFormsWizard formData={formData} />,
    );
    expect(container).to.be.empty;
  });

  it('should render all answered questions with their values', () => {
    const formData = {
      'view:ancillaryFormsWizard': true,
      'view:modifyingHome': true,
      'view:modifyingCar': false,
      'view:needsCarHelp': {
        'view:alreadyClaimedVehicleAllowance': true,
      },
      'view:aidAndAttendance': true,
    };

    const { queryByText, queryAllByText } = render(
      <ConfirmationAncillaryFormsWizard formData={formData} />,
    );

    // Check that all questions are rendered
    expect(
      queryByText(
        'Do you want to answer questions to determine if you may be eligible for additional benefits?',
      ),
    ).to.exist;
    expect(queryByText('Do you need help buying or modifying your home?')).to
      .exist;
    expect(queryByText('Do you need help buying or modifying your car?')).to
      .exist;
    expect(queryByText('Have you ever been granted an automobile allowance?'))
      .to.exist;
    expect(
      queryByText(
        'Are you confined to your home or need help with everyday activities?',
      ),
    ).to.exist;

    // Check the answers are correct
    const yesAnswers = queryAllByText('Yes');
    const noAnswers = queryAllByText('No');
    expect(yesAnswers).to.have.lengthOf(4); // Should have 4 'Yes' answers
    expect(noAnswers).to.have.lengthOf(1); // Should have 1 'No' answer
  });
});

it('should only render answered questions', () => {
  const formData = {
    'view:ancillaryFormsWizard': true,
    'view:modifyingHome': true,
    // modifyingCar is undefined
    'view:needsCarHelp': {
      // alreadyClaimedVehicleAllowance is undefined
    },
    'view:aidAndAttendance': false,
  };

  const { queryByText, queryAllByText } = render(
    <ConfirmationAncillaryFormsWizard formData={formData} />,
  );

  // These questions should be rendered
  expect(
    queryByText(
      'Do you want to answer questions to determine if you may be eligible for additional benefits?',
    ),
  ).to.exist;

  expect(queryByText('Do you need help buying or modifying your home?')).to
    .exist;

  expect(
    queryByText(
      'Are you confined to your home or need help with everyday activities?',
    ),
  ).to.exist;

  // These questions should not be rendered
  expect(queryByText('Do you need help buying or modifying your car?')).to.be
    .null;

  expect(queryByText('Have you ever been granted an automobile allowance?')).to
    .be.null;

  // Check the answers
  expect(queryAllByText('Yes')).to.have.lengthOf(2);
  expect(queryAllByText('No')).to.have.lengthOf(1);
});
