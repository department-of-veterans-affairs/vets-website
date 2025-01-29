import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import ReviewPage from '../../../../components/submit-flow/pages/ReviewPage';

const appointment = require('../../../fixtures/appointment.json');

const homeAddress = {
  addressLine1: '345 Home Address St.',
  addressLine2: 'Apt. 3B',
  addressLine3: null,
  addressPou: 'RESIDENCE/CHOICE',
  addressType: 'DOMESTIC',
  city: 'San Francisco',
  countryName: 'United States',
  countryCodeIso2: 'US',
  countryCodeIso3: 'USA',
  countryCodeFips: null,
  countyCode: null,
  countyName: null,
  internationalPostalCode: null,
  sourceSystemUser: null,
  stateCode: 'CA',
  zipCode: '94118',
};

const onSubmitSpy = sinon.spy();
const setIsAgreementCheckedSpy = sinon.spy();
const setPageIndexSpy = sinon.spy();
const setYesNoSpy = sinon.spy();

describe('Revew page', () => {
  const props = {
    address: homeAddress,
    appointment: appointment.data,
    onSubmit: () => onSubmitSpy(),
    isAgreementChecked: false,
    setIsAgreementChecked: () => setIsAgreementCheckedSpy(),
    setPageIndex: () => setPageIndexSpy(),
    setYesNo: () => setYesNoSpy(),
  };

  it('should render properly with all data', async () => {
    const screen = render(<ReviewPage {...props} />);

    expect(screen.getByText('Review your travel claim')).to.exist;
    expect(screen.findByText(/What you’re claiming/i)).to.exist;
    expect(screen.findByText(/How you traveled/)).to.exist;
    expect(screen.findByText(/Where you traveled from/)).to.exist;
    expect(screen.findByText(/345 Home Address St./i)).to.exist;
    expect(screen.findByText(/Apt. 3B/i)).to.exist;
    expect(
      screen.findByText(/You must accept the beneficiary travel agreement/i),
    ).to.exist;
    // Check that text from the travel agreement is rendering
    expect(screen.findByText(/I have incurred a cost/i)).to.exist;

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    expect(checkbox).to.exist;
    expect(checkbox).to.have.attribute('checked', 'false');

    expect($('va-button-pair')).to.exist;

    await checkbox.__events.vaChange();

    await waitFor(() => {
      expect(setIsAgreementCheckedSpy.called).to.be.true;
    });
  });

  it('should reset page index and answers when start over is pressed', async () => {
    const screen = render(<ReviewPage {...props} />);

    expect(screen.getByText('Review your travel claim')).to.exist;

    $('va-button-pair').__events.secondaryClick(); // start over
    await waitFor(() => {
      expect(setPageIndexSpy.called).to.be.true;
      expect(setYesNoSpy.called).to.be.true;
    });
  });

  it('should not show the error message if the travel agreement is checked', () => {
    const screen = render(<ReviewPage {...props} isAgreementChecked />);

    expect($('va-checkbox[name="accept-agreement"]')).to.have.attribute(
      'checked',
      'true',
    );

    expect($('va-checkbox[name="accept-agreement"]')).to.not.have.attribute(
      'error',
    );

    expect(
      screen.findAllByText(/You must accept the beneficiary travel agreement/i),
    ).to.be.empty;
  });
});
