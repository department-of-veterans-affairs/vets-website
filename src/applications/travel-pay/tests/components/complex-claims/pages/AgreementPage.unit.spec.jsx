import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as recordEventModule from 'platform/monitoring/record-event';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import AgreementPage from '../../../../components/complex-claims/pages/AgreementPage';
import reducer from '../../../../redux/reducer';

describe('Travel Pay – AgreementPage', () => {
  let recordEventStub;

  beforeEach(() => {
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    recordEventStub.restore();
  });

  const getData = () => ({
    travelPay: {
      claimSubmission: { isSubmitting: false, error: null, data: null },
    },
  });

  it('should render the agreement page correctly', () => {
    const screen = renderWithStoreAndRouter(<AgreementPage />, {
      initialState: getData(),
      reducers: reducer,
    });

    expect(
      screen.getByRole('heading', { name: /beneficiary travel agreement/i }),
    ).to.exist;

    expect(screen.getByText(/Penalty statement:/i)).to.exist;
    expect(screen.getByText(/severe criminal and civil penalties/i)).to.exist;

    expect(screen.getByTestId('travel-agreement-content')).to.exist;

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    expect(checkbox).to.exist;
    expect(checkbox).to.have.attribute('checked', 'false');
    expect(checkbox).to.not.have.attribute('error');

    expect($('va-button-pair')).to.exist;
  });

  it('should show an error when submitting without checking the box', () => {
    renderWithStoreAndRouter(<AgreementPage />, {
      initialState: getData(),
      reducers: reducer,
    });

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    expect(checkbox).to.exist;
    expect(checkbox).to.have.attribute('checked', 'false');

    // Simulate clicking Submit
    $('va-button-pair').__events.primaryClick();

    const errorCheckbox = $('va-checkbox[name="accept-agreement"]');
    expect(errorCheckbox).to.have.attribute(
      'error',
      'You must accept the beneficiary travel agreement before continuing.',
    );
  });

  it('should clear error when checkbox is checked and submit is clicked', () => {
    renderWithStoreAndRouter(<AgreementPage />, {
      initialState: getData(),
      reducers: reducer,
    });

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    checkbox.__events.vaChange(); // simulate user checking box

    expect(checkbox).to.have.attribute('checked', 'true');

    $('va-button-pair').__events.primaryClick();

    const updated = $('va-checkbox[name="accept-agreement"]');
    expect(updated).to.not.have.attribute('error');
  });

  it('should toggle the checkbox on multiple clicks', () => {
    renderWithStoreAndRouter(<AgreementPage />, {
      initialState: getData(),
      reducers: reducer,
    });

    const checkbox = $('va-checkbox[name="accept-agreement"]');
    expect(checkbox).to.have.attribute('checked', 'false');

    checkbox.__events.vaChange();
    expect(checkbox).to.have.attribute('checked', 'true');

    checkbox.__events.vaChange();
    expect(checkbox).to.have.attribute('checked', 'false');
  });

  it('should handle Back button click without errors', () => {
    const onBackSpy = sinon.spy();

    renderWithStoreAndRouter(<AgreementPage onBack={onBackSpy} />, {
      initialState: getData(),
      reducers: reducer,
    });

    const buttonPair = $('va-button-pair');
    expect(buttonPair).to.exist;

    buttonPair.__events.secondaryClick();
    expect(true).to.be.true; // no crash, no exception
    expect(onBackSpy.calledOnce).to.be.true;
  });
});
