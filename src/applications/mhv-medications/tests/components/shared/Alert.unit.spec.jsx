import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import prescriptions from '../../fixtures/prescriptions.json';
import Alert from '../../../components/shared/Alert';
import { ALL_MEDICATIONS_FILTER_KEY } from '../../../util/constants';

describe('Alert', () => {
  const setup = (
    isAlertVisible = true,
    paginatedPrescriptionsList = undefined,
  ) => {
    return render(
      <Alert
        isAlertVisible={isAlertVisible}
        paginatedPrescriptionsList={paginatedPrescriptionsList}
        selectedFilterOption={ALL_MEDICATIONS_FILTER_KEY}
      />,
    );
  };
  it('alert is not visible when isAlertVisible prop is set to false and a prescription list is being sent', () => {
    const screen = setup('false', prescriptions);
    const alertHeadline = screen.queryByText(
      'We can’t access your medications right now',
    );
    expect(alertHeadline).to.not.exist;
  });
  it('displays alert when visibility is set to true ', () => {
    const screen = setup();
    const alertHeadline = screen.getByText(
      'We can’t access your medications right now',
    );
    expect(alertHeadline).to.exist;
  });

  it('displays "You don’t have any medications in your medications list" when medicationsList is empty', () => {
    const screen = setup('true', []);
    const alertHeadline = screen.getByText(
      'You don’t have any medications in your medications list',
    );
    expect(alertHeadline).to.exist;
  });
});
